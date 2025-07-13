import React from "react";
import styles from "../styles/tema_detail.module.css";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";


const Tema_detail = () => {

    const { id } = useParams();
    const [tema, setTema] = useState(null);
    const [temaActual, setTemaActual] = useState("claro");

    const Methodget = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/theme_detail/${id}`);
            const result = await response.json();
            if (response.ok) {
                console.log('Exito en la operación.')
                console.log(result);
                setTema(result);
            }
            else {
                console.log('Ocurrio un error dentro de esta operacion.')
            }
        } catch (error) {
            alert(`Hubo un error en el servidor, Error: ${error}`);
        }
    }

    useEffect(() => { Methodget(); }, [id]);

    useEffect(() => {
    if (temaActual === "claro") {
        document.body.style.background = "#f5f5f5";
        document.body.style.color = "black"; // Letras negras
    } else {
        document.body.style.background = "#121212";
        document.body.style.color = "white"; // Letras blancas
    }
}, [temaActual]);

    if (tema == null) {
        return (
            <p className={styles.loading}>
                Cargando<span className={styles.dot1}>.</span>
                <span className={styles.dot2}>.</span><span className={styles.dot3}>.</span>
            </p>
        )
    }

    return (
        <>
            <div className={styles.image_container}>
                <div className={styles.temas}>
                <label htmlFor="tema-claro" style={{ color: temaActual === "claro" ? "black" : "white" }}>Tema Claro</label>
                <input type="radio" name="tema" id="tema-claro" value="claro"
                 checked={temaActual === "claro"} onChange={() => setTemaActual("claro")}/>

                <label htmlFor="tema-oscuro" style={{ color: temaActual === "claro" ? "black" : "white" }}>Tema Oscuro</label>
                <input type="radio" name="tema" id="tema-oscuro" value="oscuro"
                 checked={temaActual === "oscuro"} onChange={() => setTemaActual("oscuro")}/>
            </div>
                <img src={`data:${tema.mime_type};Base64,${tema.imagen}`} alt={tema.nombre} />
            </div>

            <section className={styles.section}>
                <div className={styles.nombre}>
                    <h1>{tema.nombre}</h1>
                </div>
                <div className={styles.descripcion}>
                    <p>{tema.descripcion}</p>
                </div>
            </section>

            
        </>
    );
};

export default Tema_detail;