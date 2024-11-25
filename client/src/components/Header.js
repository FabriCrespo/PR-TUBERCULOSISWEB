/* src/components/Header.js */

import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../App.css';

const Header = () => {

  const userRole = Cookies.get('rol');  // "SuperAdministrador", "Administrador", "Doctor"


  // REDERIZADO DE RUTAS SEGUN EL ROL
  const renderLinks = () => {
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
    } else if (userRole === 'doctor') {
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
          {/* <Link className="nav-link logout" to="/">Cerrar Sesión</Link> */}
        </li>
      );
    }
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
