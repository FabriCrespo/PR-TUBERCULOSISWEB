// src/pages/Home.js
import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
//import './About'
import './Home.css';

const Home = () => {
    const [redesSalud, setRedesSalud] = useState([]);

    useEffect(() => {
      // Hacemos una solicitud al backend para obtener los datos de los alimentos
      fetch('http://localhost:3001/api/redsalud')
        .then((response) => response.json())
        .then((data) => setRedesSalud(data))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);
  
  return (
    <Layout>
      <div className='hero'>
        <div className='container'>
          <h1>PROGRAMA TUBERCULOSIS - Cochabamba</h1>
          <p>Servicio Departamental de Salud Cochabamba SEDES - Programa de TUBERCULOSIS</p>
        </div>
      </div>

      <h2>Lista de Redes de Salud</h2>
      <ul>
        {redesSalud.map((redSalud) => (
          <li key={redSalud.id}>{redSalud.nombreRedSalud}</li>  // Ajusta los campos según tu base de datos
        ))}
      </ul>
    </Layout>
  );
};

export default Home;
