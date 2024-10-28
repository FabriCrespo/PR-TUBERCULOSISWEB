/* src/components/FormularioPersonalSalud.js */

import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import './FormularioPersonalSalud.css';

const FormularioPersonalSalud = ({ medicos, onSubmit }) => {
    const { id } = useParams();
    const [selectedDoctor, setSelectedDoctor] = useState({}); //useState(medicos[0] || {});



    useEffect(() => {
        /*if (medicos.length > 0) {
            const doctor = medicos.find(m => m.id === id);
            setSelectedDoctor(doctor || {});
        }*/
        setSelectedDoctor(medicos[0] || {});
    }, [medicos, id]);

    const handleChange = (e) => {
        const { name, value} = e.target;
        /*setSelectedDoctor({
            ...selectedDoctor,
            [name]: value
        });*/
        setSelectedDoctor((prevDoctor) => ({
            ...prevDoctor,
            [name]: value,
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(selectedDoctor);
        console.log('Doctor actualizado', selectedDoctor);
        // LOGICA PARA ENVIAR LOS DATOS AL BACKEND
        //
    };
    
    
    
    return (
        <div className="form-container">
            <h2>Actualizar Personal de Salud</h2>
            <form className="doctor-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombres:</label>
                    <input type="text" name="Nombres" value={selectedDoctor.Nombres || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Primer Apellido:</label>
                    <input type="text" name="Primer Apellido" value={selectedDoctor['Primer Apellido'] || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Segundo Apellido:</label>
                    <input type="text" name="Segundo Apellido" value={selectedDoctor['Segundo Apellido'] || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Número Celular:</label>
                    <input type="text" name="Número Celular" value={selectedDoctor['Número Celular'] || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Fecha Nacimiento:</label>
                    <input type="date" name="Fecha Nacimiento" value={selectedDoctor['Fecha Nacimiento'] || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Sexo:</label>
                    <input type="text" name="Sexo" value={selectedDoctor.Sexo || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Dirección:</label>
                    <input type="text" name="Dirección" value={selectedDoctor.Dirección || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Documento:</label>
                    <input type="text" name="Documento" value={selectedDoctor.Documento || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Establecimiento de Salud:</label>
                    <input type="text" name="Establecimiento de Salud" value={selectedDoctor['Establecimiento de Salud'] || ''} onChange={handleChange} />
                </div>
                <button type="submit" className="submit-button">Actualizar Personal de Salud</button>
            </form>
        </div>
    );
};

export default FormularioPersonalSalud;