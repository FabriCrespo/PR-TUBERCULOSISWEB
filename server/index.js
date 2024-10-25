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
    const { idPersona } = req.params;  // Make sure idPersona is passed correctly
    const { nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento } = req.body;

    // Format the date to YYYY-MM-DD
    const formattedFechaNacimiento = fechaNacimiento.split('T')[0]; 

    const query = 'UPDATE persona SET nombres = ?, primerApellido = ?, segundoApellido = ?, numeroCelular = ?, CI = ?, direccion = ?, sexo = ?, fechaNacimiento = ? WHERE idPersona = ?';
    
    db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, formattedFechaNacimiento, idPersona], (err, result) => {
        if (err) {
            console.error('Error updating paciente:', err);
            return res.status(500).json({ error: 'Error updating paciente', details: err });
        }
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

//
// Ruta para insertar un nuevo paciente
// Ruta para insertar un nuevo paciente
// Ruta para insertar un nuevo paciente
// Ruta para insertar un nuevo paciente
app.post('/api/insertPaciente', (req, res) => {
    const { nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, idEstablecimientoSalud, idCriterioIngreso } = req.body;

    const query = 'INSERT INTO persona (nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, estado, EstablecimientoSalud_idEstablecimientoSalud, idCriterioIngreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)';

    db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, idEstablecimientoSalud, idCriterioIngreso], (err, result) => {
        if (err) {
            console.error('Error insertando paciente:', err);
            return res.status(500).json({ error: 'Error insertando paciente' });
        }
        res.json({ message: 'Paciente insertado con éxito', id: result.insertId });
    });
});







//criterios
// Ruta para obtener los criterios de ingreso
app.get('/api/criterios', (req, res) => {
    const query = 'SELECT * FROM criterioingreso WHERE estado = 1'; // Selecciona solo criterios activos
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching criterios:', err);
            return res.status(500).json({ error: 'Error fetching criterios' });
        }
        res.json(results);
    });
});

  
