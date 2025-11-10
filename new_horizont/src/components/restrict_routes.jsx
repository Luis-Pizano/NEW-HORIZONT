import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification_Info from "./Notification_info";

const Protected = ({ EndPoint }) => {
    const [modal, setModal] = useState(false);
    const Navigate = useNavigate();
    const token = localStorage.getItem("token");

    //Si no hay token redirige al usuario al login
    useEffect(() => {
        setModal(true);
        setTimeout(() => { Navigate("/login"); }, 3000);

    })

    if (!token) {
        return (
            <>
                {modal && (
                    <Notification_Info message="Debe iniciar sesión para acceder a este módulo." />
                )}
            </>

        )

    }
    return EndPoint;
}

// Si hay token, muestra el componente protegido



export default Protected;