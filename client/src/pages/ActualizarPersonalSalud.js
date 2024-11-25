/* src/pages/ActualizarPersonalSalud.js */

import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Layout from '../components/Layout';

const ActualizarPersonalSalud = () => {
  const [personalSalud, setPersonalSalud] = useState([]);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    numeroCelular: '',
    rol: '',
    CI: '',
    EstablecimeintoSalud_idEstablecimeintoSalud: '',
  });

  const [searchTerm, setSearchTerm] = useState('');   // ESTADO PARA LA BÚSQUEDA
  const [filteredPersonalSalud, setFilteredPersonalSalud] = useState([]); // PARA ALMACENAR LAS OPCIONES FILTRADAS
  const navigate = useNavigate(); // INICIALIZA useNavigate

  // Obtener el listado de personal de salud y establecimientos
  useEffect(() => {
    const obtenerPersonalSalud = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/personalSalud');
        setPersonalSalud(response.data);
        setFilteredPersonalSalud(response.data);  // INICIALMENTE, TODOS LOS REGISTROS ESTAN DISPONIBLES
      } catch (error) {
        console.error('Error al obtener el personal de salud:', error);
      }
    };

    const obtenerEstablecimientos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/establecimientosa');
        setEstablecimientos(response.data);
      } catch (error) {
        console.error('Error al obtener los establecimientos:', error);
      }
    };

    obtenerPersonalSalud();
    obtenerEstablecimientos();
  }, []);

  // FILTRAMOS EL PERSONAL DE SALUD SEGUN EL TERMINO DE BUSQUEDA
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = personalSalud.filter((personal) =>
      `${personal.nombres} ${personal.primerApellido}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );
    setFilteredPersonalSalud(filtered);
  };

  // MANEJAR CAMBIOS EN EL COMBOBOX
  const handleSelectChange = (personal) => {
    //const id = e.target.value;
    //const selected = personalSalud.find(p => p.idPersona === parseInt(id));
    setSelectedPersonal(personal);
    setFormData({
      nombres: personal.nombres,
      primerApellido: personal.primerApellido,
      segundoApellido: personal.segundoApellido,
      numeroCelular: personal.numeroCelular,
      rol: personal.rol || '',
      CI: personal.CI || '',
      EstablecimientoSalud_idEstablecimientoSalud: personal.EstablecimientoSalud_idEstablecimientoSalud || '', // SELECCIONAMOS EL ESTABLECIMIENTO DE SALUD ASOCIADO
    });
    setSearchTerm(`${personal.nombres} ${personal.primerApellido}`); // MOSTRAR EL NOMBRE COMPLETO EN EL CAMPO DE BUSQUEDA
    setFilteredPersonalSalud([]); // OCULTAMOS LAS OPCIONES AL SELECCIONAR UN PERSONAL DE SALUD
  };
  
  // MANEJO DE CAMBIOS EN EL FORMULARIO
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // VALIDACIONES
    if (name === "numeroCelular") {
      const isNumber = /^[0-9]*$/.test(value);
      if (!isNumber) {
        return;
      }
  
      
      if (value.length <= 8) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
  
      
      if (value.length === 8) {
        if (/^[67]/.test(value)) {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      }
      return;
    }

    if (name === "CI") {
      const isNumber = /^[0-9]*$/.test(value);
      if (!isNumber || value.length > 12) {
        return;
      }
    }
  
    if (['nombres', 'primerApellido', 'segundoApellido'].includes(name)) {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        alert('Este campo solo puede contener letras y espacios.');
        return;
      }
    }
  
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const validarFormulario = () => {
    if (!formData.nombres || !formData.primerApellido || !formData.numeroCelular || !formData.CI || !formData.EstablecimientoSalud_idEstablecimientoSalud || !formData.rol) {
      alert('Por favor, complete todos los campos obligatorios.');
      return false;
    }
  
    // VERIFICACION ADICIONAL PARA EL NUMERO DE CELULAR (EXACTAMENTE 8 DIGITOS)
    if (formData.numeroCelular.length !== 8) {
      alert('El número de celular debe tener exactamente 8 dígitos.');
      return false;
    }
  
    return true;
  };


  // FUNCION PARA ACTUALIZAR EL PERSONAL DE SALUD
  const actualizarPersonalSalud = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    try {
      await axios.put(`http://localhost:3001/api/personalSalud/${selectedPersonal.idPersona}`, formData);
      alert('Personal de salud actualizado correctamente');
      navigate('/lista-personal-salud');
    } catch (error) {
      console.error('Error al actualizar el personal de salud:', error);
    }
  };

  // FUNCION PARA MANEJAR EL BOTON DE CANCELAR
  const manejarCancelar = () => {
    navigate('/lista-personal-salud');
  };

  return (
    <Layout>
      <div className="container mt-5">
      <h1 className="text-center mb-4">Actualizar Personal de Salud</h1>

      {!selectedPersonal && (
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-secondary mb-4"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      )}

      {/* Mostrar el campo de búsqueda siempre */}
      <div className="mb-4">
        <label>Buscar Personal de Salud:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ingresa el nombre completo"
          value={searchTerm}
          onChange={handleSearchChange} // Actualizar el estado de búsqueda
        />
        {searchTerm && filteredPersonalSalud.length > 0 && (
          <ul className="list-group mt-2">
            {filteredPersonalSalud.map((personal) => (
              <li
                key={personal.idPersona}
                className="list-group-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectChange(personal)} // Seleccionar el personal de salud
              >
                {`${personal.nombres} ${personal.primerApellido}`}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulario solo se muestra si hay un personal seleccionado */}
      {selectedPersonal && (
        <form>
          <div className="form-group">
            <label>Nombres:</label>
            <input
              type="text"
              className="form-control"
              name="nombres"
              maxLength="60"
              value={formData.nombres}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Primer Apellido:</label>
            <input
              type="text"
              className="form-control"
              maxLength="60"
              name="primerApellido"
              value={formData.primerApellido}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Segundo Apellido:</label>
            <input
              type="text"
              className="form-control"
              maxLength="60"
              name="segundoApellido"
              value={formData.segundoApellido}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Número de Celular:</label>
            <input
              type="text"
              className="form-control"
              name="numeroCelular"
              value={formData.numeroCelular}
              onChange={handleInputChange}
              maxLength="8"
              minLength="8"
              
              required
            />
          </div>

          <div className="form-group">
            <label>CI:</label>
            <input
              type="text"
              className="form-control"
              name="CI"
              maxLength="12"
              value={formData.CI}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Establecimiento:</label>
            <select
              className="form-control"
              name="EstablecimientoSalud_idEstablecimientoSalud"
              value={formData.EstablecimientoSalud_idEstablecimientoSalud}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un establecimiento</option>
              {establecimientos.map((est) => (
                <option key={est.idEstablecimientoSalud} value={est.idEstablecimientoSalud}>
                  {est.nombreEstablecimiento}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select
              className="form-control"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un rol</option>
              <option value="Medico">Médico</option>
              <option value="Enfermero/a">Enfermero/a</option>
            </select>
          </div>


          
          <div className="form-group mt-4">
            <button 
              type="button" 
              className="btn btn-primary"  
              onClick={actualizarPersonalSalud}
              style={{ marginRight: '10px' }} // Separación entre los botones
            >
              Actualizar
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={manejarCancelar}
            >
              Cancelar
            </button>
          </div>




        </form>
      )}
    </div>
    </Layout>
  );
};

export default ActualizarPersonalSalud;
