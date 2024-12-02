/* src/pages/ActualizarAdministrador.js */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const ActualizarAdministrador = () => {
  const { id } = useParams(); // Obtener el id del administrador desde la URL
  const navigate = useNavigate();
  const [administrador, setAdministrador] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    numeroCelular: '',
    CI: '',
    rol: 'Administrador',
    nombreEstablecimiento: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  // Cambié el estado inicial a `true`

  // Función para obtener los datos del administrador desde la API
  const obtenerAdministrador = async () => {
    try {
      setLoading(true);  // Establezco loading a `true` cuando empiezo a cargar
      const response = await axios.get(`http://localhost:3001/api/administradores/${id}`);
      
      // Verificamos si la respuesta tiene datos
      if (response.data) {
        setAdministrador(response.data); // El objeto ya está aquí, no necesitamos acceder a un arreglo
        setLoading(false);
      } else {
        setError('Administrador no encontrado.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al obtener el administrador:', error);
      setError('Hubo un error al cargar los datos. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };
  

  // Llamar a la función cuando el componente se monte
  useEffect(() => {
    obtenerAdministrador();
  }, [id]);

  // Función para manejar el cambio en los inputs del formulario
  const handleChange = (e) => {
    setAdministrador({
      ...administrador,
      [e.target.name]: e.target.value,
    });
  };

  // Función para actualizar el administrador
  const actualizarAdministrador = async (e) => {
    e.preventDefault();
    try {
      // Se envía el objeto 'administrador' al backend
      await axios.put(`http://localhost:3001/api/administradores/${id}`, administrador);
      alert('Administrador actualizado correctamente');
      navigate('/lista-admins'); // Redirigir a la lista de administradores
    } catch (error) {
      console.error('Error al actualizar el administrador:', error);
      setError('No se pudo actualizar el administrador. Intente de nuevo más tarde.');
    }
  };
  

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Actualizar Administrador</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Formulario para actualizar los datos del administrador */}
        {loading ? (
          <div className="text-center">Cargando...</div>
        ) : (
          <form onSubmit={actualizarAdministrador}>
            <div className="mb-3">
              <label className="form-label">Nombres</label>
              <input
                type="text"
                className="form-control"
                name="nombres"
                value={administrador.nombres}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Primer Apellido</label>
              <input
                type="text"
                className="form-control"
                name="primerApellido"
                value={administrador.primerApellido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Segundo Apellido</label>
              <input
                type="text"
                className="form-control"
                name="segundoApellido"
                value={administrador.segundoApellido}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Número de Celular</label>
              <input
                type="text"
                className="form-control"
                name="numeroCelular"
                value={administrador.numeroCelular}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">CI</label>
              <input
                type="text"
                className="form-control"
                name="CI"
                value={administrador.CI}
                onChange={handleChange}
                required
              />
            </div>
          
      
            <button type="submit" className="btn btn-success">
              Actualizar Administrador
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ActualizarAdministrador;
