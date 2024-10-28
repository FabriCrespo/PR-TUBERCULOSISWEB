import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InsertPaciente = () => {
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
        idCriterioIngreso: ''
    });

    const [criterios, setCriterios] = useState([]);

    // Obtener los criterios de ingreso desde el backend
    useEffect(() => {
        fetch('http://localhost:3001/api/criterios')
            .then(response => response.json())
            .then(data => setCriterios(data))
            .catch(error => console.error('Error fetching criterios:', error));
    }, []);

    // Validar que solo se ingresen letras (bloquear números y caracteres especiales)
    const validateTextInput = (e) => {
        const regex = /^[A-Za-z\s]*$/;
        if (!regex.test(e.key)) {
            e.preventDefault(); // Evitar que se ingrese cualquier carácter que no sea letra o espacio
        }
    };

    // Validar que el número de celular empiece con 6 o 7 y tenga máximo 8 dígitos
    const validatePhoneInput = (e) => {
        const value = e.target.value + e.key; // Simular el valor con el próximo carácter presionado
        const regex = /^[67]\d{0,7}$/; // Empieza con 6 o 7 y hasta 8 dígitos

        // Bloquear si el número no coincide con el formato
        if (!regex.test(value)) {
            e.preventDefault(); // Evitar la entrada si no cumple con la condición
        }
    };

    // Validar que el número de celular tenga exactamente 8 dígitos antes de enviar
    const handleInsert = (e) => {
        e.preventDefault();

        // Verificar si el número de celular tiene exactamente 8 dígitos
        if (paciente.numeroCelular.length !== 8) {
            alert("El número de celular debe tener exactamente 8 dígitos.");
            return;
        }

        if (!paciente.idCriterioIngreso) {
            alert("Por favor selecciona un criterio de ingreso.");
            return;
        }

        fetch('http://localhost:3001/api/insertPaciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paciente)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error insertando paciente');
                }
                return response.json();
            })
            .then(data => {
                console.log('Paciente insertado:', data);
                navigate('/pacientes'); // Redirigir a la lista de pacientes después de insertar
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="form-container">
            <h2>Agregar Nuevo Paciente</h2>
            <form onSubmit={handleInsert}>
                {/* Campo para Nombres */}
                <div className="form-group">
                    <label>Nombres:</label>
                    <input
                        type="text"
                        value={paciente.nombres}
                        onChange={(e) => setPaciente({ ...paciente, nombres: e.target.value })}
                        onKeyPress={validateTextInput} // Agregar validación para bloquear caracteres no permitidos
                        required
                    />
                </div>

                {/* Campo para Apellido Paterno */}
                <div className="form-group">
                    <label>Apellido Paterno:</label>
                    <input
                        type="text"
                        value={paciente.primerApellido}
                        onChange={(e) => setPaciente({ ...paciente, primerApellido: e.target.value })}
                        onKeyPress={validateTextInput} // Agregar validación para bloquear caracteres no permitidos
                        required
                    />
                </div>

                {/* Campo para Apellido Materno */}
                <div className="form-group">
                    <label>Apellido Materno:</label>
                    <input
                        type="text"
                        value={paciente.segundoApellido}
                        onChange={(e) => setPaciente({ ...paciente, segundoApellido: e.target.value })}
                        onKeyPress={validateTextInput} // Agregar validación para bloquear caracteres no permitidos
                    />
                </div>

                {/* Campo para Número de Celular */}
                <div className="form-group">
                    <label>Número Celular:</label>
                    <input
                        type="text"
                        value={paciente.numeroCelular}
                        onChange={(e) => setPaciente({ ...paciente, numeroCelular: e.target.value })}
                        onKeyPress={validatePhoneInput} // Validación para celular
                        required
                    />
                </div>

                {/* Campo para CI */}
                <div className="form-group">
                    <label>CI:</label>
                    <input
                        type="text"
                        value={paciente.CI}
                        onChange={(e) => setPaciente({ ...paciente, CI: e.target.value })}
                        onKeyPress={(e) => {
                            if (paciente.CI.length >= 13) {
                                e.preventDefault();  // Bloquear la entrada si ya tiene 13 caracteres
                            }
                        }}
                        required
                    />
                </div>

                {/* Campo para Dirección */}
                <div className="form-group">
                    <label>Dirección:</label>
                    <input
                        type="text"
                        value={paciente.direccion}
                        onChange={(e) => setPaciente({ ...paciente, direccion: e.target.value })}
                        required
                    />
                </div>

                {/* Campo para Sexo */}
                <div className="form-group">
                    <label>Sexo:</label>
                    <select
                        value={paciente.sexo}
                        onChange={(e) => setPaciente({ ...paciente, sexo: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>

                {/* Campo para Fecha de Nacimiento */}
                <div className="form-group">
                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        value={paciente.fechaNacimiento}
                        onChange={(e) => setPaciente({ ...paciente, fechaNacimiento: e.target.value })}
                        required
                    />
                </div>

                {/* Campo para seleccionar el criterio de ingreso */}
                <div className="form-group">
                    <label>Criterio de Ingreso:</label>
                    <select
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
                </div>

                {/* Botones para agregar o cancelar */}
                <button type="submit" className="button save-button">Agregar Paciente</button>
                <button type="button" className="button cancel-button" onClick={() => navigate('/pacientes')}>Cancelar</button>
            </form>
        </div>
    );
};

export default InsertPaciente;
