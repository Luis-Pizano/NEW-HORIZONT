import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification_Info from "./Notification_info";

const Protected = ({ children }) => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    useEffect(() => {
        // Si NO cumple las condiciones, mostrar modal + redirigir
        if (!token || rol !== "administrador") {
            setModal(true);
            const timer = setTimeout(() => navigate("/"), 3000);

            return () => clearTimeout(timer);
        }
    }, [token, rol, navigate]);

    // -------------------------
    // Mostrar mensajes de error
    // -------------------------

    if (!token) {
        return (
            <>
                {modal && (
                    <Notification_Info 
                        message="Debe iniciar sesión para acceder a este módulo." 
                    />
                )}
            </>
        );
    }

    if (rol !== "administrador") {
        return (
            <>
                {modal && (
                    <Notification_Info 
                        message="Solo los administradores pueden acceder a este módulo." 
                    />
                )}
            </>
        );
    }

    // -------------------------
    // SI TIENE PERMISOS → carga página
    // -------------------------
    return children;
};

export default Protected;
