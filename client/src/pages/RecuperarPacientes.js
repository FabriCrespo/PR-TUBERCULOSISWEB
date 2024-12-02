/* src/pages/RecuperarPacientes.js */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function RecuperarPacientes() {
  const [pacientesEliminados, setPacientesEliminados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();  // Agregar useNavigate para redirección

  useEffect(() => {
    axios.get('http://localhost:3001/api/pacientesEliminados')
      .then(response => setPacientesEliminados(response.data))
      .catch(error => {
        console.error('Error al cargar los pacientes eliminados:', error);
        alert('No se pudieron cargar los pacientes eliminados. Intente de nuevo más tarde.');
      });
  }, []);

  const recuperarPaciente = (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas recuperar este paciente?');
    if (confirmed) {
      axios.put(`http://localhost:3001/api/pacientesActive/${id}/estado`)
        .then(() => {
          // Actualizar la lista de pacientes eliminados eliminando el paciente recuperado
          setPacientesEliminados(pacientesEliminados.filter(paciente => paciente.idPersona !== id));
          alert('Paciente recuperado correctamente');

          // Redirigir a la vista de pacientes después de recuperar
          navigate('/lista-pacientes');  // Redirige a la vista de pacientes
        })
        .catch(error => {
          console.error('Error al recuperar paciente:', error);
          alert('No se pudo recuperar el paciente. Intente de nuevo más tarde.');
        });
    }
  };

  // Filtrar pacientes eliminados según el nombre
  const pacientesEliminadosFiltrados = pacientesEliminados.filter(persona =>
    persona.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Pacientes Eliminados</h2>

        <div className="d-flex justify-content-center mt-4">
          <Link to="/lista-pacientes" className="btn btn-primary">
            <i className="bi bi-arrow-left me-1"></i>Volver a la Lista de Pacientes
          </Link>
        </div>

        {/* Campo de búsqueda alineado a la izquierda */}
        <div className="mb-3" style={{ maxWidth: '300px', marginTop: '20px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de paciente"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="table table-bordered table-hover mt-4">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Celular</th>
              <th>Fecha de Nacimiento</th>
              <th>Sexo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesEliminadosFiltrados.map(persona => (
              <tr key={persona.idPersona}>
                <td>{persona.nombreCompleto}</td>
                <td>{persona.numeroCelular}</td>
                <td>{new Date(persona.fechaNacimiento).toLocaleDateString('es-ES')}</td>
                <td>{persona.sexo}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => recuperarPaciente(persona.idPersona)}
                  >
                    Recuperar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default RecuperarPacientes;

