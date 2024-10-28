/* src/pages/ActualizarPersonalSalud.js */

import React, { useState, useEffect } from "react";
///import { useNavigate } from "react-router-dom";
import FormularioPersonalSalud from '../components/FormularioPersonalSalud';
import { useParams } from "react-router-dom";



const ActualizarPersonalSalud = () => {
    const [medicos, setMedicos] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { id } = useParams();
    

    // AQUI REALIZAMOS LA CARGA DE MEDICO
    useEffect(() => {
        fetch('http://localhost:3001/api/medicos')
            .then((response) => response.json())
            .then((data) => setMedicos(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // AQUI SELECCIONO EL DOCTOR CORRECTO
    useEffect(() => {
        if (medicos.length > 0) {
            const doctor = medicos.find((medico) => medico.id === parseInt(id));
            setSelectedDoctor(doctor);
        }
    }, [medicos, id]);
    if (medicos.length === 0) {
        return <div>Cargando datos de médicos...</div>;
    }


    const handleSubmit = async (updatedData) => {
        console.log('Datos actualizados:', updatedData);
        // LOGICA PARA ENVIAR LOS DATOS AL SERVIDOR.
        //const doctorId = 1;
        const doctorId = updatedData.Nro;
        try {
            const response = await fetch(`http://localhost:3001/api/actualizar_medico/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombres: updatedData.Nombres,
                    primerApellido: updatedData['Primer Apellido'],
                    segundoApellido: updatedData['Segundo Apellido'],
                    numeroCelular: updatedData['Numero Celular'],
                    fechaNacimiento: updatedData['Fecha Nacimiento'],
                    sexo: updatedData.Sexo,
                    direccion: updatedData.Direccion,
                    CI: updatedData.Documento,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el personal medico");
            }

            const result = await response.json();
            console.log('Datos actualizados:', result.message);
            alert('Datos actualizados exitosamente');

        } catch (error) {
            console.error('Error actualizando los datos:', error);
            alert('Ocurrió un error al actualizar los datos.')
        }
    };

    return (
        <div>
            
                <FormularioPersonalSalud medicos={medicos} onSubmit={handleSubmit} ></FormularioPersonalSalud>
            
        </div>
    );
};

export default ActualizarPersonalSalud;

/*<div>
            <FormularioPersonalSalud medicos={medicos} onSubmit={handleSubmit}></FormularioPersonalSalud>
        </div>*/

/* <div>
            {selectedDoctor ? (
                <FormularioPersonalSalud doctor={selectedDoctor} onSubmit={handleSubmit} />
            ) : (
                <p>Cargando datos del médico...</p>
            )}
        </div>
        */