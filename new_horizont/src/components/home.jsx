import React  from "react";
import "../styles/home.css";

const Home = () =>{
    return(
        <div className="container">
            <h1>Bienvenido a new horizont</h1>
            <div className="contenido">
                <div className="information"><p>
                    <h2>¿Quienes Somos?</h2>
                    New Horizont es un observatorio espacial el cual esta centrado 
                    en la investigación de fenome espaciales los cuales son documentados y analizados por los mejores astronomos para posteriormente compartir nuestros hallazgos con el mundo
                </p>
                </div>
                <div className="information">
                    <h2>¿Por que compartimos nuestros hallazgos?</h2>
                    <p>Nuestra razon de compartir nuestros hallazgos radica en nuestra etica de transparencia como organización, la cual nos dicta que el conocimiento debe ser publico y de uso libre para que las presonas conozcan aquello que esta más alla de nuestro planeta</p>
                </div>
                <div className="information"></div>
                <div className="information"></div>
            </div>
        </div>

    )
}
export default Home;