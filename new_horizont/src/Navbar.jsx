import React, { useState } from "react";
import { Link } from "react-router-dom"; // 👈 Importar Link
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav>
            <div className="link-home">
                <Link to="/" className="link">Home</Link>
            </div>
            <ul>
                <li><Link to="/Subir_elemento" className="link">Subir contenido</Link></li>
                <li><Link to="/Temas" className="link">Nuestros temas</Link></li>
                <li><Link to="/registro" className="link">Registro</Link></li>
                <li><Link to="/login" className="link">Login</Link></li>
                
                <li className="dropdown">
                    <button onClick={() => setIsOpen(!isOpen)}>Mi cuenta {isOpen ? "▲" : "▼"}</button>
                    { isOpen && (
                        <ul>
                            <li><Link to="/cuentas" className="link">Cuentas</Link></li>
                            <li><Link to="/logout" className="link">Logout</Link></li>
                        </ul>
                    )}
                </li>


                <form action="#">
                    <div className="buscador">
                        <input type="search" name="search" id="search" />
                    </div>
                </form>

                <div className="icon-burger">
                    <i className="fa-solid fa-bars"></i>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
