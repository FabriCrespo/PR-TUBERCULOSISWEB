import React, { useState, useEffect } from "react";

const VideoDownloader = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada a la API para obtener la lista de videos
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/videos"); // Reemplaza con la URL de tu API
        const data = await response.json();
        setVideos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los videos:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const downloadFile = (base64Data, fileName) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p>Cargando videos...</p>;
  }

  return (
    <div>
      <h2>Lista de videos</h2>
      {videos.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {videos.map((video) => (
            <li
              key={video.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <h3>{video.name}</h3>
              <p><strong>Descripción:</strong> {video.description}</p>
              <p>
                <strong>Fecha de subida:</strong>{" "}
                {new Date(video.uploadDate).toLocaleDateString("es-ES")}
              </p>
              <button
                onClick={() => downloadFile(video.base64, video.name)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Descargar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay videos disponibles.</p>
      )}
    </div>
  );
};

export default VideoDownloader;
