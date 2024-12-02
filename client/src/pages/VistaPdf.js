/* src/pages/VistaPdf.js */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const PdfViewer = ({ pdfId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`/api/get-pdf/${pdfId}`, {
          responseType: "blob", // Importante para obtener los datos binarios
        });

        // Crear una URL para mostrar el PDF
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error("Error al cargar el PDF:", error);
      }
    };

    fetchPdf();
  }, [pdfId]);

  return (
    <Layout>
      <div>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            width="100%"
            height="600px"
          ></iframe>
        ) : (
          <p>Cargando PDF...</p>
        )}
      </div>
    </Layout>
  );
};

export default PdfViewer;
