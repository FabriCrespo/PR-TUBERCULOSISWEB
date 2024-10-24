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
        fechaNacimiento: ''  // Asegúrate de incluir la fecha de nacimiento
    });
    
    // Estado para errores de validación
    const [errors, setErrors] = useState({});

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

    // Función para validar los campos
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        // Validar nombre y apellido (solo letras)
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!nameRegex.test(paciente.nombres)) {
            valid = false;
            newErrors.nombres = 'El nombre solo puede contener letras y espacios.';
        }
        if (!nameRegex.test(paciente.primerApellido)) {
            valid = false;
            newErrors.primerApellido = 'El apellido solo puede contener letras y espacios.';
        }
        if (!nameRegex.test(paciente.segundoApellido)) {
            valid = false;
            newErrors.segundoApellido = 'El segundo apellido solo puede contener letras y espacios.';
        }

        // Validar número de celular (debe ser de 8 dígitos y empezar con 6 o 7)
        const celularRegex = /^[67]\d{7}$/;
        if (!celularRegex.test(paciente.numeroCelular)) {
            valid = false;
            newErrors.numeroCelular = 'El número de celular debe tener 8 dígitos y comenzar con 6 o 7.';
        }

        setErrors(newErrors);
        return valid;
    };

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
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label">Numero Celular</label>
                    <input
                        type="text"
                        className="input"
                        value={paciente.numeroCelular}
                        onChange={(e) => setPaciente({ ...paciente, numeroCelular: e.target.value })}
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
