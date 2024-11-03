// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Importar el módulo cors

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Permitir solicitudes desde otros dominios
app.use(express.json()); // Para procesar datos JSON en las solicitudes

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YOUNGE8H2S1re',  // DEBE CAMBIAR LA CONTRASEÑA
  database: 'tuberculosis',
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
// LOGIN O AUTENTICACION DE USUARIOS CON VERIFICACION DE NOMBRE_USUARIO Y CONTRASEÑA
// NOTA:      EJECUTAR -> ALTER TABLE personalsalud ADD COLUMN estado TINYINT DEFAULT 1;
//            1


app.get('/api/login', (req, res) => {
  const { nombreUsuario, contrasenia } = req.query;
  
  if (!nombreUsuario || !contrasenia) {
    return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
  }

  const query = ` SELECT PS.persona_idPersona AS Nro, PS.usuario AS Credencial, PS.contrasenia AS 'Clave Segura', PS.rol AS 'Nivel Acceso'
                  FROM personalsalud PS
                  WHERE PS.usuario = ? AND PS.contrasenia = ? AND PS.estado = 1;`;   // CONSULTA SQL

  db.query(query, [nombreUsuario, contrasenia], (error, result) => {      // EJECUCION
    if (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json({      // ENVIO DE DATOS
      id: result[0].Nro,
      usuario: result[0].Credencial,
      rol: result[0]['Nivel Acceso']
    });
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

/* ****************************************************** */
/* ****************** ACTUALIZAR MÉDICO ***************** */
/* ****************************************************** */
// ACTUALIZAR PERSONAL MEDICO
app.put('/api/actualizar_medico/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, primerApellido, segundoApellido, numeroCelular, fechaNacimiento, sexo, direccion, CI } = req.body;

  const query = ` UPDATE persona P
                  INNER JOIN personalsalud PS ON PS.persona_idPersona = P.idPersona
                  SET  P.nombres = ?, P.primerApellido = ?, P.segundoApellido = ?, P.numeroCelular = ?, P.fechaNacimiento = ?, P.sexo = ?, P.direccion = ?, CI = ?, fechaActualizacion = CURRENT_TIMESTAMP
                  WHERE P.estado = 1 AND PS.rol = 'Doctor' AND P.idPersona = ?;';`;
  
  db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, fechaNacimiento, sexo, direccion, CI, id], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json({ message: 'Personal médico actualizado exitosamente', result });
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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
