import React, { useState } from "react";
import styles from '../styles/add_tema.module.css';
const File = () =>{
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const validTypes = ['image/', 'video/']; //Define los tipos de archivos permitidos
        
        // startsWith permite comprobar si el archivo es de un tipo permitido
        const isValid = validTypes.some((type) => file.type.startsWith(type)); 

        if (!isValid) {
            alert('No se admiten archivos diferentes a imagen o video');
            setPreviewUrl(null);
            e.target.value = ''; // Limpia el input
        } else {
            setError('');
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            console.log('Archivo válido:', file);
        }
        }
    };

    return (
        <div className={styles.fondo}>
            <div className={styles.container}>
                <div className={styles.contenido}>
                    <form onSubmit="#" className={styles.form}>
                        <h2>Subir elemento</h2>
                        <label htmlFor="#">Nombre del elemento</label>
                        <input type="text" name="nombre" id="nombre" required/>
                        <label htmlFor="#">Descripcion del elemento</label>
                        <textarea name="descripcion" id="descripcion" className={styles.descripcion} placeholder="Añade una descripción" required></textarea>
                        <input type="file" name="file" id="file"  onChange={handleFileChange} required/>
                        <button type="submit" className={styles.submit}>Subir</button>
                        <div className={styles.previsualizar}>
                            <img src={previewUrl} alt="" width="250" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default File