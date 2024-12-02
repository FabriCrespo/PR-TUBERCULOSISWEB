import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Cookies from 'js-cookie';

const RegistrarEstablecimiento = () => {
  const [selectedSede, setSelectedSede] = useState('');
  const [selectedRedSalud, setSelectedRedSalud] = useState('');
  const [sedes, setSedes] = useState([]);
  const [redesSalud, setRedesSalud] = useState([]);
  const [nuevaRedSalud, setNuevaRedSalud] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreEstablecimiento, setNombreEstablecimiento] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/sedes');
        setSedes(response.data);
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };
    fetchSedes();
  }, []);

  useEffect(() => {
    const fetchRedesSalud = async () => {
      if (selectedSede) {
        try {
          console.log(`Solicitando redes de salud para la sede: ${selectedSede}`);
          const response = await axios.get(`http://localhost:3001/api/redesSalud/${selectedSede}`);
          console.log('Respuesta del servidor:', response.data);
          setRedesSalud(response.data);
        } catch (error) {
          console.error('Error al obtener las redes de salud:', error);
        }
      } else {
        setRedesSalud([]);
      }
    };
    fetchRedesSalud();
  }, [selectedSede]);

  const handleSedeChange = (event) => {
    const sedeId = event.target.value;
    console.log('Sede seleccionada:', sedeId);
    setSelectedSede(sedeId);
    setSelectedRedSalud('');
    setRedesSalud([]);
    setNuevaRedSalud('');
  };

  const handleRedSaludChange = (event) => {
    setSelectedRedSalud(event.target.value);
  };

  const handleNuevaRedSaludChange = (event) => {
    setNuevaRedSalud(event.target.value);
  };

  const handleClasificacionChange = (event) => {
    setClasificacion(event.target.value);
  };

  const handleNombreEstablecimientoChange = (event) => {
    const inputValue = event.target.value;
    // Permitir solo letras y espacios
    if (/^[a-zA-Z\s]*$/.test(inputValue)) {
      setNombreEstablecimiento(inputValue);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedRedSaludId = selectedRedSalud;

    if (selectedRedSaludId && selectedRedSaludId !== 'nueva') {
      try {
        const response = await axios.post('http://localhost:3001/api/establecimientoSalud', {
          nombreEstablecimiento,
          telefono,
          clasificacion,
          idRedSalud: selectedRedSaludId,
        });
        alert(response.data.message); // Mensaje de éxito
        navigate('/lista-establecimientos');
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          console.error('Error registrando el establecimiento:', error);
          alert('Error registrando el establecimiento. Inténtalo nuevamente.');
        }
      }
    }
  };

  const handleCreateRedSalud = async () => {
    if (!nuevaRedSalud) {
      alert('Por favor, ingrese el nombre de la nueva red de salud.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/redesSalud', {
        nombreRedSalud: nuevaRedSalud,
        idSede: selectedSede,
      });
      alert('Nueva red de salud creada!');
      setNuevaRedSalud('');
      setSelectedRedSalud('');
      const response = await axios.get(`http://localhost:3001/api/redesSalud/${selectedSede}`);
      setRedesSalud(response.data);
    } catch (error) {
      console.error('Error creando la nueva red de salud:', error);
      alert('Error creando la nueva red de salud. Inténtalo nuevamente.');
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card p-4">
          <h2 className="text-center mb-4">Registrar Establecimiento</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>* Ingrese Nombre Del Establecimiento</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                value={nombreEstablecimiento}
                onChange={handleNombreEstablecimientoChange}
                required
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>* Ingrese Número de Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Teléfono"
                  required
                  value={telefono}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {
                      setTelefono(inputValue);
                    }
                  }}
                />
              </div>
              <div className="col-md-6">
                <label>* SEDE</label>
                <select className="form-control" value={selectedSede} onChange={handleSedeChange} required>
                  <option value="">Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>* Red de Salud</label>
                <select
                  className="form-control"
                  value={selectedRedSalud}
                  onChange={handleRedSaludChange}
                  required
                >
                  <option value="">Seleccione una red de salud</option>
                  {redesSalud.map((red) => (
                    <option key={red.idRedSalud} value={red.idRedSalud}>
                      {red.nombreRedSalud}
                    </option>
                  ))}
                  <option value="nueva">Agregar nueva red de salud</option>
                </select>
                {selectedRedSalud === 'nueva' && (
                  <>
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Ingrese nueva red de salud"
                      value={nuevaRedSalud}
                      onChange={handleNuevaRedSaludChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-success mt-2"
                      onClick={handleCreateRedSalud}
                    >
                      Crear Nueva Red de Salud
                    </button>
                  </>
                )}
              </div>
              <div className="col-md-6">
                <label>* Nivel E.S.</label>
                <select
                  className="form-control"
                  value={clasificacion}
                  onChange={handleClasificacionChange}
                  required
                >
                  <option value="">Seleccione un nivel</option>
                  <option value="Primer Nivel">Primer Nivel</option>
                  <option value="Segundo Nivel">Segundo Nivel</option>
                  <option value="Tercer Nivel">Tercer Nivel</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary me-3">
                Registrar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/lista-establecimientos')}
              >
                Ver Lista de Establecimientos
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrarEstablecimiento;
