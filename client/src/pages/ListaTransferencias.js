import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import './ListaTransferencias.css';

const ListasTransferencias = () => {
  const [transferencias, setTransferencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransferencias = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/gettransferencias'); // Ajusta esta ruta según tu backend
        if (!response.ok) {
          throw new Error("Error al obtener las transferencias");
        }
        const data = await response.json();
        setTransferencias(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTransferencias();
  }, []);

  if (loading) {
    return <div>Cargando transferencias...</div>;
  }

  return (
      <div className="listas-transferencias-container">
        <h1>Lista de Transferencias</h1>
        <table className="transferencias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Establecimiento Origen</th>
              <th>Establecimiento Destino</th>
              <th>Persona</th>
              <th>Motivo</th>
              <th>Observación</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            {transferencias.map((transferencia) => (
              <tr key={transferencia.idTransferencia}>
                <td>{transferencia.idTransferencia}</td>
                <td>{transferencia.establecimientoOrigen}</td>
                <td>{transferencia.establecimientoDestino}</td>
                <td>{transferencia.nombreCompleto}</td>
                <td>{transferencia.motivo}</td>
                <td>{transferencia.observacion}</td>
                <td>
                  {transferencia.documentoRef ? (
                    <a href={`data:application/pdf;base64,${transferencia.documentoRef}`} target="_blank" rel="noopener noreferrer">
                      Ver Documento
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default ListasTransferencias;
