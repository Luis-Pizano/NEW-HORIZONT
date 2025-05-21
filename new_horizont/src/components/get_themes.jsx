import React, { useState } from "react";
import styles from "../styles/get_them.module.css";

const Get_them = () => {
    const [temas, setTemas] = useState([]);

    const handleCard = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/all_temas");
            const result = await response.json();

            if (result.data && Array.isArray(result.data)) {
                const temasImagen = result.data.map(tema => ({
                    ...tema,
                     imagen: tema.imagen ? tema.imagen : null
                }));
                console.log("✅ Datos recibidos del backend:", temasImagen);

                setTemas(temasImagen);
            } else {
                console.warn("No se recibió un listado de imágenes.");
            }
        } catch (error) {
            console.error("Error al cargar imágenes de temas:", error);
        }
    };

    return (
        <div className={styles.fondo}>
            <div className={styles.container}>
                <div className={styles.contenido}>
                    <h1>Sección de contenido</h1>
                    <button className={styles.btn_cargar} onClick={handleCard}>
                        Cargar temas
                    </button>

                    <section className={styles.section_cards}>
                        {temas.map((tema, index) => (
                            <div key={index} className={styles.cardContainer}>
                                <div className={styles.card}>
                                    <div className={styles.front}>
                                        {tema.imagen && (
                                            <img src={`data:${tema.mime_type};base64,${tema.imagen}`} alt={`Imagen de ${tema.nombre}`} />
                                        )}
                                        <h2>{tema.nombre}</h2>
                                    </div>
                                    <div className={styles.back}>
                                        <p>Presiona saber más para obtener información sobre esta imagen</p>
                                        <button className={styles.btn_redirect}>Saber más</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Get_them;
