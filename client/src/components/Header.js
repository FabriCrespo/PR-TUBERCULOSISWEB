// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';  // Importamos el archivo de estilo
import '../App.css';

const Header = () => {
  return (
    <header>
      <nav className="nav">
        <div className='container'>
          <h1 className='logo'><a href='./'>SEDES - TUBERCULOSIS</a></h1>
          <ul>
            <li><a href='./' className='current'>Inicio</a></li>
            <li><a href='./about' className='current'>Sobre Nosotros</a></li>
            <li><a href='./pacientes'>Pacientes</a></li>
            <li><a href='./medicos'>Doctores</a></li>
            <li><a href='./'>Establecimientos</a></li>
            <li><a href='./transferencia'>Transferencia</a></li>
            <li><a href='./login'>Login</a></li>
          </ul>
        </div>
      </nav>
      
    </header>
  );
};

export default Header;



/*  
<nav className='navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3' id='navImpo'>
        <div className='container d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <a href='/'>
              <div className='logo-container bg-white p-2 rounded' id='divImport'>
                <img className='img-fluid logo-img' src='' alt='SEDES'></img>
              </div>
            </a>
          </div>

          <button className='navbar-toggler' type='button' data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='navbar-collapse collapse d-sm-inline-flex justify-content-between' id='navbarNav'>
            <ul className='navbar-nav flex-grow-1'>
              <li className='nav-item'>
                <a className='nav-link text-white-50' href='/'>Inicio</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link text-white-50' href='/'>Pacientes</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link text-white-50' href='/'>Doctores</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link text-white-50' href='/'>Establecimientos</a>
              </li>

            </ul>

            <div className='d-flex align-items-center'>
              <a href='/accout/login' className='btn login-btn bg-white ms-auto me-3' >Sign In</a>
              <ul className='header-sns d-flex list-unstyled mb-0'>
                <li className='ms-3'>
                  <a href='https://www.facebook.com/' target='_blank' rel='noreferrer' title='Facebook' ap-click-area="header" ap-click-name="Click header" ap-click-data="Facebook">
                    <img src='/images/a/header_facebook.png' alt='Facebook'></img>
                  </a>
                </li>
                <li className='ms-3'>
                  <a href='https://www.instagram.com/' target='_blank'></a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </nav>
*/