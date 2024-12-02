import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Cookies from "js-cookie"; // Cookies

const SeguimientoTratamientos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [newTreatment, setNewTreatment] = useState({
    medicamento: '',
    fechaInicio: '',
    fechaFinalizacion: '',
    cantDosis: '',
    intervaloTiempo: '',
  });
  const [showModal, setShowModal] = useState(false);

  // Obtener el establecimientoId y rol desde las cookies
  const establecimientoId = Cookies.get('establecimientoId');
  const userRole = Cookies.get('rol'); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchResults = async () => {
    if (searchTerm.trim()) {
      try {
        // Construir la URL con los parámetros necesarios
        let url = `http://localhost:3001/api/pacientes?rol=${userRole}`;

        // Si el usuario no es superadmin, agregar el filtro por establecimientoId
        if (userRole !== 'superadmin') {
          url += `&establecimientoId=${establecimientoId}`;
        }

        // Realizar la solicitud
        const response = await fetch(url);
        const data = await response.json();

        // Filtrar los resultados por nombre
        const filteredResults = data.filter(person =>
          person.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    // Llamar a la búsqueda solo cuando el término de búsqueda cambie
    fetchResults();
  }, [searchTerm, userRole]); // Asegurarse de que se ejecuta cuando searchTerm o userRole cambian

  const fetchTreatments = async (personId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tratamientos/${personId}`);
      const data = await response.json();
      setTreatments(data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setResults([]);
    setSearchTerm(person.nombreCompleto);
    fetchTreatments(person.idPersona);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'intervaloTiempo' || name === 'cantDosis') && (parseInt(value) <= 0 || isNaN(value))) {
      alert(`${name === 'intervaloTiempo' ? 'El intervalo de tiempo' : 'La cantidad de dosis'} debe ser un número mayor a 0`);
      return;
    }

    if (name === 'fechaFinalizacion' && value) {
      const fechaInicio = new Date(newTreatment.fechaInicio);
      const fechaFinalizacion = new Date(value);
      if (fechaFinalizacion < fechaInicio) {
        alert('La fecha de finalización no puede ser anterior a la fecha de inicio.');
        return;
      }
    }

    setNewTreatment({ ...newTreatment, [name]: value });
  };

  const handleAddTreatment = async () => {
    // Verificar si todos los campos están llenos
    const { medicamento, fechaInicio, cantDosis, intervaloTiempo } = newTreatment;
    if (!medicamento || !fechaInicio || !cantDosis || !intervaloTiempo) {
      alert('Por favor, completa todos los campos antes de agregar el tratamiento.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/tratamientos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTreatment,
          Persona_idPersona: selectedPerson.idPersona,
        }),
      });
      if (response.ok) {
        fetchTreatments(selectedPerson.idPersona);
        setShowModal(false);
        setNewTreatment({
          medicamento: '',
          fechaInicio: '',
          fechaFinalizacion: '',
          cantDosis: '',
          intervaloTiempo: '',
        });
      } else {
        console.error('Error al agregar tratamiento');
      }
    } catch (error) {
      console.error('Error al agregar tratamiento:', error);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2>Seguimiento de Tratamientos</h2>
        <div className="form-group">
          <label htmlFor="search">Buscar Persona</label>
          <input
            type="text"
            id="search"
            className="form-control search-input"
            placeholder="Ingresa el nombre de la persona"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {results.length > 0 && (
          <ul className="list-group mt-3">
            {results.map((person) => (
              <li
                key={person.idPersona}
                className="list-group-item"
                onClick={() => handleSelectPerson(person)}
                style={{ cursor: 'pointer' }}
              >
                {person.nombreCompleto}
              </li>
            ))}
          </ul>
        )}

        {selectedPerson && (
          <div className="mt-4">
            <h4>Persona Seleccionada:</h4>
            <p>
              Nombre Completo: {selectedPerson.nombreCompleto} <br />
              Fecha de Nacimiento: {new Date(selectedPerson.fechaNacimiento).toLocaleDateString()} <br />
              Sexo: {selectedPerson.sexo} <br />
              Establecimiento: {selectedPerson.nombreEstablecimiento} <br />
              Criterio de Ingreso: {selectedPerson.criterioIngreso} <br />
            </p>

            <h4>Tratamientos:</h4>
            {treatments.length > 0 ? (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Medicamento</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Finalización</th>
                    <th>Cantidad de Dosis</th>
                    <th>Intervalo de Tiempo (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment) => (
                    <tr key={treatment.idTratamiento}>
                      <td>{treatment.medicamento}</td>
                      <td>{new Date(treatment.fechaInicio).toLocaleDateString()}</td>
                      <td>{treatment.fechaFinalizacion ? new Date(treatment.fechaFinalizacion).toLocaleDateString() : 'N/A'}</td>
                      <td>{treatment.cantDosis}</td>
                      <td>{treatment.intervaloTiempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se encontraron tratamientos para esta persona.</p>
            )}

            <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
              Añadir Nuevo Tratamiento
            </button>

            {showModal && (
              <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Nuevo Tratamiento</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="form-group">
                          <label>Medicamento</label>
                          <input
                            type="text"
                            name="medicamento"
                            value={newTreatment.medicamento}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Fecha de Inicio</label>
                          <input
                            type="date"
                            name="fechaInicio"
                            value={newTreatment.fechaInicio}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Fecha de Finalización</label>
                          <input
                            type="date"
                            name="fechaFinalizacion"
                            value={newTreatment.fechaFinalizacion}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Cantidad de Dosis</label>
                          <input
                            type="number"
                            name="cantDosis"
                            value={newTreatment.cantDosis}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Intervalo de Tiempo (horas)</label>
                          <input
                            type="number"
                            name="intervaloTiempo"
                            value={newTreatment.intervaloTiempo}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                      </button>
                      <button className="btn btn-primary" onClick={handleAddTreatment}>
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SeguimientoTratamientos;
