import React from "react";
import styles from "../styles/Home.module.css";

const Home = () => {
    return (
        <div className={styles.fondo}>
            <div className={styles.container}>
                <h1 className={styles.titulo}>Bienvenido a new horizont</h1>
                <div className={styles.contenido}>
                    <div className={styles.information}>
                        <h2>¿Quiénes Somos?</h2>
                        <p>
                            New Horizont es un observatorio espacial centrado en la investigación de fenómenos espaciales los cuales son documentados y analizados por los mejores astrónomos para posteriormente compartir nuestros hallazgos con el mundo.
                        </p>
                    </div>
                    <div className={styles.information}>
                        <h2>¿Por qué compartimos nuestros hallazgos?</h2>
                        <p>
                            Nuestra razón de compartir radica en nuestra ética de transparencia como organización. Creemos que el conocimiento debe ser público y de uso libre para que las personas conozcan aquello que está más allá de nuestro planeta.
                        </p>
                    </div>
                    <div className={styles.information}>
                        <h2>Información</h2>
                        <p>
                            Si quieres subir algun tipo de contenido a nuestra pagina primero debes inicar sesión, una vez hecho esto en la barra 
                            superior se te habilitara el link <strong>"Subir contenido"</strong>              
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
