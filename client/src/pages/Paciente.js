import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import './Persona.css';

const Paciente = () => {
    const [pacientes, setPacientes] = useState([]);
    const navigate = useNavigate();  // Usa useNavigate para poder redirigir

    // Hacer la solicitud al backend para obtener los pacientes
    useEffect(() => {
        fetch('http://localhost:3001/api/pacientes')  // Asegúrate de que esta URL sea correcta
            .then(response => response.json())
            .then(data => setPacientes(data))
            .catch(error => console.error('Error fetching pacientes:', error));
    }, []);

    // Función para eliminar un paciente
    const handleDelete = (idPersona) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este paciente?');
        if (confirmed) {
            fetch(`http://localhost:3001/api/deletePaciente/${idPersona}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error eliminando paciente');
                }
                // Si el paciente fue eliminado exitosamente (estado cambiado a 0)
                console.log('Paciente eliminado correctamente');
                // Volver a cargar la lista de pacientes después de la eliminación
                setPacientes(prevPacientes => prevPacientes.filter(paciente => paciente.idPersona !== idPersona));
            })
            .catch(error => console.error('Error:', error));
        }
    };

    return (
        <Layout>
            <div className="patient-container">
                <h1>Lista de Pacientes</h1>
                {/* Botón para agregar un nuevo paciente */}
                <button
                    className="button-agregar"
                    onClick={() => navigate('/InsertPaciente')}  // Redirigir a la página InsertPaciente
                >
                    Agregar Paciente
                </button>

                <table className="table-container">
                    <thead>
                        <tr>
                            <th className="table-header">Nombres</th>
                            <th className="table-header">Apellido Paterno</th>
                            <th className="table-header">Apellido Materno</th>
                            <th className="table-header">Numero Celular</th>
                            <th className="table-header">CI</th>
                            <th className="table-header">Sexo</th>
                            <th className="table-header">Dirección</th>
                            <th className="table-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.length > 0 ? (
                            pacientes.map((paciente) => (
                                <tr key={paciente.idPersona}>
                                    <td>{paciente.nombres}</td>
                                    <td>{paciente.primerApellido}</td>
                                    <td>{paciente.segundoApellido}</td>
                                    <td>{paciente.numeroCelular}</td>
                                    <td>{paciente.CI}</td>
                                    <td>{paciente.sexo}</td>
                                    <td>{paciente.direccion}</td>
                                    <td>
                                        <button
                                            className="button-modificar"
                                            onClick={() => navigate(`/EditPaciente/${paciente.idPersona}`)}
                                        >
                                            Modificar
                                        </button>
                                        <button 
                                            className="button-eliminar"
                                            onClick={() => handleDelete(paciente.idPersona)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No hay pacientes disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Paciente;
