import React from "react";
import { Link } from "react-router-dom"; // 👈 Importar Link
import './Navbar.css';

const Navbar = () => {
    return (
        <nav>
            <div className="link-home">
                <Link to="/" className="link">Home</Link> {/* 👈 usar Link */}
            </div>
            <ul>
                <li><Link to="/ejemplares" className="link">Nuestros Ejemplares</Link></li>
                <li><Link to="/razas" className="link">Nuestras Razas</Link></li>
                <li><Link to="/registro" className="link">Registro</Link></li>
                <li><Link to="/login" className="link">Login</Link></li>
                <li><Link to="/cuentas" className="link">Cuentas</Link></li>
                <li><Link to="/logout" className="link">Logout</Link></li>

                <form action="#">
                    <div className="buscador">
                        <input type="search" name="search" id="search" />
                    </div>
                </form>
            </ul>
        </nav>
    );
};

export default Navbar;
