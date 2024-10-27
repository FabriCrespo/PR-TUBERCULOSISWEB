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
  password: '*************',  // DEBE CAMBIAR LA CONTRASEÑA
  database: 'tuberculosis',
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
    // Realizamos un JOIN entre la tabla 'persona' y 'criterioingreso'
    const query = `
      SELECT persona.*, criterioingreso.tipo, criterioingreso.subtipo, criterioingreso.estadoIngreso
      FROM persona
      LEFT JOIN criterioingreso ON persona.idCriterioIngreso = criterioingreso.idCriterioIngreso
      WHERE persona.estado = 1
    `;
  
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching pacientes:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
  });
  

// Ruta para actualizar un paciente
// Ruta para actualizar un paciente
app.put('/api/updatePaciente/:idPersona', (req, res) => {
    const { idPersona } = req.params;  
    const { nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, idCriterioIngreso } = req.body;

    // Formatear la fecha de nacimiento
    const formattedFechaNacimiento = fechaNacimiento.split('T')[0]; 

    const query = `
        UPDATE persona 
        SET nombres = ?, primerApellido = ?, segundoApellido = ?, numeroCelular = ?, CI = ?, direccion = ?, sexo = ?, fechaNacimiento = ?, idCriterioIngreso = ? 
        WHERE idPersona = ?
    `;
    
    db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, formattedFechaNacimiento, idCriterioIngreso, idPersona], (err, result) => {
        if (err) {
            console.error('Error updating paciente:', err);
            return res.status(500).json({ error: 'Error actualizando paciente', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json({ message: 'Paciente actualizado con éxito' });
    });
});

/* ****************************************************** */
/* ************************ LOGIN *********************** */
/* ****************************************************** */
// LOGIN O AUTENTICACION DE USUARIOS CON VERIFICACION DE NOMBRE_USUARIO Y CONTRASEÑA
app.get('/api/login', (req, res) => {
  const { usuario, contrasenia } = req.query;
  
  if (!usuario || !contrasenia) {
    return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
  }

  /*const query = `SELECT *
                 FROM persona
                 WHERE estado = 1 AND (correo = ? AND contrasenia = ?);`;*/
  const query = ` SELECT PS.persona_idPersona AS Nro, PS.usuario AS Credencial, PS.contrasenia AS 'Clave Segura', PS.rol AS 'Nivel Acceso'
                  FROM personalsalud PS
                  WHERE PS.usuario = ? AND PS.contrasenia = ?;`;
  /*const query = ` SELECT *
                  FROM personalsalud
                  WHERE usuario = ? AND contrasenia = ?;`;*/

  db.query(query, [usuario, contrasenia], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }



//
app.get('/api/redsalud', (req, res) => {
  const query = 'SELECT * FROM redSalud'; // Asegúrate de que 'redSalud' es el nombre correcto de tu tabla
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching redes de salud:', err);
          return res.status(500).send(err);
      }
      res.json(results);
      //res.json(result[0]);  // ENVIA EL PRIMER USUARIO ENCONTRADO
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

/* ****************************************************** */
/* ********************** PACIENTES ********************* */
/* ****************************************************** */
// PACIENTES 
app.get('/api/pacientes', (req, res) => {
  const query = ` SELECT P.idPersona AS Nro, P.nombres AS Nombres, P.primerApellido AS 'Primer Apellido', COALESCE(NULLIF(P.segundoApellido, ''), 'N/A') AS 'Segundo Apellido', P.numeroCelular AS 'Número Celular', IFNULL(P.fechaNacimiento, 'N/A') AS 'Fecha Nacimiento', IFNULL(P.sexo, 'N/A') AS Sexo, IFNULL(P.direccion, 'N/A') AS Dirección, P.CI AS Documento, P.EstablecimientoSalud_idEstablecimientoSalud AS 'Establecimiento Salud'
                  FROM persona P
                  WHERE estado = 1;`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});


/* ****************************************************** */
/* ******************* PERSONAL MÉDICO ****************** */
/* ****************************************************** */
// PERSONAL MEDICO
app.get('/api/medicos', (req, res) => {
  const query = ` SELECT P.idPersona AS Nro, P.nombres AS Nombres, P.primerApellido AS 'Primer Apellido', COALESCE(NULLIF(P.segundoApellido, ''), 'N/A') AS 'Segundo Apellido', P.numeroCelular AS 'Número Celular', IFNULL(P.fechaNacimiento, 'N/A') AS 'Fecha Nacimiento', IFNULL(P.sexo, 'N/A') AS Sexo, IFNULL(P.direccion, 'N/A') AS Dirección, P.CI AS Documento, P.EstablecimientoSalud_idEstablecimientoSalud AS 'Establecimiento de Salud'
                  FROM persona P
                  INNER JOIN personalsalud PS ON PS.persona_idPersona = p.idPersona
                  WHERE P.estado = 1 AND PS.rol = 'Doctor';`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
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

  

/**
 * IMPORTANTE! INSTALAR express
 * npm install express
 */

/**
 * IMPORTANTE! INSTALAR mysql2
 * npm install mysql2
 */

/**
 * IMPORTANTE! INSTALAR cors
 * npm install cors
 */

