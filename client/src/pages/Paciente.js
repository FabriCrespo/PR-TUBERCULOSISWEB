// src/pages/Paciente.js

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import './Persona.css';

const Paciente = () => {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/pacientes')
            .then((response) => response.json())
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
                            <th className="table-header" style={{display: ""}}>Nro.</th>
                            <th className="table-header">Nombre Completo.</th>
                            <th className="table-header">CI.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((paciente) => (
                            <tr className="table-row">
                                <td className="table-data" key={paciente.idPersona} style={{display: ""}} >{paciente.idPersona}</td>
                                <td className="table-data" key={paciente.idPersona}>{paciente.nombreCompleto}</td>
                                <td className="table-data" key={paciente.idPersona}>{paciente.CI}</td>
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