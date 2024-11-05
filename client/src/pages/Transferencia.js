// src/pages/Transferencia.js

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import './Transferencia.css';

const Transferencia = () => {
    const [formData, setFormData] = useState({
        idEstablecimientoSaludOrigen: "",
        idEstablecimientoSaludDestino: "",
        persona_idPersona: "",
        Motivo: "",
        Observacion: "",
        documentoTransferencia: null
    });

    const [establecimientos, setEstablecimientos] = useState([]);
    const [personas, setPersonas] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/establecimientos')
            .then((response) => response.json())
            .then((data) => setEstablecimientos(data))
            .catch((error) => console.error('Error fetching establecimientos:', error));
  
        fetch('http://localhost:3001/api/pacientes')
            .then((response) => response.json())
            .then((data) => setPersonas(data))
            .catch((error) => console.error('Error fetching pacientes:', error));
    }, []);
  
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "documentoTransferencia") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = new FormData();
        payload.append("idEstablecimientoSaludOrigen", formData.idEstablecimientoSaludOrigen);
        payload.append("persona_idPersona", formData.persona_idPersona);
        payload.append("idEstablecimientoSaludDestino", formData.idEstablecimientoSaludDestino);
        payload.append("Motivo", formData.Motivo);
        payload.append("Observacion", formData.Observacion);
        
        if (formData.documentoTransferencia) {
            payload.append("documentoTransferencia", formData.documentoTransferencia);
        }
    
        console.log("Datos a enviar:", formData);
    
        try {
            const response = await fetch("http://localhost:3001/api/transferencias", {
                method: "POST",
                body: payload
            });
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Transferencia registrada con éxito:", data);
        } catch (error) {
            console.error("Error al registrar transferencia:", error);
        }
    };
    

    return (
        <Layout>
            <div className="transfer-container">
                <h2>Formulario de Transferencia</h2>
                <form onSubmit={handleSubmit} className="transfer-form">
                    <div className="form-group">
                        <label>Establecimiento de Origen</label>
                        <select
                            name="idEstablecimientoSaludOrigen"
                            value={formData.idEstablecimientoSaludOrigen}
                            onChange={handleChange}
                            required
                            className="select-input"
                        >
                            <option value="">Selecciona un establecimiento</option>
                            {establecimientos.map(est => (
                                <option key={est.id} value={est.id}>{est.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Establecimiento de Destino</label>
                        <select
                            name="idEstablecimientoSaludDestino"
                            value={formData.idEstablecimientoSaludDestino}
                            onChange={handleChange}
                            required
                            className="select-input"
                        >
                            <option value="">Selecciona un establecimiento</option>
                            {establecimientos.map(est => (
                                <option key={est.id} value={est.id}>{est.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Persona</label>
                        <select
                            name="persona_idPersona"
                            value={formData.persona_idPersona}
                            onChange={handleChange}
                            required
                            className="select-input"
                        >
                            <option value="">Selecciona una persona</option>
                            {personas.map(persona => (
                                <option key={persona.idPersona} value={persona.idPersona}>
                                    {persona.nombreCompleto}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Motivo</label>
                        <select
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                            required
                            className="select-input"
                        >
                            <option value="">Selecciona un motivo</option>
                            <option value="Urgencia">Urgencia</option>
                            <option value="Emergencia">Emergencia</option>
                            <option value="consulta externa">Consulta Externa</option>
                            <option value="interconsulta">Interconsulta</option>
                            <option value="Servicio/Especialidad">Servicio/Especialidad</option>
                            <option value="Telesalud">Telesalud</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Observación</label>
                        <textarea
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                            maxLength="200"
                            rows="4"
                            className="textarea-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Documento Transferencia</label>
                        <input
                            type="file"
                            name="documentoTransferencia"
                            onChange={handleChange}
                            accept=".pdf, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx"
                            className="file-input"
                        />
                    </div>

                    <button type="submit" className="submit-button">Registrar Transferencia</button>
                </form>
            </div>
        </Layout>
    );
};

export default Transferencia;

