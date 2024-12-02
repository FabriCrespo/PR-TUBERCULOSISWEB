/* src/pages/ListaAdministradores.js */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const ListaAdministradores = () => {
  const navigate = useNavigate();
  const [administradores, setAdministradores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');

  // Función para obtener los administradores desde la API
  const obtenerAdministradores = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/administradores');
      console.log('Administradores obtenidos:', response.data);  // Verificación de la respuesta
      setAdministradores(response.data);
    } catch (error) {
      console.error('Error al obtener los administradores:', error);
      setError('Hubo un error al cargar los datos. Por favor, intenta nuevamente.');
    }
  };

  // Llamar a la función para obtener los datos cuando el componente se monta
  useEffect(() => {
    obtenerAdministradores();
  }, []);

  // Función para eliminar un administrador
  const eliminarAdministrador = (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este administrador?');
    if (confirmed) {
      axios
        .delete(`http://localhost:3001/api/administradores/${id}`)
        .then(() => {
          obtenerAdministradores(); // Actualizar la lista
          alert('Administrador eliminado correctamente');
        })
        .catch((error) => {
          console.error('Error al eliminar administrador:', error);
          alert('No se pudo eliminar el administrador. Intente de nuevo más tarde.');
        });
    }
  };

  // Función para filtrar los administradores según el nombre
  const administradoresFiltrados = administradores.filter((admin) =>
    `${admin.nombres} ${admin.primerApellido} ${admin.segundoApellido || ''}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Lista de Administradores</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Botón para agregar nuevo administrador */}
        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-primary" onClick={() => navigate('/registrar-administrador')}>
            Agregar Nuevo Administrador
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-3" style={{ maxWidth: '300px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {/* Tabla de administradores */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CI</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Establecimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {administradoresFiltrados.length > 0 ? (
              administradoresFiltrados.map((admin) => (
                <tr key={admin.idPersona}>
                  <td>{`${admin.nombres} ${admin.primerApellido} ${admin.segundoApellido || ''}`}</td>
                  <td>{admin.CI}</td> {/* Mostrar CI */}
                  <td>{admin.numeroCelular}</td> {/* Mostrar Número de Teléfono */}
                  <td>{admin.rol}</td>
                  <td>{admin.nombreEstablecimiento}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/modificar-administrador/${admin.idPersona}`)}
                    >
                      <i className="bi bi-pencil me-1"></i>Modificar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarAdministrador(admin.idPersona)}
                    >
                      <i className="bi bi-trash-fill me-1"></i>Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ListaAdministradores;
