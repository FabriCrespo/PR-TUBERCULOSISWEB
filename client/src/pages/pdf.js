/* src/pages/pdf.js */

import React from "react";
import PdfViewer from "./PdfViewer";

const pdf = () => {
  return (
    <div>
      <h1>Vista de PDF</h1>
      <PdfViewer pdfId={1} /> {/* Cambia '1' por el ID del archivo que deseas cargar */}
    </div>
  );
};

export default pdf;
