import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ActualizarPaciente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paciente, setPaciente] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    numeroCelular: '',
    fechaNacimiento: '',
    sexo: '',
    direccion: '',
    CI: '',
    EstablecimientoSalud_idEstablecimientoSalud: '',
    idCriterioIngreso: ''
  });

  const [establecimientos, setEstablecimientos] = useState([]);
  const [criterios, setCriterios] = useState([]);

  useEffect(() => {
    // Cargar los datos del paciente
    const obtenerPaciente = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/pacientesForm/${id}`);
        console.log(response.data); // Verifica el formato de los datos
        setPaciente(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del paciente:', error);
      }
    };

    // Cargar los datos de establecimientos y criterios
    const obtenerEstablecimientos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/establecimientos');
        setEstablecimientos(response.data);
      } catch (error) {
        console.error('Error al obtener los establecimientos:', error);
      }
    };

    const obtenerCriterios = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/criterios');
        setCriterios(response.data);
      } catch (error) {
        console.error('Error al obtener los criterios:', error);
      }
    };

    obtenerPaciente();
    obtenerEstablecimientos();
    obtenerCriterios();
  }, [id]);

  const actualizarPaciente = () => {
    axios.put(`http://localhost:3001/api/pacientes/${id}`, paciente)
      .then(response => {
        alert('Paciente actualizado correctamente');
        navigate('/lista-pacientes');
      })
      .catch(error => {
        console.error('Error al actualizar paciente:', error);
        alert('No se pudo actualizar el paciente. Intente de nuevo más tarde.');
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Actualizar Paciente</h2>

      <div className="card p-4">
        <form onSubmit={(e) => { e.preventDefault(); actualizarPaciente(); }}>
          <div className="form-group mb-3">
            <label>Nombres</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombres"
              value={paciente.nombres}             
              onChange={e => setPaciente({ ...paciente, nombres: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Primer Apellido</label>
            <input
              type="text"
              className="form-control"
              placeholder="Primer Apellido"
              value={paciente.primerApellido}
              onChange={e => setPaciente({ ...paciente, primerApellido: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Segundo Apellido</label>
            <input
              type="text"
              className="form-control"
              placeholder="Segundo Apellido"
              value={paciente.segundoApellido}
              onChange={e => setPaciente({ ...paciente, segundoApellido: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label>Celular</label>
            <input
              type="text"
              className="form-control"
              placeholder="Celular"
              value={paciente.numeroCelular}
              onChange={e => setPaciente({ ...paciente, numeroCelular: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              className="form-control"
              value={paciente.fechaNacimiento}
              onChange={e => setPaciente({ ...paciente, fechaNacimiento: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Sexo</label>
            <select
              className="form-control"
              value={paciente.sexo}
              onChange={e => setPaciente({ ...paciente, sexo: e.target.value })}
              required
            >
              <option value="">Seleccione</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              placeholder="Dirección"
              value={paciente.direccion}
              onChange={e => setPaciente({ ...paciente, direccion: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label>CI</label>
            <input
              type="text"
              className="form-control"
              placeholder="CI"
              value={paciente.CI}
              onChange={e => setPaciente({ ...paciente, CI: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Establecimiento</label>
            <select
              className="form-control"
              value={paciente.EstablecimientoSalud_idEstablecimientoSalud}
              onChange={e => setPaciente({ ...paciente, EstablecimientoSalud_idEstablecimientoSalud: e.target.value })}
              required
            >
              <option value="">Seleccione un establecimiento</option>
              {establecimientos.map(est => (
                <option key={est.idEstablecimientoSalud} value={est.idEstablecimientoSalud}>
                  {est.nombreEstablecimiento}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Criterio</label>
            <select
              className="form-control"
              value={paciente.idCriterioIngreso}
              onChange={e => setPaciente({ ...paciente, idCriterioIngreso: e.target.value })}
              required
            >
              <option value="">Seleccione un criterio</option>
              {criterios.map(crit => (
                <option key={crit.idCriterioIngreso} value={crit.idCriterioIngreso}>
                  {`${crit.tipo}-${crit.subtipo}-${crit.estadoIngreso}`}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary me-2">
              Actualizar Paciente
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/lista-pacientes')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActualizarPaciente;