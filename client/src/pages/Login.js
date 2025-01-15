/* src/pages/Login.js */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Cookies
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import './Login.css';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState(''); // Nombre de usuario
  const [contrasenia, setContrasenia] = useState(''); // Contraseña
  const [passwordError, setPasswordError] = useState(""); // Error de contraseña
  const [error, setError] = useState(""); // Mensajes de error
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const INACTIVITY_TIME = 10 * 60 * 1000;
  //const INACTIVITY_TIME = 10;
  let inactivityTimeout;

  // VALIDACIONES
  const validateTextInput = (e) => {
    const regex = /^[A-Za-z]+$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const validatePasswordInput = (e) => {
    const regex = /^[0-9]*$/;
    const password = e.target.value;

    if (e.key === ' ' || !regex.test(e.key)) {
      e.preventDefault();
    }
    if (password.length > 0 && password[password.length - 1] === e.key) {
      e.preventDefault();
    }
  };

  const validatePassword = (password) => {
    const minLength = 6;
    if (password.length <= minLength) {
      return "La contraseña debe tener al menos 7 caracteres.";
    } else if (!/^\d+$/.test(password)) {
      return "La contraseña debe contener solo números.";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    setContrasenia(e.target.value);
    const errorMessage = validatePassword(e.target.value);
    setPasswordError(errorMessage);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const c_nombreUsuario = nombreUsuario.trim();
    const c_contrasenia = contrasenia.trim();

    try {
      const response = await fetch(`http://localhost:3001/api/login?nombreUsuario=${encodeURIComponent(c_nombreUsuario)}&contrasenia=${encodeURIComponent(c_contrasenia)}`);
      const data = await response.json();



      if (response.ok && data.rol) {
        const userRole = data.rol.toLowerCase();
        localStorage.setItem('userRole', userRole);

        // COOKIES
        Cookies.set('persona_idPersona', data.Nro, { expires: 1 });
        Cookies.set('username', c_nombreUsuario, { expires: 1 });
        Cookies.set('rol', userRole, { expires: 1 });
        Cookies.set('establecimientoId', data.establecimiento.id, { expires: 1 });
        Cookies.set('establecimientoNombre', data.establecimiento.nombre, { expires: 1 });


        
        setIsLoggedIn(true);
        startInactivityTimer();

        // NAVEGACION SEGUN EL ROL
        const roleRoutes = {
          'administrador': '/home',
          'medico': '/home',
          'enfermero/a': '/home',
          'superadmin': '/home',
        };

        navigate(roleRoutes[userRole] || '/');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error de conexión, intente nuevamente');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = validatePassword(contrasenia);
    if (errorMessage) {
      setPasswordError(errorMessage);
    } else {
      handleLogin(e);
    }
  };

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      clearCookies();
    }, INACTIVITY_TIME);
  };
  const clearCookies = () => {
    Cookies.remove('persona_idPersona');
    Cookies.remove('username');
    Cookies.remove('password');
    Cookies.remove('rol');
    alert('Por inactividad, se cerró tu sesión.');
    setIsLoggedIn(false); 
    navigate('/'); 
  };
  useEffect(() => {
    const resetTimer = () => startInactivityTimer();

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, []);


  return (
    <Layout>
      <section className="section-signin">
        <div className="box">
          <div className="container-doc">
            <div className="top">
              <span className="text-title">¿Tienes una cuenta?</span>
              <h2>Inicie sesión en su cuenta</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input
                  type="text"
                  className="input"
                  placeholder="Ingrese su nombre de usuario"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  onKeyPress={validateTextInput}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="password"
                  className="input"
                  placeholder="Ingrese su contraseña"
                  value={contrasenia}
                  onChange={handlePasswordChange}
                  onKeyPress={validatePasswordInput}
                  required
                />
                <i className="fa-solid fa-lock"></i>
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
              <div className="input-field btn-submit">
                <button type="submit">Iniciar sesión</button>
              </div>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;

