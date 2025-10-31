import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/get_them.module.css";
import "../styles/loading.css";                      // <-- este es global, sin 'styles'



const Search = () => {
    const { q } = useParams();
    const [loading, setLoading] = useState(false);
    const [temas, setTemas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const TemasPorPagina = 16;

    const navigate = useNavigate();

    const verDetalle = (id) => {
        navigate(`/tema/${id}`);
    }

    const update = (id) => {
        navigate(`/Actualizar-tema/${id}`)
    }

    const handleSearch = async () => {
        setLoading(true)
        try {

            const response = await fetch(`http://localhost:8080/api/search?search=${q}`);

            console.log('Status:', response.status, 'Content-Type:', response.headers.get('content-type'));
            const json = await response.json();

            setTemas(json.data);
            console.log(`Confirmación de informacion llegando, ${json.data}`);
            if (response.ok) {
                console.log(`Busqueda exitosa.`);

            } else {
                console.log('Ocurrio un error dentro de esta operacion.')
            }



        } catch (error) {
            console.error(`Error en la busqueda, Error ${error}`);

        } finally {
            setLoading(false)
        }
    }

    const startIndex = (currentPage - 1) * TemasPorPagina;
    const endIndex = startIndex + TemasPorPagina;
    const TemasVisibles = temas.slice(startIndex, endIndex);

    const totalPages = Math.ceil(temas.length / TemasPorPagina)

    const siguientePagina = () =>{
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            
        }
    }

    const anteriorPagina = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    React.useEffect(() => {
        setCurrentPage(1)
        handleSearch();
    }, [q]); // <-- Ejecuta la búsqueda cada vez que cambia el parámetro q

    if (loading) {
        return (
            <p className="loading">
                Cargando<span className="dot1">.</span>
                <span className="dot2">.</span><span className="dot3">.</span>
            </p>
        )
    }


    return (
        <div className={styles.fondo}>


            <div className={styles.container}>
                <div className={styles.contenido}>
                    <h1>Resultado de busqueda para {q} </h1>

                    <section className={styles.section_cards}>
                        {temas.length > 0 ? (
                            TemasVisibles.map((tema, index) => (
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
                                            <button onClick={() => update(tema.id)}>
                                                <i className="fa-solid fa-file-pen"></i>
                                            </button>
                                            <p>Presiona saber más para obtener información sobre esta imagen</p>
                                            <button className={styles.btn_redirect} onClick={() => verDetalle(tema.id)}>Saber más</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron resultados para "{q}"</p>
                        )}
                    </section>
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
}

export default Search;