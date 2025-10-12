import React, { useState } from "react";
import { Link } from "react-router-dom"; // 👈 Importar Link
import './Navbar.css';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        if (searchTerm.trim() !== "") {
            navigate(`/search/${encodeURIComponent(searchTerm)}`); // Redirige a /search/:q
            setSearchTerm(""); // Opcional: limpia el input
        }
    };

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
                    {isOpen && (
                        <ul>
                            <li><Link to="/Cuentas" className="link">Cuentas</Link></li>
                            <li><Link to="/logout" className="link">Logout</Link></li>
                        </ul>
                    )}
                </li>


                <form onSubmit={handleSubmit} className="buscador-form">
                    <div className="buscador">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                        />
                        <button className="button-search" type="submit">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
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
