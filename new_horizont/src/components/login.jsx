import React from "react";
import styles from "../styles/login.module.css";

const Login = () => {
  return (
    <div className={styles.fondo}>
      <div className={styles.loginContainer}>
      <div className={styles.contenido}>
        <h1 className={styles.login}>Login</h1>
        <div className={styles.loginForm}>
        <input type="email" name="email" id="email" placeholder=" " />
          <label>Email</label>
        </div>
        <div className={styles.loginForm}>
        <i className="fa-solid fa-eye-slash" id="eye" onClick={button}></i>
        <input type="password" name="password" id="password" placeholder=" " />
          <label>Contraseña</label>
        </div>
        <button type="submit" className = {styles.Submit}>Login</button>
      </div>
    </div>
    </div>
  );
};
const button = () =>{
  const icon = document.getElementById("eye")
  const password = document.getElementById("password")
  if (password.type ==="password"){
    password.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  }
  else{
    password.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}
export default Login;
