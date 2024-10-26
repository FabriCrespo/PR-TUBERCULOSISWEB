import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPaciente.css'; // Importa el archivo CSS aquí

const EditPaciente = () => {
    const { idPersona } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
        numeroCelular: '',
        CI: '',
        direccion: '',
        sexo: '',
        fechaNacimiento: '',
        idCriterioIngreso: '' // Agregar el campo para criterio de ingreso
    });

    const [criterios, setCriterios] = useState([]); // Estado para almacenar los criterios
    const [errors, setErrors] = useState({}); // Estado para errores de validación

    // Obtener los criterios de ingreso desde el backend
    useEffect(() => {
        fetch('http://localhost:3001/api/criterios')
        .then(response => response.json())
        .then(data => {
            setCriterios(data);
        })
        .catch(error => console.error('Error fetching criterios:', error));
    }, []);

    // Cargar los datos del paciente desde el backend
    useEffect(() => {
        fetch(`http://localhost:3001/api/getPaciente/${idPersona}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setPaciente(data);
        })
        .catch(error => console.error('Error fetching paciente data:', error));
    }, [idPersona]);

    // Validar que solo se ingresen letras (nombres, apellidos) y bloquear números/caracteres especiales
    const validateTextInput = (e) => {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
        if (!regex.test(e.key)) {
            e.preventDefault(); // Bloquear si no es letra o espacio
        }
    };

    // Validar que el número de celular empiece con 6 o 7 y tenga exactamente 8 dígitos
    const validatePhoneInput = (e) => {
        const value = e.target.value + e.key;
        const regex = /^[67]\d{0,7}$/;
        if (!regex.test(value)) {
            e.preventDefault(); // Bloquear si no cumple la condición
        }
    };

    // Validar que el CI tenga un máximo de 13 caracteres
    const validateCIInput = (e) => {
        if (paciente.CI.length >= 13) {
            e.preventDefault(); // Bloquear si supera los 13 caracteres
        }
    };

    // Función para validar los campos antes de enviar
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        // Validar nombres y apellidos (solo letras)
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!nameRegex.test(paciente.nombres)) {
            valid = false;
            newErrors.nombres = 'El nombre solo puede contener letras y espacios.';
        }
        if (!nameRegex.test(paciente.primerApellido)) {
            valid = false;
            newErrors.primerApellido = 'El apellido solo puede contener letras y espacios.';
        }

        // Validar Apellido Materno solo si se ingresa un valor (no es obligatorio)
        if (paciente.segundoApellido && !nameRegex.test(paciente.segundoApellido)) {
            valid = false;
            newErrors.segundoApellido = 'El segundo apellido solo puede contener letras y espacios.';
        }

        // Validar número de celular (exactamente 8 dígitos y debe empezar con 6 o 7)
        const celularRegex = /^[67]\d{7}$/;
        if (!celularRegex.test(paciente.numeroCelular)) {
            valid = false;
            newErrors.numeroCelular = 'El número de celular debe tener 8 dígitos y comenzar con 6 o 7.';
        }

        // Validar que el criterio de ingreso esté seleccionado
        if (!paciente.idCriterioIngreso) {
            valid = false;
            newErrors.idCriterioIngreso = 'Por favor selecciona un criterio de ingreso.';
        }

        // Asignar errores a los campos
        setErrors(newErrors);
        return valid;
    };

    // Función para manejar la actualización del paciente
    const handleUpdate = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Detener si la validación falla
        }

        // Formatear la fecha de nacimiento para que sea aceptada por MySQL
        const formattedPaciente = {
            ...paciente,
            fechaNacimiento: paciente.fechaNacimiento.split('T')[0] // Formato YYYY-MM-DD
        };

        fetch(`http://localhost:3001/api/updatePaciente/${idPersona}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formattedPaciente) // Enviar el objeto con la fecha corregida
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating paciente');
            }
            return response.json();
        })
        .then(data => {
            console.log('Paciente actualizado:', data);
            navigate('/pacientes');
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="form-container">
            <h2>Editar Paciente</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label className="label">Nombres</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.nombres}
                        onChange={(e) => setPaciente({ ...paciente, nombres: e.target.value })}
                        onKeyPress={validateTextInput} // Validar que solo se ingresen letras y espacios
                        required
                    />
                    {errors.nombres && <p className="error-message">{errors.nombres}</p>}
                </div>
                <div className="form-group">
                    <label className="label">Apellido Paterno</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.primerApellido}
                        onChange={(e) => setPaciente({ ...paciente, primerApellido: e.target.value })}
                        onKeyPress={validateTextInput} // Validar que solo se ingresen letras y espacios
                        required
                    />
                    {errors.primerApellido && <p className="error-message">{errors.primerApellido}</p>}
                </div>
                <div className="form-group">
                    <label className="label">Apellido Materno</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.segundoApellido}
                        onChange={(e) => setPaciente({ ...paciente, segundoApellido: e.target.value })}
                        onKeyPress={validateTextInput} // Validar que solo se ingresen letras y espacios
                    />
                    {errors.segundoApellido && <p className="error-message">{errors.segundoApellido}</p>}
                </div>
                <div className="form-group">
                    <label className="label">Número Celular</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.numeroCelular}
                        onChange={(e) => setPaciente({ ...paciente, numeroCelular: e.target.value })}
                        onKeyPress={validatePhoneInput} // Validar que el número empiece con 6 o 7 y tenga 8 dígitos
                        required
                    />
                    {errors.numeroCelular && <p className="error-message">{errors.numeroCelular}</p>}
                </div>
                <div className="form-group">
                    <label className="label">CI</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.CI}
                        onChange={(e) => setPaciente({ ...paciente, CI: e.target.value })}
                        onKeyPress={validateCIInput} // Limitar a 13 caracteres
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label">Dirección</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.direccion}
                        onChange={(e) => setPaciente({ ...paciente, direccion: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="label">Sexo</label>
                    <select
                        className="input"
                        value={paciente.sexo}
                        onChange={(e) => setPaciente({ ...paciente, sexo: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                    </select>
                </div>

                {/* Campo para seleccionar el criterio de ingreso */}
                <div className="form-group">
                    <label className="label">Criterio de Ingreso</label>
                    <select
                        className="input"
                        value={paciente.idCriterioIngreso}
                        onChange={(e) => setPaciente({ ...paciente, idCriterioIngreso: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        {criterios.map(criterio => (
                            <option key={criterio.idCriterioIngreso} value={criterio.idCriterioIngreso}>
                                {criterio.tipo} - {criterio.subtipo} - {criterio.estadoIngreso}
                            </option>
                        ))}
                    </select>
                    {errors.idCriterioIngreso && <p className="error-message">{errors.idCriterioIngreso}</p>}
                </div>

                <div className="form-group">
                    <label className="label">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        className="input"
                        value={paciente.fechaNacimiento.split('T')[0]} // Mostrar fecha en formato YYYY-MM-DD
                        onChange={(e) => setPaciente({ ...paciente, fechaNacimiento: e.target.value })}
                    />
                </div>
                <button type="submit" className="button save-button">Guardar Cambios</button>
                <button type="button" className="button cancel-button" onClick={() => navigate('/pacientes')}>Cancelar</button>
            </form>
        </div>
    );
};

export default EditPaciente;
