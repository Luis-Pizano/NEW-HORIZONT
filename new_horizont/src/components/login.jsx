import React from "react";
import styles from "../styles/login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [login, setlogin] = useState({
    email: "",
    password: ""
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setlogin({
      ...login,
      [name]: value
    })
  }

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)

      })
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        navigate("/")
        console.log("Login exitoso.")
      }

      else {
        console.error("Ocurrio un error en el login.")
      }
    } catch (error) {
      console.error(`Ocurrio un error en el servidor interno.`)

    }

  }

  return (
    <div className={styles.fondo}>
      <div className={styles.loginContainer}>
        <div className={styles.contenido}>
          <form onSubmit={handleLogin}>
            <h1 className={styles.login}>Login</h1>
            <div className={styles.loginForm}>
              <input type="email" name="email" id="email" placeholder=" " onChange={handleChange} />
              <label>Email</label>
            </div>
            <div className={styles.loginForm}>
              <i className="fa-solid fa-eye-slash" id="eye" onClick={button}></i>
              <input type="password" name="password" id="password" placeholder=" " onChange={handleChange} />
              <label>Contraseña</label>
            </div>
            <div className={styles.return_login}>
              <a href="/registro" className={styles.not_register}>¿No estas registrado?, registrate</a>
            </div>
            <button type="submit" className={styles.Submit}>Login</button>

          </form>

        </div>
      </div>
    </div>
  );
};

const button = () => {
  const icon = document.getElementById("eye")
  const password = document.getElementById("password")
  if (password.type === "password") {
    password.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  }
  else {
    password.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}
export default Login;
