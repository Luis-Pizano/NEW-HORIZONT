import React, { useState } from "react";
import styles from "../styles/register.module.css";
import { Navigate, useNavigate } from "react-router-dom";
const Register = () => {
    // Estado local para almacenar los datos del formulario
    const [phoneError, setPhoneError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        last_name_father: "",
        last_name_Mother: "",
        phone_number: "",
        email: "",
        password: ""
    });

    // Hook de navegación para redirigir al usuario después del registro
    const Navigate = useNavigate();

    // Maneja los cambios en los inputs del formulario y actualiza el estado formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone_number") {
            const onlyNumbers = /^[0-9]*$/;
            if (!onlyNumbers.test(value)) {
                setPhoneError("Solo puede ingresar números");
            } else {
                setPhoneError("");
            }
        }
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
        try {
            // Se realiza una solicitud POST a la API de registro con los datos del formulario
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData) // Convierte el objeto formData en JSON
            });
    
            // Se espera la respuesta de la API y se convierte a JSON
            const data = await response.json();
            console.log("Respuesta de la API:", data); // Verifica lo que llega
    
            // Si la respuesta fue exitosa, se muestra un mensaje y se redirige al login
            if (response.ok) {
                alert("Registro exitoso");
                Navigate("/Login");
            } else {
                // Si hubo un error, se muestra el mensaje de error recibido desde el backend
                alert("Error en el registro: " + (data.error || 'Error desconocido'));
            }
        } catch (error) {
            // Manejo de errores de red u otros problemas
            console.error("Error al enviar el formulario:", error);
            alert("Ocurrió un error al enviar el formulario.");
        }
    };
    
    // A partir de aquí se retorna el formulario que ve el usuario


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
                            {phoneError && <p className={styles.error}>{phoneError}</p>}
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
