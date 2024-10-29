// src/pages/Transferencia.js

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import './Transferencia.css';

const Transferencia = () => {
    const [formData, setFormData] = useState({
        idEstablecimientoSaludOrigen: "",
        idEstablecimientoSaludDestino: "",
        persona_idPersona: "",
        motivo: "",
        observacion: "",
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
          .then((data) => {
              console.log('Pacientes data:', data);  // Agrega este log
              setPersonas(data);  // Asegúrate de que `data` sea un arreglo
          })
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });

        console.log("Datos de transferencia:", formData);
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
                                <option key={persona.id} value={persona.id}>{persona.nombreCompleto}</option>
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
