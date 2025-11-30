import React, { useEffect, useState } from "react";
import styles from "../styles/cuentas.module.css";
import { useNavigate, useParams } from "react-router-dom";

const Cuentas = () => {

    const [cuentas, setCuentas] = useState([])
    const rol = localStorage.getItem("rol")
    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();


    useEffect(() => {
        const fetchCuentas = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/cuentas");

                const result = await response.json();
                if (response.ok) {
                    console.log(`Exito en el select para cuentas, ${result}`);
                    setCuentas(result.filter(c => c.id !== Number(userId)));

                }
                else {
                    console.log(`Error en la operación de listado.`);
                    alert(`Ocurrio un error al tratar de listar las cuentas en este sistema.`);
                }

            } catch (error) {
                console.log(`Error en el select, error: ${error}`);

            }
        }
        fetchCuentas();

    }, []);

    const Editar = (id) => {
        navigate(`/Editar_cuenta/${id}`)
    }

    const eliminar_cuenta = async (id) => {
         if (!window.confirm("¿Deseas eliminar esta cuenta?")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/delete/${id}`,{
                method:"DELETE"
            })
            const data = await response.json();
            if (response.ok){
                console.log(`Cuenta eliminada correctamente, ${data}.`)
            // Actualizar la tabla sin recargar
            setCuentas(prev => prev.filter(c => c.id !== id));
        } else {
            alert("Error al eliminar la cuenta");
        }
        } catch (error) {
            console.error(`Error en la eliminación de la cuenta.`)
        }
    }

    return (
        <div className={styles.fondo}>
            <h2 className={styles.titulo}>Cuentas</h2>
            <div className={styles.list_cuentas}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido Paterno</th>
                            <th>Apellido Materno</th>
                            <th>Telefono</th>
                            <th>Correo</th>
                            <th>¿Es visitante?</th>
                            <th>¿Es administrador?</th>
                            <th>Fecha de creación</th>
                            {rol === "administrador" && (
                                <th>Editar</th>
                            )}
                            {rol === "administrador" && (
                                <th>Eliminar</th>
                            )}

                        </tr>
                    </thead>
                    <tbody>
                        {cuentas.map((cuenta) => (
                            <tr>
                                <td>{cuenta.nombre}</td>
                                <td>{cuenta.apellido_paterno}</td>
                                <td>{cuenta.apellido_materno}</td>
                                <td>{cuenta.telefono}</td>
                                <td>{cuenta.correo}</td>
                                <td>{cuenta.visitante ? "Si" : "No"}</td>
                                <td>{cuenta.administrador ? "Si" : "No"}</td>
                                <td>{new Date(cuenta.fecha_creacion).toLocaleDateString()}</td>
                                {rol === "administrador" && (
                                    <td><button className={styles.editar} onClick={() => Editar(cuenta.id)}><i class="fa-regular fa-pen-to-square"></i> Editar</button></td>
                                )}
                                {rol === "administrador" && (
                                    <td><button className={styles.eliminar} onClick={() => eliminar_cuenta(cuenta.id)}><i class="fa-solid fa-trash"></i> Eliminar</button></td>
                                )}

                            </tr>
                        )

                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Cuentas;