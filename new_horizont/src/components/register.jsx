import React, { useState } from "react";
import styles from "../styles/register.module.css";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        last_name_father: "",
        last_name_Mother: "",
        phone_number: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registro exitoso");
                // Aquí podrías redirigir a otra página o limpiar el formulario
            } else {
                alert("Error en el registro: " + data.error);
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Ocurrió un error al enviar el formulario.");
        }
    };

    return (
        <div className={styles.fondo}>
            <div className={styles.container}>
                <div className={styles.contenido}>
                    <h2>Registro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Nombre/s</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="last_name_father">Apellido Paterno</label>
                            <input type="text" name="last_name_father" id="last_name_father" value={formData.last_name_father} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="last_name_Mother">Apellido Materno</label>
                            <input type="text" name="last_name_Mother" id="last_name_Mother" value={formData.last_name_Mother} onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone_number">Teléfono</label>
                            <input type="text" name="phone_number" id="phone_number" maxLength={9} value={formData.phone_number} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Correo</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className={styles.return_login}>
                            <a href="/login" className={styles.exintente_register}>¿Ya está registrado? Inicie sesión</a>
                        </div>
                        <button type="submit" className={styles.btn_register}>Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
