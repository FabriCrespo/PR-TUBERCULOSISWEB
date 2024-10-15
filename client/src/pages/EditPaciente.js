import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPaciente.css'; // Importa el archivo CSS aquí

const EditPaciente = () => {
    const { idPersona } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({
        primerNomrbe: '',
        primerApellido: '',
        numeroCelular: '',
        CI: '',
        usuario: '',
        correo: ''
    });

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

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3001/api/updatePaciente/${idPersona}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(paciente)
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
                    <label className="label">Nombre</label>
                    <input type="text" className="input" value={paciente.primerNomrbe} onChange={(e) => setPaciente({ ...paciente, primerNomrbe: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="label">Apellido Paterno</label>
                    <input type="text" className="input" value={paciente.primerApellido} onChange={(e) => setPaciente({ ...paciente, primerApellido: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="label">Numero Celular</label>
                    <input type="text" className="input" value={paciente.numeroCelular} onChange={(e) => setPaciente({ ...paciente, numeroCelular: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="label">CI</label>
                    <input type="text" className="input" value={paciente.CI} onChange={(e) => setPaciente({ ...paciente, CI: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="label">Usuario</label>
                    <input type="text" className="input" value={paciente.usuario} onChange={(e) => setPaciente({ ...paciente, usuario: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="label">Correo Electrónico</label>
                    <input type="email" className="input" value={paciente.correo} onChange={(e) => setPaciente({ ...paciente, correo: e.target.value })} required />
                </div>
                <button type="submit" className="button save-button">Guardar Cambios</button>
                <button type="button" className="button cancel-button" onClick={() => navigate('/pacientes')}>Cancelar</button>
            </form>
        </div>
    );
};

export default EditPaciente;
