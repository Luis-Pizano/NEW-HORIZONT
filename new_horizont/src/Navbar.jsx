import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // 👈 Importar Link
import './Navbar.css';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    // Estados para previsualizar imagen y nombre
    const [results, setResults] = useState([]); // resultados del backend
    const [showPreview, setShowPreview] = useState(false); // controla si se muestra el dropdown
    const searchRef = useRef(null); // referencia para detectar clic fuera
    // Fin de estados para previsualizar imagen y nombre
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        if (searchTerm.trim() !== "") {
            navigate(`/search/${encodeURIComponent(searchTerm)}`); // Redirige a /search/:q
            setSearchTerm(""); // limpia el input
        }
    };


    useEffect(() => {
        if (searchTerm.trim() === "") {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/search?search=${searchTerm}`);
                if (!res.ok) throw new Error("Error al buscar");
                const data = await res.json();
                setResults(data.data || []);
                setShowPreview(true);
            } catch (err) {
                console.error("Error en búsqueda:", err);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowPreview(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSelect = (tema) => {
        navigate(`/tema/${tema.id}`);
        setShowPreview(true);
        setSearchTerm("");
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


                <form onSubmit={handleSubmit} className="buscador-form" ref={searchRef}>
                    <div className="buscador">
                        <input type="search" name="search" id="search" value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."/>
                        <button className="button-search" type="submit">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>

                    {/* Dropdown de vista previa */}
                    {showPreview && results.length > 0 && (
                        <div className="search-preview">
                            {results.slice(0, 5).map((tema) => (
                                <div key={tema.id} className="preview-item" onClick={() => handleSelect(tema)}>
                                    {tema.imagen && tema.mime_type ? (
                                        <img src={`data:${tema.mime_type};base64,${tema.imagen}`} alt={tema.nombre} />
                                    ) : (
                                        <div className="no-image">🖼️</div>
                                    )}
                                    <span>{tema.nombre}</span>
                                </div>
                            ))}
                            {results.length > 5 && (
                                <div className="ver-todos" onClick={() => navigate(`/search/${searchTerm}`)}>
                                    Ver todos los resultados →
                                </div>
                            )
                            }
                        </div>
                    )}
                </form>

                <div className="icon-burger">
                    <i className="fa-solid fa-bars"></i>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
