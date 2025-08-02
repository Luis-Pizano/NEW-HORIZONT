import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/update_tema.module.css"

const UpdatefromTema = () => {

    const [showModal, setShowModal] = useState(false); // Estado para modal de confirmación

    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState("");

    const { id } = useParams();

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        file: ""
    });

    const Navigate = useNavigate()

    //Precargar datos del tema actual
    useEffect(() => {
        const fetchTema = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/theme_detail/${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener el tema');
                }

                const data = await response.json();
                setFormData({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    file: data.file, // el archivo no lo podemos prellenar por seguridad
                });

                if (data.imagen) {
                    setPreviewUrl(`data:${data.mime_type};base64,${data.imagen}`);
                }
            } catch (error) {
                console.error("Error al obtener el tema:", error);
            }
        };

        fetchTema();
    }, [id]);
    // Fin de la funcion de precarga

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

    const clear = useRef(null);
    const inputsave = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Editar tema
    const saveChanges = async (e) => {
        e.preventDefault(); // Evita que recargue la página

         if (!formData.file) {
        alert("Debes seleccionar una imagen antes de continuar.");
        return;
    }

        const formDataToSend = new FormData();
        formDataToSend.append("nombre", formData.nombre);
        formDataToSend.append("descripcion", formData.descripcion);
        formDataToSend.append("file", formData.file);

        try {
            const response = await fetch(`http://localhost:8080/api/editar_tema/${id}`, {
                method: "PUT",
                body: formDataToSend, // sin headers, el navegador lo establece
            });

            const data = await response.json();

            if (response.ok) {
                setPreviewUrl(null);
                if (clear.current) clear.current.value = null;
                alert("Éxito en la actualización de contenido.");
                Navigate("/Temas")
            } else {
                alert("Ocurrió un error inesperado, intenta recargar la página.");
            }
        } catch (error) {
            alert(`Error del servidor: ${error}`);
            console.error("Error del servidor:", error);
        } finally {
            setShowModal(false);
        }
    };

    const Modal = (e) => {
        e.preventDefault();
        setShowModal(true);
    };



    return (
        <div className={styles.fondo}>
            <div className={styles.row_1}></div>
            <div className={styles.row_2}></div>
            <div className={styles.container}>
                <div className={styles.contenido}>
                    <form onSubmit={Modal} className={styles.form}>
                        <h2>Actualizar elemento</h2>
                        <label htmlFor="#">Nombre del elemento</label>
                        <input type="text" name="nombre" id="nombre" onChange={inputsave} value={formData.nombre} />
                        <label htmlFor="#">Descripcion del elemento</label>
                        <textarea name="descripcion" id="descripcion" className={styles.descripcion} onChange={inputsave} placeholder="Añade una descripción" value={formData.descripcion}></textarea>
                        <input type="file" name="file" id="file" onChange={handleFileChange} ref={clear} />
                        <div className={styles.previsualizar}>
                            <img src={previewUrl} alt="" width="250" />
                        </div>
                        <div className={styles.acciones}>
                            <a href="/Temas" className={styles.cancelar}>Cancelar</a>
                            <button type="submit" className={styles.submit}>Subir</button>
                        </div>

                    </form>
                </div>
            </div>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>¿Estás seguro de actualizar este elemento?</h3>
                        <div className={styles.modalButtons}>
                            <button onClick={() => setShowModal(false)} className={styles.cancelar}>Cancelar</button>
                            <button onClick={saveChanges} className={styles.submit}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}

export default UpdatefromTema;