/* src/components/Header.js */

import React  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import '../App.css';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const userRole = Cookies.get('rol');  // "SuperAdministrador", "Administrador", "Doctor"


  const routesByRole = {
    superadmin: [
     
      { path: "/lista-personal-salud", label: "Personal Salud" },
      { path: "/lista-establecimientos", label: "Establecimientos" },
      { path: "/seguimiento-tratamientos", label: "Seguimiento Tratamientos" },
      { path: "/lista-pacientes", label: "Pacientes" },
      { path: "/transferencia", label: "Transferencia" },
      { path: "/lista-admins", label: "Administradores" },
    ],
    administrador: [
      { path: "/lista-personal-salud", label: "Personal Salud" },
      // { path: "/lista-establecimientos", label: "Establecimientos" },
      { path: "/seguimiento-tratamientos", label: "Seguimiento Tratamientos" },
      { path: "/lista-pacientes", label: "Pacientes" },
      { path: "/transferencia", label: "Transferencia" },
    ],
    medico: [
      { path: "/seguimiento-tratamientos", label: "Seguimiento Tratamientos" },
      { path: "/lista-pacientes", label: "Pacientes" },
      { path: "/transferencia", label: "Transferencia" },
    ],
    "enfermero/a": [
      { path: "/lista-pacientes", label: "Pacientes" },
      { path: "/transferencia", label: "Transferencia" },
    ],
  };


  // REDERIZADO DE RUTAS SEGUN EL ROL
  /*const renderLinks = () => {
    if (userRole === 'superadministrador') {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/administrador">Directores de red de salud</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-personal-salud">Personal Salud</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-establecimientos">Establecimientos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/seguimiento-tratamientos">Seguimiento Tratamientos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-pacientes">Pacientes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/transferencia">Transferencia</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link logout" to="/">Cerrar Sesión</Link>
          </li>
        </>
      );
    } else if (userRole === 'administrador') {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-personal-salud">Personal Salud</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-establecimientos">Establecimientos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/seguimiento-tratamientos">Seguimiento Tratamientos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-pacientes">Pacientes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/transferencia">Transferencia</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link logout" to="/">Cerrar Sesión</Link>
          </li>
        </>
      );
    } else if (userRole === 'medico') {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/seguimiento-tratamientos">Seguimiento Tratamientos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-pacientes">Pacientes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/transferencia">Transferencia</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link logout" to="/">Cerrar Sesión</Link>
          </li>
        </>
      );
    } else if (userRole === 'enfermero/a') {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/lista-pacientes">Pacientes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/transferencia">Transferencia</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link logout" to="/">Cerrar Sesión</Link>
          </li>
        </>
      );
    } else {
      return (
        <li className="nav-item">
          {/* <Link className="nav-link logout" to="/">Cerrar Sesión</Link> *}
        </li>
      );
    }
  };*/
  const renderLinks = () => {
    const routes = routesByRole[userRole?.toLowerCase()] || [];
    return (
      <>
        {routes.map((route, index) => (
          <li key={index} className="nav-item">
            <Link className="nav-link" to={route.path}>
              {route.label}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <button className="nav-link logout btn-link" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </li>
      </>
    );
  };


  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Eliminar las cookies
    Cookies.remove('persona_idPersona');
    Cookies.remove('username');
    Cookies.remove('rol');
    Cookies.remove('establecimientoId');
    Cookies.remove('establecimientoNombre');

    setIsLoggedIn(false);

    // Redirigir al usuario a la página de inicio
    navigate('/');
  };


  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark custom-bg">
        <div className="container">
          <Link className="navbar-brand" to="/home">Sistema Tuberculosis</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto justify-content-center">

              {renderLinks()}

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
