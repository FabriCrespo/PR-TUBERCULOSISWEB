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
        idCriterioIngreso: '' // Asegúrate de usar "IdCriterioIngreso" correctamente
    });

    const [criterios, setCriterios] = useState([]);

    // Obtener los criterios de ingreso desde el backend
    useEffect(() => {
        fetch('http://localhost:3001/api/criterios')
            .then(response => response.json())
            .then(data => setCriterios(data))
            .catch(error => console.error('Error fetching criterios:', error));
    }, []);

    // Función para manejar la inserción de un nuevo paciente
    const handleInsert = (e) => {
        e.preventDefault();
        console.log('Valor de idCriterioIngreso:', paciente.idCriterioIngreso);

        console.log('Paciente a insertar:', paciente); // Verifica los datos antes de enviar

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
                    />
                </div>

                {/* Campo para Número de Celular */}
                <div className="form-group">
                    <label>Número Celular:</label>
                    <input
                        type="text"
                        value={paciente.numeroCelular}
                        onChange={(e) => setPaciente({ ...paciente, numeroCelular: e.target.value })}
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
