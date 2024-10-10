import React from "react";
import './Account.css';

const Signin = ({ correo, setCorreo, contrasenia, setContrasenia, handleLogin }) => {
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
                            <input type="email" className="input" placeholder="Ingrese el correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value) } required></input>
                        </div>
                        <div className="input-field">
                            <input type="password" className="input" placeholder="Ingrese la contraseña" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} required></input>
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

