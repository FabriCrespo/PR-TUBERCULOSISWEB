import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

  const ActualizarEstablecimiento = () => {
    const { id } = useParams();
    const [establecimiento, setEstablecimiento] = useState({
      nombreEstablecimiento: '',
      telefono: '',
      clasificacion: '',
      idSede: "",  // Corregido el nombre de la propiedad
      idRedSalud: "",
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
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito

  const navigate = useNavigate();

  // Obtener los datos iniciales de las sedes
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/sedes');
        setSedes(response.data);
        console.log('Sedes obtenidas:', response.data);
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };
    fetchSedes();
  }, []);
  //
  // Obtener los datos del establecimiento cuando el ID o sedes cambian
  // Obtener los datos del establecimiento y las redes de salud cuando el ID o la sede cambian
  useEffect(() => {
    const fetchEstablecimiento = async () => {
      try {
        // Primero obtenemos el establecimiento
        const response = await axios.get(`http://localhost:3001/api/establecimientoo/${id}`);
        const data = response.data;

        // Actualizamos los datos del establecimiento
        setEstablecimiento({
          nombreEstablecimiento: data.nombreEstablecimiento,
          telefono: data.telefono,
          clasificacion: data.clasificacion,
        });

        // Actualizamos la sede seleccionada
        setSelectedSede(data.idSede);

        // Actualizamos la red de salud seleccionada
        setSelectedRedSalud(data.idRedSalud);

        // Ahora obtenemos las redes de salud asociadas a la sede
        const redesResponse = await axios.get(`http://localhost:3001/api/redesSalud/${data.idSede}`);
        setRedesSalud(redesResponse.data); // Actualizamos las redes de salud

      } catch (error) {
        console.error('Error al obtener los datos del establecimiento:', error);
      }
    };

    if (id) {
      fetchEstablecimiento();
    }
  }, [id]);

  // Obtener los datos iniciales del establecimiento después de cargar las sedes
  useEffect(() => {
    const fetchInitialData = async () => {
      if (sedes.length > 0) {
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
        } catch (error) {
          console.error('Error al cargar datos iniciales:', error);
        }
      }
    };

    fetchInitialData();
  }, [id, sedes]);  // Revisa que las sedes estén cargadas


  // Obtener las redes de salud cada vez que cambia la sede seleccionada
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
  // Manejo de cambios en la sede
  const handleSedeChange = (e) => {
    const sedeId = e.target.value;
    setSelectedSede(sedeId);
    setSelectedRedSalud(''); // Reseteamos la red de salud cuando se cambia la sede
    setRedesSalud([]); // Limpiamos las redes de salud
    setNuevaRedSalud(''); // Limpiamos el campo de nueva red de salud
    setFormError(''); // Limpiamos errores
  };

  // Manejo de cambios en la red de salud
  const handleRedSaludChange = (e) => {
    setSelectedRedSalud(e.target.value);
    setFormError(''); // Limpiamos los errores cuando seleccionamos una red de salud
  };

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
      const response = await axios.post('http://localhost:3001/api/redesSalud', {
        nombreRedSalud: nuevaRedSalud,
        idSede: selectedSede,
      });
      console.log('Nueva red de salud creada:', response.data);
      alert('Nueva red de salud creada!');
      setNuevaRedSalud('');
      setSelectedRedSalud('');
      const updatedRedesSalud = await axios.get(`http://localhost:3001/api/redesSalud/${selectedSede}`);
      console.log('Redes de salud actualizadas:', updatedRedesSalud.data);
      setRedesSalud(updatedRedesSalud.data);
    } catch (error) {
      console.error('Error creando la nueva red de salud:', error);
      alert('Error creando la nueva red de salud. Inténtalo nuevamente.');
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

    if (!selectedRedSalud || selectedRedSalud === 'nueva') {
      setFormError('Por favor, selecciona una red de salud válida.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/establecimientoo/${id}`, {
        ...establecimiento,
        idRedSalud: selectedRedSalud,
      });
      setSuccessMessage(response.data.message);
      setFormError('');
      alert('Establecimiento actualizado exitosamente');
      navigate('/lista-establecimientos');
    } catch (error) {
      console.error('Error al actualizar el establecimiento:', error);
      if (error.response && error.response.data.error) {
        setFormError(error.response.data.error);
      } else {
        setFormError('Error al actualizar el establecimiento. Inténtalo nuevamente.');
      }
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card p-4">
          <h2 className="text-center mb-4">Actualizar Establecimiento</h2>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
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
                  onChange={handleSedeChange}
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
                  <option value="">Seleccione una clasificación</option>
                  <option value="Primer Nivel">Primer Nivel</option>
                  <option value="Segundo Nivel">Segundo Nivel</option>
                  <option value="Tercer Nivel">Tercer Nivel</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-3">
              Guardar Cambios
            </button>
            <button type="button" className="btn btn-secondary ml-3" onClick={() => navigate('/lista-establecimientos')}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ActualizarEstablecimiento;
