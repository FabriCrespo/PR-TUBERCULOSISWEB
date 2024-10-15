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

    return (
        <Layout>
            <div className="patient-container">
                <h1>Lista de Pacientes</h1>
                <table className="table-container">
                    <thead>
                        <tr>
                            <th className="table-header">Nombre</th>
                            <th className="table-header">Apellido Paterno</th>
                            <th className="table-header">Numero Celular</th>
                            <th className="table-header">Ci</th>
                            <th className="table-header">Usuario</th>
                            {/* <th>Fecha Nacimiento</th> */}
                            <th className="table-header">Email</th>
                            <th className="table-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.length > 0 ? (
                            pacientes.map((paciente) => (
                                <tr key={paciente.idPersona}>
                                    <td>{paciente.primerNomrbe}</td>
                                    <td>{paciente.primerApellido}</td>
                                    <td>{paciente.numeroCelular}</td>
                                    <td>{paciente.CI}</td>
                                    <td>{paciente.usuario}</td>
                                    {/* <td>{paciente.fechaNacimiento}</td> */}
                                    <td>{paciente.correo}</td>
                                    <td>
                                        <button
                                            className="button-modificar"
                                            onClick={() => navigate(`/EditPaciente/${paciente.idPersona}`)}
                                        >
                                            Modificar
                                        </button>
                                        <button className="button-eliminar">
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
