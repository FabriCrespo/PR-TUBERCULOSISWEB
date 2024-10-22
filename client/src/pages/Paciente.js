// src/pages/Paciente.js

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import './Persona.css';

const Paciente = () => {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/pacientes')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then((data) => setPacientes(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <Layout>
            <div className="patient-container">
                <h2>Lista de Pacientes</h2>
                
                <table className="table-container">
                    <thead >
                        <tr>
                            <th className="table-header" style={{display: ""}}>{pacientes.length > 0 ? 'Nro' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Nombres' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Primer Apellido' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Segundo Apellido' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Número Celular' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Fecha Nacimiento' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Sexo' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Dirección' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Documento' : ''}</th>
                            <th className="table-header">{pacientes.length > 0 ? 'Establecimiento de Salud' : ''}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((paciente) => (
                            <tr key={paciente.Nro} className="table-row">
                                <td className="table-data" style={{display: ""}} >{paciente.Nro}</td>
                                <td className="table-data">{paciente.Nombres}</td>
                                <td className="table-data">{paciente['Primer Apellido']}</td>
                                <td className="table-data">{paciente['Segundo Apellido']}</td>
                                <td className="table-data">{paciente['Número Celular']}</td>
                                <td className="table-data">{paciente['Fecha Nacimiento']}</td>
                                <td className="table-data">{paciente.Sexo}</td>
                                <td className="table-data">{paciente.Dirección}</td>
                                <td className="table-data">{paciente.Documento}</td>
                                <td className="table-data">{paciente['Establecimiento Salud']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* <ul>
                    {pacientes.map((paciente) => (
                        <li key={paciente.idPersona}>{paciente.nombreCompleto} {paciente.CI}</li>
                    ))}
                </ul> */}
            </div>
        </Layout>
    );
};

export default Paciente;