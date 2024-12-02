/* src/pages/ListaEstablecimientos.js */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const ListaEstablecimientos = () => {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [filteredEstablecimientos, setFilteredEstablecimientos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/establecimientosLista');
        console.log('Respuesta de los establecimientos:', response.data);
        setEstablecimientos(response.data);
        setFilteredEstablecimientos(response.data); // INICIALIZAMOS CON LA LISTA COMPLETA
      } catch (error) {
        console.error('Error al obtener los establecimientos:', error);
        setError('No se pudieron cargar los establecimientos');
      }
    };

    fetchEstablecimientos();
  }, []);

  useEffect(() => {
    // Filtra la lista de establecimientos según el término de búsqueda
    if (searchQuery === '') {
      setFilteredEstablecimientos(establecimientos);
    } else {
      setFilteredEstablecimientos(
        establecimientos.filter((establecimiento) =>
          establecimiento.nombreEstablecimiento.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, establecimientos]);

  const eliminarEstablecimiento = async (id) => {
    try {
      const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este establecimiento?');
      if (confirmed) {
        const response = await axios.delete(`http://localhost:3001/api/establecimientos/${id}`);
        if (response.status === 200) {
          // Filtra el establecimiento eliminado
          setEstablecimientos(establecimientos.filter(est => est.idEstablecimientoSalud !== id));
          setFilteredEstablecimientos(filteredEstablecimientos.filter(est => est.idEstablecimientoSalud !== id));
          alert('Establecimiento eliminado correctamente');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el establecimiento:', error);
      alert('No se pudo eliminar el establecimiento. Intente de nuevo más tarde.');
    }
  };

  const actualizarEstablecimiento = (id) => {
    console.log('Redirigiendo a la actualización del ID:', id);
    navigate(`/actualizar-establecimiento/${id}`);
  };

  return (
    <Layout>
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Lista de Establecimientos Registrados</h2>
          <button className="btn btn-primary" onClick={() => navigate('/registrar-establecimiento')}>
            Registrar Nuevo Establecimiento
          </button>
        </div>

        {/* Buscador con maxWidth */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de establecimiento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '300px' }} // Estilo en línea con maxWidth
          />
        </div>

        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Nivel E.S.</th>
              <th>Sede</th>
              <th>Red de Salud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredEstablecimientos) && filteredEstablecimientos.length > 0 ? (
              filteredEstablecimientos.map((establecimiento) => (
                <tr key={establecimiento.idEstablecimientoSalud}>
                  <td>{establecimiento.nombreEstablecimiento}</td>
                  <td>{establecimiento.telefono}</td>
                  <td>{establecimiento.clasificacion}</td>
                  <td>{establecimiento.nombreSede}</td>
                  <td>{establecimiento.nombreRedSalud}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => actualizarEstablecimiento(establecimiento.idEstablecimientoSalud)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => eliminarEstablecimiento(establecimiento.idEstablecimientoSalud)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron establecimientos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ListaEstablecimientos;
