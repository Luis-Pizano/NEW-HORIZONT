import React from "react";
import styles from "../styles/login.module.css";

const Login = () => {
  return (
    <div className={styles.fondo}>
      <div className={styles.loginContainer}>
      <div className={styles.contenido}>
        <div className={styles.loginForm}>
        <input type="email" name="email" id="email" />
          <label>Email</label>
        </div>
        <div className={styles.loginForm}>
        <input type="password" name="password" id="password" />
          <label>Contraseña</label>
        </div>
        <button type="submit" className = {styles.Submit}>Login</button>
      </div>
    </div>
    </div>
  );
};

export default Login;
