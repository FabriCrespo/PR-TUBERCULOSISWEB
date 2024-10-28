// src/pages/Paciente.js

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Persona.css';

const Medico = () => {
    const [medicos, setMedicos] = useState([]);

    const navigate = useNavigate();

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
                        <th className="table-header" style={{display: ""}}>{medicos.length > 0 ? 'Nro' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Nombres' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Primer Apellido' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Segundo Apellido' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Número Celular' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Fecha Nacimiento' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Sexo' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Dirección' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Documento' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Establecimiento de Salud' : ''}</th>
                            <th className="table-header">{medicos.length > 0 ? 'Controles' : ''}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicos.map((medico) => (
                            <tr key={medico.Nro} className="table-row">
                                <td className="table-data" style={{display: ""}} >{medico.Nro}</td>
                                <td className="table-data">{medico.Nombres}</td>
                                <td className="table-data">{medico['Primer Apellido']}</td>
                                <td className="table-data">{medico['Segundo Apellido']}</td>
                                <td className="table-data">{medico['Número Celular']}</td>
                                <td className="table-data">{medico['Fecha Nacimiento']}</td>
                                <td className="table-data">{medico.Sexo}</td>
                                <td className="table-data">{medico.Dirección}</td>
                                <td className="table-data">{medico.Documento}</td>
                                <td className="table-data">{medico['Establecimiento de Salud']}</td>
                                <td>
                                    <button className="button-modificar" onClick={() => navigate(`/EditDoctor/${medico.Nro}`)}>Modificar</button>
                                    <button className="button-eliminar" onClick={() => navigate(`/DeleteDoctor/${medico.Nro}`)}> Eliminar</button>
                                </td>
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