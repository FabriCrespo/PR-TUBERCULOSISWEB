import React from "react";
import './Account.css';

const Signin = ({ username, setUsername, password, setPassword, handleLogin }) => {
    return (
        <section className="section-signin">
            <div className="box">
                <div className="container-doc">
                    <div className="top">
                        <span className="text-title">¿Tienes una cuenta?</span>
                        <h2>Inicie sesión en su cuenta</h2>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-field">
                            <input type="text" className="input" placeholder="Ingrese su nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value) } required></input>
                        </div>
                        <div className="input-field">
                            <input type="password" className="input" placeholder="Ingrese su contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div className="input-field btn-submit">
                            <button type="submit">Iniciar sesión</button>
                        </div>
                    </form>

                    <div className="btn-redirect">
                        <p>
                            <a href="./register">¿No tiene una cuenta? Regístrese</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signin;

