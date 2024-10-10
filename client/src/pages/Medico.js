// src/pages/Paciente.js

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import './Persona.css';

const Medico = () => {
    const [medicos, setMedicos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/medicos')
            .then((response) => response.json())
            .then((data) => setMedicos(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <Layout>
            <div className="patient-container">
                <h2>Personal Medico</h2>
                
                <table className="table-container">
                    <thead >
                        <tr>
                            <th className="table-header" style={{display: ""}}>Nro.</th>
                            <th className="table-header">Nombre Completo</th>
                            <th className="table-header">CI</th>
                            <th className="table-header">Correo</th>
                            <th className="table-header">Nro. Celular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicos.map((medico) => (
                            <tr className="table-row">
                                <td className="table-data" key={medico.idPersona} style={{display: "none"}} >{medico.idPersona}</td>
                                <td className="table-data" key={medico.idPersona}>{medico.nombreCompleto}</td>
                                <td className="table-data" key={medico.idPersona}>{medico.CI}</td>
                                <td className="table-data" key={medico.idPersona}>{medico.correo}</td>
                                <td className="table-data" key={medico.idPersona}>{medico.numeroCelular}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* <ul>
                    {pacientes.map((paciente) => (
                        <li key={paciente.idPersona}>{paciente.nombreCompleto} {paciente.CI}</li>
                    ))}
                </ul> */}
                {/* lista video vacio + notificacion */}
            </div>
        </Layout>
    );
};

export default Medico;