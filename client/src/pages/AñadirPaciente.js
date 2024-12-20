import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"; // Cookies
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function AñadirPaciente() {
  const idEstablecimientoSalud = Cookies.get('establecimientoId');
  const navigate = useNavigate();

  const [nuevoPaciente, setNuevoPaciente] = useState({
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
    const obtenerEstablecimientos = async () => {
      try {
           // Realizar la solicitud GET con el ID del establecimiento
           const response = await axios.get(`http://localhost:3001/api/establecimientosa/${idEstablecimientoSalud}`);
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

    obtenerEstablecimientos();
    obtenerCriterios();
  }, []);

  const validateTextInput = (e) => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const validatePhoneInput = (e) => {
    const value = e.target.value + e.key;
    const regex = /^[67]\d{0,7}$/;
    if (!regex.test(value)) {
      e.preventDefault();
    }
  };

  const añadirPaciente = (e) => {
    e.preventDefault();

    // Validación para el número de celular
    if (nuevoPaciente.numeroCelular.length !== 8) {
      alert("El número de celular debe tener exactamente 8 dígitos.");
      return;
    }

    // Validación para evitar fechas futuras
    const hoy = new Date();
    const fechaNacimiento = new Date(nuevoPaciente.fechaNacimiento);
    if (fechaNacimiento >= hoy) {
      alert("La fecha de nacimiento no puede ser una fecha futura.");
      return;
    }

    // Validación para el criterio de ingreso
    if (!nuevoPaciente.idCriterioIngreso) {
      alert("Por favor selecciona un criterio de ingreso.");
      return;
    }

    axios.post('http://localhost:3001/api/pacientes', nuevoPaciente)
      .then(response => {
        alert('Paciente añadido correctamente');
        setNuevoPaciente({
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
        navigate('/lista-pacientes');
      })
      .catch(error => {
        console.error('Error al añadir paciente:', error);
        alert('No se pudo añadir el paciente. Intente de nuevo más tarde.');
      });
  };
  // Calcular la fecha máxima permitida (ayer)
  const maxFechaNacimiento = new Date();
  maxFechaNacimiento.setDate(maxFechaNacimiento.getDate() - 1);
  const maxFechaNacimientoString = maxFechaNacimiento.toISOString().split("T")[0];

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Añadir Nuevo Paciente</h2>

        <div className="card p-4">
          <form onSubmit={añadirPaciente}>
            <div className="form-group mb-3">
              <label>Nombres</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombres"
                value={nuevoPaciente.nombres}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, nombres: e.target.value })}
                onKeyPress={validateTextInput}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Primer Apellido</label>
              <input
                type="text"
                className="form-control"
                placeholder="Primer Apellido"
                value={nuevoPaciente.primerApellido}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, primerApellido: e.target.value })}
                onKeyPress={validateTextInput}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Segundo Apellido</label>
              <input
                type="text"
                className="form-control"
                placeholder="Segundo Apellido"
                value={nuevoPaciente.segundoApellido}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, segundoApellido: e.target.value })}
                onKeyPress={validateTextInput}
              />
            </div>
            <div className="form-group mb-3">
              <label>Celular</label>
              <input
                type="text"
                className="form-control"
                placeholder="Celular"
                value={nuevoPaciente.numeroCelular}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, numeroCelular: e.target.value })}
                onKeyPress={validatePhoneInput}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={nuevoPaciente.fechaNacimiento}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, fechaNacimiento: e.target.value })}
                max={maxFechaNacimientoString} // Esto restringe las fechas futuras
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Sexo</label>
              <div>
                <input
                  type="radio"
                  id="sexoFemenino"
                  name="sexo"
                  value="Femenino"
                  checked={nuevoPaciente.sexo === 'Femenino'}
                  onChange={e => setNuevoPaciente({ ...nuevoPaciente, sexo: e.target.value })}
                  required
                />
                <label htmlFor="sexoFemenino" className="me-3">Femenino</label>

                <input
                  type="radio"
                  id="sexoMasculino"
                  name="sexo"
                  value="Masculino"
                  checked={nuevoPaciente.sexo === 'Masculino'}
                  onChange={e => setNuevoPaciente({ ...nuevoPaciente, sexo: e.target.value })}
                  required
                />
                <label htmlFor="sexoMasculino">Masculino</label>
              </div>
            </div>
            <div className="form-group mb-3">
              <label>Dirección</label>
              <input
                type="text"
                className="form-control"
                placeholder="Dirección"
                value={nuevoPaciente.direccion}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, direccion: e.target.value })}
              />
            </div>
            <div className="form-group mb-3">
              <label>CI</label>
              <input
                type="text"
                className="form-control"
                placeholder="CI"
                value={nuevoPaciente.CI}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, CI: e.target.value })}
                onKeyPress={(e) => {
                  if (nuevoPaciente.CI.length >= 13) {
                    e.preventDefault();
                  }
                }}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Establecimiento</label>
              <select
                className="form-control"
                value={nuevoPaciente.EstablecimientoSalud_idEstablecimientoSalud}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, EstablecimientoSalud_idEstablecimientoSalud: e.target.value })}
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
              <label>Criterio de Ingreso</label>
              <select
                className="form-control"
                value={nuevoPaciente.idCriterioIngreso}
                onChange={e => setNuevoPaciente({ ...nuevoPaciente, idCriterioIngreso: e.target.value })}
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
                Añadir Paciente
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
    </Layout>
  );
}

export default AñadirPaciente;
