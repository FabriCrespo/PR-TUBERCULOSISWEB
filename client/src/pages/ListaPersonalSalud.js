/* src/pages/ListaPersonalSalud.js */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Layout from '../components/Layout';

const ListaPersonalSalud = () => {
  const navigate = useNavigate();
  const [personalSalud, setPersonalSalud] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('activo'); // POR DEFECTO SE MUESTRAN LOS ACTIVOS
  const [error, setError] = useState('');

  // Función para obtener el personal de salud desde la API
  /*const obtenerPersonalSalud = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/personalSalud');
      setPersonalSalud(response.data); // Guardar los datos obtenidos en el estado
    } catch (error) {
      console.error('Error al obtener el personal de salud:', error);
    }
  };*/

  // Llamar a la función para obtener los datos cuando el componente se monta
  /*useEffect(() => {
    obtenerPersonalSalud();
  }, []);*/

  // Función para obtener el personal activo desde la API
  const obtenerPersonalActivo = async () => {
    try {
      const establecimientoId = Cookies.get("establecimientoId"); // Obtener el ID del establecimiento
      const rol = Cookies.get("rol"); // Obtener el rol del usuario
      const response = await axios.get("http://localhost:3001/api/personalSalud", {
        params: { 
          establecimientoId, 
          search: filtro, 
          rol // Enviar el rol como parámetro
        },
      });
      setPersonalSalud(response.data);
    } catch (error) {
      console.error("Error al obtener el personal de salud activo:", error);
      setError("Hubo un error al cargar los datos. Por favor, intenta nuevamente.");
    }
  };
  

  // Función para obtener el personal inactivo desde la API
  const obtenerPersonalInactivo = async () => {
    try {
      const establecimientoId = Cookies.get("establecimientoId"); // Obtener el ID del establecimiento
      const response = await axios.get("http://localhost:3001/api/personalSaludInactivo", {
        params: { establecimientoId, search: filtro }, // Enviar parámetros
      });
      setPersonalSalud(response.data);
    } catch (error) {
      console.error("Error al obtener el personal de salud inactivo:", error);
      setError("Hubo un error al cargar los datos. Por favor, intenta nuevamente.");
    }
  };
  

  // Función para desactivar (poner estado en 0) un registro de personal de salud
  const desactivarPaciente = (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas desactivar este personal de salud?');
    if (confirmed) {
      console.log(`Desactivando personal de salud con ID: ${id}`); // Línea de depuración
      axios
        .put(`http://localhost:3001/api/pacientesDelete/${id}/estado`)
        .then(() => {
          actualizarLista();
          alert('Personal de salud desactivado correctamente');
        })
        .catch((error) => {
          console.error('Error al desactivar personal de salud:', error);
          alert('No se pudo desactivar el personal de salud. Intente de nuevo más tarde.');
        });
    }
  };

  // Función para reactivar (poner estado en 1) un registro de personal de salud
  const reactivarPaciente = (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas reactivar este personal de salud?');
    if (confirmed) {
      console.log(`Reactivando personal de salud con ID: ${id}`); // Línea de depuración
      axios
        .put(`http://localhost:3001/api/pacientesActive/${id}/estado`)
        .then(() => {
          actualizarLista();
          alert('Personal de salud reactivado correctamente');
        })
        .catch((error) => {
          console.error('Error al reactivar personal de salud:', error);
          alert('No se pudo reactivar el personal de salud. Intente de nuevo más tarde.');
        });
    }
  };

  // Función para actualizar la lista según el filtro seleccionado
  const actualizarLista = () => {
    if (estadoFiltro === 'activo') {
      obtenerPersonalActivo();
    } else {
      obtenerPersonalInactivo();
    }
  };

  // Actualizar la lista al cambiar el filtro
  useEffect(() => {
    actualizarLista();
  }, [estadoFiltro]);

  // Filtrar los resultados según el valor del campo de búsqueda
  const personalFiltrado = personalSalud.filter((personal) =>
    `${personal.nombres} ${personal.primerApellido} ${personal.segundoApellido || ''}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Lista de Personal de Salud</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Botones centrados */}
        {estadoFiltro === 'activo' && (
          <div className="d-flex justify-content-center mb-4">
            <button className="btn btn-primary mx-2" onClick={() => navigate('/registrar-personal-salud')}>
              Añadir Nuevo Personal
            </button>
            <button className="btn btn-primary mx-2" onClick={() => navigate('/actualizar-personal-salud')}>
              Actualizar Personal
            </button>
          </div>
        )}

        {/* Radio buttons para filtrar por estado */}
        <div className="mb-3 d-flex justify-content-center">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="estadoFiltro"
              id="activo"
              value="activo"
              checked={estadoFiltro === 'activo'}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            />
            <label className="form-check-label" htmlFor="activo">
              Activos
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="estadoFiltro"
              id="inactivo"
              value="inactivo"
              checked={estadoFiltro === 'inactivo'}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            />
            <label className="form-check-label" htmlFor="inactivo">
              Inactivos
            </label>
          </div>
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

        {/* Tabla */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Celular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personalFiltrado.length > 0 ? (
              personalFiltrado.map((personal) => (
                <tr key={personal.idPersona}>
                  <td>{`${personal.nombres} ${personal.primerApellido} ${personal.segundoApellido || ''}`}</td>
                  <td>{personal.rol}</td>
                  <td>{personal.numeroCelular}</td>
                  <td>
                    {estadoFiltro === 'activo' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => desactivarPaciente(personal.idPersona)}
                      >
                        <i className="bi bi-trash-fill me-1"></i>Desactivar
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => reactivarPaciente(personal.idPersona)}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>Reactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
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

export default ListaPersonalSalud;
