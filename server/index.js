// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Importar el módulo cors
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true })); // Para datos URL-encoded
app.use(express.json());

// Configura dónde se guardarán los archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Nombre original del archivo
  }
});

// Limita el tamaño del archivo
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

  
// Uso del middleware
app.post('/upload', upload.single('documentoRef'), (req, res) => {
  if (req.file) {
    res.send('Archivo subido correctamente');
  } else {
    res.status(400).send('No se ha subido el archivo');
  }
});

// Middleware
app.use(cors()); // Permitir solicitudes desde otros dominios
app.use(express.json()); // Para procesar datos JSON en las solicitudes

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',  
  database: 'tuberculosisproyect',
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});


// Rutas
app.get('/api/redsalud', (req, res) => {
  const query = 'SELECT * FROM tuberculosis.redsalud;'; // Asegúrate de que 'foods' sea el nombre correcto de la tabla
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result); // Devuelve los datos en formato JSON
  });
});


/* ****************************************************** */
/* ************************ LOGIN *********************** */
/* ****************************************************** */
// LOGIN O AUTENTICACION DE USUARIOS CON VERIFICACION DE CORREO Y CONTRASEÑA
app.get('/api/login', (req, res) => {
  const { correo, contrasenia } = req.query;
  
  if (!correo || !contrasenia) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const query = `SELECT *
                 FROM persona
                 WHERE estado = 1 AND (correo = ? AND contrasenia = ?);`;

  db.query(query, [correo, contrasenia], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json(result[0]);  // Envia el primer resultado de mi usuario
  });
});

// RUTA PROTEGIDA SOLO PARA ADMINISTRADORES
const verifyRole = (role) => {
  return (req, res, next) => {
    const { correo, contrasenia } = req.query;

    const query = 'SELECT rol FROM persona WHERE correo = ? AND contrasenia = ?';
    db.query(query, [correo, contrasenia], (error, result) => {
      if (error || result.length ===0 || result[0].rol !== role) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      next();
    });
  };
};

app.get('/api/admin-data', verifyRole('administrador'), (req, res) => {
  res.json({ message: 'Datos confidenciales del administrador' });
});


/* ****************************************************** */
/* ********************** PACIENTES ********************* */
/* ****************************************************** */
// PACIENTES 
app.get('/api/pacientes', (req, res) => {
  const query = `SELECT idPersona, CONCAT(nombres, ' ', IFNULL(primerApellido, ''), ' ', IFNULL(segundoApellido, '')) AS nombreCompleto, CI, fechaNacimiento, sexo, numeroCelular, direccion
                 FROM persona;`; // Se eliminó el filtro por rol
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
  const query = ` SELECT idPersona, CONCAT(primerNombre, ' ', IFNULL(segundoNombre,''), ' ', primerApellido, ' ', IFNULL(segundoApellido,'')) AS nombreCompleto, CI, correo, numeroCelular
                  FROM persona
                  WHERE rol = 'doctor';`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});

/* ****************************************************** */
/* ******************* ESTABLECIMIENTOS ****************** */
/* ****************************************************** */
// ESTABLECIMIENTOS DE SALUD
app.get('/api/establecimientos', (req, res) => {
  const query = `SELECT idEstablecimientoSalud AS id, nombreEstablecimiento AS nombre, clasificacion, telefono
                 FROM establecimientosalud;`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});


app.post('/api/transferencias', upload.single('documentoRef'), async (req, res) => {
  try {
    // Verifica si el archivo fue recibido
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    // Accede al archivo como buffer
    const documentoRef = req.file.buffer;

    // Verifica que los campos necesarios estén presentes en el cuerpo de la solicitud
    const { idEstablecimientoSaludOrigen, persona_idPersona, idEstablecimientoSaludDestino, Motivo, Observacion } = req.body;

    if (!idEstablecimientoSaludOrigen || !persona_idPersona || !idEstablecimientoSaludDestino || !Motivo || !Observacion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios en la solicitud' });
    }

    // Guarda la transferencia en la base de datos
    await db.query('INSERT INTO transferencias SET ?', {
      idEstablecimientoSaludOrigen,
      persona_idPersona,
      idEstablecimientoSaludDestino,
      Motivo,
      Observacion,
      documentoRef  // Guarda el buffer del archivo en el campo `documentoRef`
    });

    // Responde con éxito
    res.status(200).json({ message: 'Transferencia registrada exitosamente' });
  } catch (error) {
    // Maneja cualquier error en el proceso
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la transferencia' });
  }
});


app.get('/transferencias/:id', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM transferencias WHERE id = ?', [req.params.id]);

      if (rows.length > 0) {
          const transferencia = rows[0];
          res.json({
              ...transferencia,
              documentoRef: transferencia.documentoRef.toString('base64')  // Convierte el buffer a base64
          });
      } else {
          res.status(404).json({ error: 'Transferencia no encontrada' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener la transferencia' });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
