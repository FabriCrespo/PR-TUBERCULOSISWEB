import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const RegistrarAdministrador = () => {
  const navigate = useNavigate();

  const [administrador, setAdministrador] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    numeroCelular: '',
    CI: '',
    EstablecimientoSalud_idEstablecimientoSalud: '', // Este campo será un combobox
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [establecimientos, setEstablecimientos] = useState([]); // Estado para los establecimientos

  // Cargar los establecimientos desde la API
  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/establecimientosl');
        if (response.data && response.data.length > 0) {
          setEstablecimientos(response.data);
        } else {
          setError('No se encontraron establecimientos.');
        }
      } catch (error) {
        console.error('Error al obtener los establecimientos:', error);
        setError('No se pudo cargar la lista de establecimientos.');
      }
    };

    fetchEstablecimientos();
  }, []);

  // Función para manejar el cambio en los inputs del formulario
  const handleChange = (e) => {
    setAdministrador({
      ...administrador,
      [e.target.name]: e.target.value,
    });
  };

  // Validar campos antes de enviar
  const validateForm = () => {
    if (!administrador.nombres || !administrador.primerApellido || !administrador.numeroCelular || !administrador.CI || !administrador.EstablecimientoSalud_idEstablecimientoSalud) {
      return false;
    }
    // Validar formato del número de celular (si es necesario)
    if (!/^\d{8,}$/.test(administrador.numeroCelular)) {
      setError('El número de celular es inválido.');
      return false;
    }
    return true;
  };

  // Función para registrar el administrador
  const registrarAdministrador = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación antes de enviar
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/administradores', administrador);
      setSuccess(response.data.message);
      setError('');
      setLoading(false);
      // Redirigir a la lista de administradores o página de éxito
      navigate('/lista-admins');
    } catch (error) {
      console.error('Error al registrar el administrador:', error);
      setError('No se pudo registrar el administrador. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Registrar Nuevo Administrador</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Formulario para registrar al administrador */}
        <form onSubmit={registrarAdministrador}>
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

          {/* Dropdown para seleccionar el establecimiento */}
          <div className="mb-3">
            <label className="form-label">Establecimiento de Salud</label>
            <select
              className="form-control"
              name="EstablecimientoSalud_idEstablecimientoSalud"
              value={administrador.EstablecimientoSalud_idEstablecimientoSalud}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un establecimiento</option>
              {establecimientos.map((establecimiento) => (
                <option key={establecimiento.idEstablecimientoSalud} value={establecimiento.idEstablecimientoSalud}>
                  {establecimiento.nombreEstablecimiento}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Administrador'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default RegistrarAdministrador;
