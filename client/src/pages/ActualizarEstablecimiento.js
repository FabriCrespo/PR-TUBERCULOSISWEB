import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ActualizarEstablecimiento = () => {
  const { id } = useParams();
  const [establecimiento, setEstablecimiento] = useState({
    nombreEstablecimiento: '',
    telefono: '',
    clasificacion: '',
  });
  const [selectedSede, setSelectedSede] = useState('');
  const [selectedRedSalud, setSelectedRedSalud] = useState('');
  const [sedes, setSedes] = useState([]);
  const [redesSalud, setRedesSalud] = useState([]);
  const [nuevaRedSalud, setNuevaRedSalud] = useState('');
  const [errorRedSalud, setErrorRedSalud] = useState('');  // Error para nueva red de salud
  const [nombreError, setNombreError] = useState('');  // Error para el nombre
  const [telefonoError, setTelefonoError] = useState('');  // Error para el teléfono
  const [formError, setFormError] = useState('');  // Error general del formulario

  const navigate = useNavigate();

  // Obtener los datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const establecimientoResponse = await axios.get(`http://localhost:3001/api/establecimientoo/${id}`);
        const establecimientoData = establecimientoResponse.data;

        setEstablecimiento({
          nombreEstablecimiento: establecimientoData.nombreEstablecimiento,
          telefono: establecimientoData.telefono,
          clasificacion: establecimientoData.clasificacion,
        });

        setSelectedSede(establecimientoData.idSede);
        setSelectedRedSalud(establecimientoData.idRedSalud);

        const sedesResponse = await axios.get('http://localhost:3001/api/sedes');
        setSedes(sedesResponse.data);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    const fetchRedesSalud = async () => {
      if (selectedSede) {
        try {
          const response = await axios.get(`http://localhost:3001/api/redesSalud/${selectedSede}`);
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

  // Manejo de cambios en el campo de nombre con validación
  const handleNombreChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]+$/;  // Solo permite letras y espacios

    if (!regex.test(value)) {
      setNombreError('El nombre no puede contener números ni caracteres especiales.');
    } else {
      setNombreError('');
    }

    setEstablecimiento({ ...establecimiento, nombreEstablecimiento: value });
  };

  // Manejo de cambios en el campo de teléfono con validación
  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;  // Solo permite números

    if (!regex.test(value)) {
      setTelefonoError('El teléfono solo puede contener números.');
    } else {
      setTelefonoError('');
    }

    setEstablecimiento({ ...establecimiento, telefono: value });
  };

  // Manejo de cambios en el campo de nueva Red de Salud con validación
  const handleNuevaRedSaludChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]*$/;  // Solo permite letras y espacios

    if (!regex.test(value)) {
      setErrorRedSalud('El nombre de la nueva red de salud solo puede contener letras y espacios.');
    } else {
      setErrorRedSalud('');
    }

    setNuevaRedSalud(value);
  };

  const handleCreateRedSalud = async () => {
    if (!nuevaRedSalud || errorRedSalud) {
      alert('Por favor, ingrese un nombre válido para la red de salud.');
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
    }
  };

  // Validación y manejo del envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de campos antes de enviar
    if (nombreError || telefonoError || errorRedSalud) {
      setFormError('Por favor, corrige los errores antes de continuar.');
      return;
    } else {
      setFormError('');
    }

    try {
      await axios.put(`http://localhost:3001/api/establecimientoo/${id}`, {
        ...establecimiento,
        idRedSalud: selectedRedSalud,
      });
      alert('Establecimiento actualizado exitosamente');
      navigate('/lista-establecimientos');
    } catch (error) {
      console.error('Error al actualizar el establecimiento:', error);
      alert('Error al actualizar el establecimiento. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h2 className="text-center mb-4">Actualizar Establecimiento</h2>
        <form onSubmit={handleSubmit}>
          {formError && <div className="alert alert-danger">{formError}</div>}
          
          <div className="mb-3">
            <label>* Nombre del Establecimiento</label>
            <input
              type="text"
              className="form-control"
              name="nombreEstablecimiento"
              maxLength={60}
              value={establecimiento.nombreEstablecimiento}
              onChange={handleNombreChange}  // Usamos el nuevo manejador
              required
            />
            {nombreError && <div className="text-danger">{nombreError}</div>}
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label>* Teléfono</label>
              <input
                type="tel"
                className="form-control"
                name="telefono"
                maxLength={15}
                value={establecimiento.telefono}
                onChange={handleTelefonoChange}  // Usamos el nuevo manejador
                required
              />
              {telefonoError && <div className="text-danger">{telefonoError}</div>}
            </div>

            <div className="col-md-6">
              <label>* SEDE</label>
              <select
                className="form-control"
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                required
              >
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
                onChange={(e) => setSelectedRedSalud(e.target.value)}
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
                    maxLength={50}
                    onChange={handleNuevaRedSaludChange}  // Usa el nuevo manejador
                    required
                  />
                  {errorRedSalud && <div className="text-danger">{errorRedSalud}</div>}
                  <button type="button" className="btn btn-success mt-2" onClick={handleCreateRedSalud}>
                    Crear Red de Salud
                  </button>
                </>
              )}
            </div>

            <div className="col-md-6">
              <label>* Clasificación</label>
              <select
                className="form-control"
                value={establecimiento.clasificacion}
                onChange={(e) => setEstablecimiento({ ...establecimiento, clasificacion: e.target.value })}
                required
              >
                <option value="Primer Nivel">Primer Nivel</option>
                <option value="Segundo Nivel">Segundo Nivel</option>
                <option value="Tercer Nivel">Tercer Nivel</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }} >
            Guardar Cambios
            
          </button>
          <button type="button" className="btn btn-secondary ml-3" onClick={() => navigate('/lista-establecimientos')}>
              Cancelar
            </button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarEstablecimiento;
