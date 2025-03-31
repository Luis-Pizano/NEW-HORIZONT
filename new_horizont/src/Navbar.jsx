import React from "react"
import './Navbar.css'

const Navbar = () =>{
    return (
    <nav>
        <div class="link-home">
            <a href="" class="link">Home</a>
        </div>
        <ul>
            <li><a href="#" class="link">Nuestros Ejemplares</a></li>
            <li><a href="#" class="link">Nuestras Razas</a></li>
            <li><a href="#"  class="link">Registro</a></li>
            <li><a href="#" class="link ">Login</a></li>
            <li><a href="#" class="link">Cuentas</a></li>
            <li><a href="#"  class="link">Logout</a></li>

            <form action="#">
                <div className="buscador">
                 <input type="search" name="search" id="search"/>
                </div>
                
            </form>
        </ul>
    </nav>
    )
}
export default Navbar