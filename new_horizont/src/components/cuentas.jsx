import React, { useEffect, useState } from "react";
import styles from "../styles/cuentas.module.css";
import { data } from "react-router-dom";

const Cuentas = () => {

    const [cuentas, setCuentas] = useState([])

    useEffect(() => {
        const fetchCuentas = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/cuentas");

                const result = await response.json();
                if (response.ok) {
                    console.log(`Exito en el select para cuentas, ${result}`);
                    setCuentas(result);
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

    },[]);

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