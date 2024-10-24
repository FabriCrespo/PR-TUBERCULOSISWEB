const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Luxxo.2004', // Asegúrate de cambiar esto por tu contraseña real
    database: 'tuberculosis',
    port: 3306
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Ruta para obtener los datos de un paciente específico
app.get('/api/getPaciente/:idPersona', (req, res) => {
  const { idPersona } = req.params;
  const query = 'SELECT * FROM persona WHERE idPersona = ?';
  db.query(query, [idPersona], (err, result) => {
      if (err) {
          console.error('Error fetching paciente:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
      }
      res.json(result[0]);
  });
});

//
app.get('/api/pacientes', (req, res) => {
  db.query('SELECT * FROM persona WHERE estado=1', (err, results) => {
      if (err) {
          console.error('Error fetching pacientes:', err);
          res.status(500).send(err);
          return;
      }
      res.json(results);
  });
});

// Ruta para actualizar un paciente
// Ruta para actualizar un paciente
app.put('/api/updatePaciente/:idPersona', (req, res) => {
  const { idPersona } = req.params;
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento } = req.body;
  console.log("Datos recibidos para actualizar:", req.body);
  const query = 'UPDATE persona SET nombres = ?, primerApellido = ?, segundoApellido = ?, numeroCelular = ?, CI = ?, sexo = ?, fechaNacimiento = ? WHERE idPersona = ?;';
 
  db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, idPersona], (err, result) => {
      if (err) {
          console.error('Error updating paciente:', err);
          return res.status(500).json({ error: 'Error updating paciente', details: err });
      }
      console.log('Filas afectadas:', result.affectedRows); 
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
      }
      res.json({ message: 'Paciente actualizado con éxito' });
  });
});

//
app.get('/api/redsalud', (req, res) => {
  const query = 'SELECT * FROM redSalud'; // Asegúrate de que 'redSalud' es el nombre correcto de tu tabla
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching redes de salud:', err);
          return res.status(500).send(err);
      }
      res.json(results);
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// Ruta para eliminar un paciente (cambiar estado a 0)
app.put('/api/deletePaciente/:idPersona', (req, res) => {
  const { idPersona } = req.params;
  const query = 'UPDATE persona SET estado = 0 WHERE idPersona = ?';
  
  db.query(query, [idPersona], (err, result) => {
      if (err) {
          console.error('Error al eliminar el paciente:', err);
          return res.status(500).json({ error: 'Error al eliminar el paciente', details: err });
      }
      console.log('Paciente eliminado:', result.affectedRows);
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
      }
      res.json({ message: 'Paciente eliminado con éxito' });
  });
});
