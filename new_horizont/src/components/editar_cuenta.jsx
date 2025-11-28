import React, { useEffect, useState } from "react";
import styles from "../styles/editar_cuenta.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Notification_Success from "./Notification_Success";
import Notification_Error from "./Notification_Error";

const Editar_Cuenta = () => {

    const [notification, setNotification] = useState(null); // success | error

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

    const { id } = useParams();

    // Hook de navegación para redirigir al usuario después del registro
    const navigate = useNavigate();

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

    // Precargar datos de cuenta
    useEffect(() => {
        const Precargar = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/Cuenta/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setFormData({
                        name: data.NOMBRE,
                        last_name_father: data.APELLIDO_PATERNO,
                        last_name_Mother: data.APELLIDO_MATERNO,
                        phone_number: data.TELEFONO,
                        email: data.CORREO,
                        password: "" // No traigas password del backend
                    });
                }
            } catch (error) {
                console.error(`Error en precargar los datos, Error: ${error}`);
            }
        };

        Precargar();
    }, [id]);


    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        try {
            // Se realiza una solicitud POST a la API de registro con los datos del formulario
            const response = await fetch(`http://localhost:8080/api/editar_cuenta/${id}`, {
                method: "PUT",
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
                setNotification("success"); // Muestra notificación de éxito
                setTimeout(() => navigate("/Cuentas"), 3000); // Redirige después de 4s
            } else {
                setNotification("error"); // Muestra notificación de error
                setTimeout(() => { window.location.reload() }, 30000);
            }
        } catch (error) {
            // Manejo de errores de red u otros problemas
            console.error("Error al enviar el formulario:", error);
            alert("Ocurrió un error al enviar el formulario.");
        }
    };

    return (

        <div className={styles.fondo}>

            {/* Notificaciones */}
            {notification === "success" && (
                <Notification_Success message={`Cuenta ${id} actualizada exitosamente.`} />
            )}
            {/* Notificaciones */}
            {notification === "error" && (
                <Notification_Error />
            )}

            <div className={styles.container}>
                <div className={styles.contenido}>
                    <h2>Registro</h2>
                    {/* <button onClick={testing}>testing</button> */}

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
                        <div className={styles.controllers}>
                            <button type="submit" className={styles.btn_register}>Editar</button>
                            <a href="/cuentas" className={styles.cancelar}>Cancelar</a>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editar_Cuenta;
