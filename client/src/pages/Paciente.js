import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';
 
function Paciente() {
  const [personas, setPersonas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate(); // Para redirigir a otras rutas
 
  useEffect(() => {
    const establecimientoId = Cookies.get('establecimientoId');
    const userRole = Cookies.get('rol');  // Obtener el rol del usuario
 
    axios
      .get('http://localhost:3001/api/pacientes', {
        params: { establecimientoId , 
          rol: userRole  // Incluir el rol en la petición
         },
      })
      .then((response) => setPersonas(response.data))
      .catch((error) => {
        console.error('Error al cargar los datos de pacientes:', error);
        alert('No se pudieron cargar los datos de pacientes. Intente de nuevo más tarde.');
      });
  }, []);
 
 
  const desactivarPaciente = (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este paciente?');
    if (confirmed) {
      axios.put(`http://localhost:3001/api/pacientesDelete/${id}/estado`)
        .then(() => {
          /*setPersonas(personas.map(persona =>
            persona.idPersona === id ? { ...persona, estado: 0 } : persona
          ));*/
          setPersonas(personas.filter(persona => persona.idPersona !== id));
          alert('Paciente desactivado correctamente');
        })
        .catch(error => {
          console.error('Error al desactivar paciente:', error);
          alert('No se pudo desactivar el paciente. Intente de nuevo más tarde.');
        });
    }
  };
 
  // Función para manejar la actualización de un paciente
  const handleActualizarPaciente = (id) => {
    navigate(`/actualizar-paciente/${id}`);
  };
 
  // Filtrar pacientes según el nombre
  const pacientesFiltrados = personas.filter(persona =>
    persona.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
  );
 
  // Función para formatear la fecha de nacimiento
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES'); // Formato DD/MM/AAAA
  };
 
  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Lista de Pacientes</h2>
        <div className="d-flex justify-content-center mt-4">
          <Link to="/añadir-paciente" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>Añadir Paciente
          </Link>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Link to="/recuperar-pacientes" className="btn btn-secondary">
            <i className="bi bi-arrow-return-left me-1"></i>Recuperar Pacientes
          </Link>
        </div>
 
        {/* Campo de búsqueda alineado a la izquierda */}
        <div className="mb-3" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de paciente"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
 
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Celular</th>
              <th>Fecha de Nacimiento</th>
              <th>Sexo</th>
              <th>Dirección</th>
              <th>CI</th>
              <th>Establecimiento de Salud</th>
              <th>Criterio de Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map(persona => (
              <tr key={persona.idPersona}>
                <td>{persona.nombreCompleto}</td>
                <td>{persona.numeroCelular}</td>
                <td>{formatearFecha(persona.fechaNacimiento)}</td>
                <td>{persona.sexo}</td>
                <td>{persona.direccion}</td>
                <td>{persona.CI}</td>
                <td>{persona.nombreEstablecimiento}</td>
                <td>{persona.criterioIngreso}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleActualizarPaciente(persona.idPersona)}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>Actualizar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => desactivarPaciente(persona.idPersona)} // Cambiado a desactivarPaciente
                    >
                      <i className="bi bi-trash-fill me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
 
      </div>
    </Layout>
  );
}
 
export default Paciente;
 
 