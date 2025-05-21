import React, { useState, useRef } from "react";
import styles from '../styles/add_tema.module.css';

const File = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        file: "",
    });

    const clear = useRef(null);
    const inputsave = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const data_form = new FormData();
        data_form.append('nombre', formData.nombre);
        data_form.append('descripcion', formData.descripcion);
        if (formData.file) data_form.append('file', formData.file);

        try {
            const response = await fetch("http://localhost:8080/api/add_tema", {
                method: "POST",
                body: data_form
            });

            console.log(response); // Verifica la respuesta
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setFormData({
                    nombre: "",
                    descripcion: "",
                    file: "",
                });

                setPreviewUrl(null);
                if (clear.current) {
                    clear.current.value = null;
                };

                alert("Éxito en la operación.");
            } else {
                console.warn("La respuesta no es JSON. Content-Type:", contentType);
            }
        } catch (error) {
            alert(`Ocurrió un error inesperado, error: ${error}`);
            console.error(`Error: ${error}`);
        }
    };

    // Función de restricción de tipo de archivo admitido
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/', 'video/'];
            const isValid = validTypes.some((type) => file.type.startsWith(type));

            if (!isValid) {
                alert('No se admiten archivos diferentes a imagen o video');
                setPreviewUrl(null);
                e.target.value = ''; // Limpiar el campo de archivo
            } else {
                setError('');
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setFormData({
                    ...formData,
                    file: file
                });

                console.log('Archivo válido:', file);
            }
        }
    };

    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    return (
        <div className={styles.fondo}>
            <div className={styles.container}>
                <div className={styles.contenido}>
                    <form onSubmit={handleSave} className={styles.form}>
                        <h2>Subir elemento</h2>
                        <label htmlFor="#">Nombre del elemento</label>
                        <input type="text" name="nombre" id="nombre" onChange={inputsave} value={formData.nombre} required />
                        <label htmlFor="#">Descripcion del elemento</label>
                        <textarea name="descripcion" id="descripcion" className={styles.descripcion} onChange={inputsave} placeholder="Añade una descripción" value={formData.descripcion} required></textarea>
                        <input type="file" name="file" id="file" onChange={handleFileChange} ref = {clear} required />
                        <button type="submit" onSubmit={handleSave} className={styles.submit}>Subir</button>
                        <div className={styles.previsualizar}>
                            <img src={previewUrl} alt="" width="250" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default File;
