import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import './Header.css';

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

  const handleLogout = () => {
    Cookies.remove('persona_idPersona');
    Cookies.remove('username');
    Cookies.remove('rol');
    Cookies.remove('establecimientoId');
    Cookies.remove('establecimientoNombre');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header bg-white p-3 rounded shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand text-primary" to="/home">
            Sistema Tuberculosis
          </Link>
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
