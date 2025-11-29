import React, { useState } from "react";
import styles from "../styles/get_them.module.css";
import "../styles/loading.css";
import { useNavigate } from "react-router-dom";

const Get_them = () => {
    const [temas, setTemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const temasPorPagina = 8;

    const rol = localStorage.getItem("rol");

    const Navigate = useNavigate()

    const handleCard = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:8080/api/all_temas");
            const result = await response.json();

            if (Array.isArray(result)) {
                const temasImagen = result.map(tema => ({
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
        } finally {
            setLoading(false)
        }
    };

    const verDetalle = (id) => {
        Navigate(`/tema/${id}`);
    };
    const update = (id) => {
        Navigate(`/Actualizar-tema/${id}`)
    }

    if (loading == true) {
        return (
            <p className="loading">
                Cargando<span className="dot1">.</span>
                <span className="dot2">.</span><span className="dot3">.</span>
            </p>
        )
    }

    // Calcular los temas visibles en la página actual
    const startIndex = (currentPage - 1) * temasPorPagina;
    const endIndex = startIndex + temasPorPagina;
    const temasVisibles = temas.slice(startIndex, endIndex);

    // Calcular cuántas páginas hay
    const totalPages = Math.ceil(temas.length / temasPorPagina);

    // Funciones de paginación
    const siguientePagina = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const anteriorPagina = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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
                        {temasVisibles.map((tema, index) => (
                            <div key={index} className={styles.cardContainer}>
                                <div className={styles.card}>
                                    <div className={styles.front}>
                                        {tema.imagen && tema.mime_type ? (
                                            <img src={`data:${tema.mime_type};base64,${tema.imagen}`} alt={tema.nombre} />

                                        ) : (
                                            <p>Sin imagen</p>
                                        )}
                                        <h2>{tema.nombre}</h2>
                                    </div>
                                    <div className={styles.back}>
                                        {rol === "administrador" && (
                                            <button onClick={() => update(tema.id)}>
                                                <i className="fa-solid fa-file-pen"></i>
                                            </button>
                                        )}
                                        <p>Presiona saber más para obtener información sobre esta imagen</p>
                                        <button className={styles.btn_redirect} onClick={() => verDetalle(tema.id)}>Saber más</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                    {/* Controles de paginación */}
                    {temas.length > 0 && (
                        <div className={styles.pagination}>
                            <button onClick={anteriorPagina} disabled={currentPage === 1} className={styles.pageButton}>
                                <i class="fa-solid fa-arrow-left"></i> Anterior
                            </button>

                            <span>Página {currentPage} de {totalPages}</span>

                            <button onClick={siguientePagina} disabled={currentPage === totalPages} className={styles.pageButton}>
                                Siguiente <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Get_them;
