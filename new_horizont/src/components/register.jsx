import React from "react";
import styles from "../styles/register.module.css";


const Register = () =>{
    return (
        <div className={styles.fondo}>
            <div className={styles.container}>
                <div className={styles.contenido}>
                    <h2>Registro</h2>
                    <form>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Nombre/s</label>
                            <input type="text" name="name" id="name" required/>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="last_name_father">Apellido Paterno</label>
                            <input type="text" name="last_name_father" id="last_name_father" required/>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="last_name_Mother">Apellido Materno</label>
                            <input type="text" name="last_name_Mother" id="last_name_Mother" />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone_number">Teléfono</label>
                            <input type="text" name="phone_number" id="phone_number" maxLength={9} required/>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Correo</label>
                            <input type="email" name="email" id="email" required/>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" name="password" id="password" required/>
                        </div>
                        <div className={styles.return_login}>
                        <a href="/login" className={styles.exintente_register}>¿Ya esta registrado?, inicia sesion</a>
                        </div>
                        <button type="submit" className={styles.btn_register}>Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register