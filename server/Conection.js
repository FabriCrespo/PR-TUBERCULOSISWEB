/* server/Conection.js */

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); // Asegúrate de incluir este middleware

const PORT = 3001;

app.use(express.urlencoded({ extended: true })); // Para datos URL-encoded


//conexion a la base de datos----------IMPORTANTE

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456", // 11352871
  database: "tuberculosisproyectlleno",
});

// Configura dónde se guardarán los archivos
const storage = multer.memoryStorage();  // Usamos memoria para almacenar el archivo en el buffer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar a 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'), false);
    }
    cb(null, true);
  }
});

// Uso del middleware
app.post("/upload", upload.single("documentoRef"), (req, res) => {
  if (req.file) {
    res.send("Archivo subido correctamente");
  } else {
    res.status(400).send("No se ha subido el archivo");
  }
});


// Comprobar conexión
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

// Puerto en el que corre el servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});



// Rutas

/***************************************************************************************/
/********************************* CRITERIO DE INGRESO *********************************/
/***************************************************************************************/
// Ruta para obtener criterios de ingreso -----------------------------------------------------------------------------------------------------------------------------
app.get("/api/criterios", (req, res) => {
  const query = 'SELECT idCriterioIngreso, tipo, subtipo, estadoIngreso FROM criterioingreso WHERE estado = 1;';

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error obteniendo los criterios:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});


/***************************************************************************************/
/****************************** ESTABLECIMIENTOS DE SALUD ******************************/
/***************************************************************************************/
// Ruta para insertar establecimiento de salud---------------------------------------------
app.post("/api/establecimientoSalud", (req, res) => {
  const { nombreEstablecimiento, telefono, clasificacion, idRedSalud } = req.body;

  // Primero, verificar si el establecimiento ya existe
  const checkQuery = `
    SELECT COUNT(*) AS count FROM establecimientosalud 
    WHERE nombreEstablecimiento = ?;
  `;

  db.query(checkQuery, [nombreEstablecimiento], (err, result) => {
    if (err) {
      console.error("Error verificando el establecimiento:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    // Si ya existe, retornar un error
    if (result[0].count > 0) {
      return res.status(400).json({ error: "El establecimiento ya está registrado." });
    }

    // Si no existe, proceder a la inserción
    const insertQuery = `
      INSERT INTO establecimientosalud (nombreEstablecimiento, telefono, clasificacion, idRedSalud)
      VALUES (?, ?, ?, ?);
    `;

    db.query(insertQuery, [nombreEstablecimiento, telefono, clasificacion, idRedSalud], (err, result) => {
      if (err) {
        console.error("Error insertando el establecimiento de salud:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
      res.status(201).json({ message: "Establecimiento de salud creado exitosamente", id: result.insertId });
    });
  });
});

// Ruta para obtener establecimientos de salud -----------------------------------------------------------------------
app.get('/api/establecimientosa/:idEstablecimientoSalud', (req, res) => {
  const { idEstablecimientoSalud } = req.params;
  const query = `
    SELECT idEstablecimientoSalud, nombreEstablecimiento
    FROM establecimientosalud
    WHERE estado = 1 AND idEstablecimientoSalud = ?;
  `;
  db.query(query, [idEstablecimientoSalud], (err, result) => {
    if (err) {
      console.error('Error obteniendo los establecimientos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontró el establecimiento de salud especificado.' });
    }
    res.json(result);
  });
});


app.get('/api/establecimientosl', (req, res) => {
  const { EstablecimientoSalud } = req.params;
  const query = `
  SELECT idEstablecimientoSalud, nombreEstablecimiento
  FROM establecimientosalud
  WHERE estado = 1;
`;

  db.query(query, [EstablecimientoSalud], (err, result) => {
    if (err) {
      console.error('Error obteniendo los establecimientos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontró el establecimiento de salud especificado.' });
    }
    
    res.json(result);
  });
});

// Ruta para obtener establecimientos de salud -----------------------------------------------------------------------
app.get("/api/establecimientos", (req, res) => {
  const query = `
  SELECT idEstablecimientoSalud AS id, nombreEstablecimiento AS nombre, clasificacion, telefono
  FROM establecimientosalud;`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});

// Ruta para eliminar un establecimiento de salud
app.delete('/api/establecimientos/:id', (req, res) => {
  const { id } = req.params;

  // Consulta para eliminar el establecimiento
  const query = 'UPDATE establecimientosalud SET estado = 0 WHERE idEstablecimientoSalud = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el establecimiento:', error);
      return res.status(500).json({ message: 'Error al eliminar el establecimiento.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Establecimiento no encontrado.' });
    }

    return res.status(200).json({ message: 'Establecimiento eliminado correctamente.' });
  });
});

// Ruta para obtener los establecimientos(LISTA) de salud con sus atributos
app.get('/api/establecimientosLista', (req, res) => {
  const query = `
  SELECT 
    e.idEstablecimientoSalud,
    e.nombreEstablecimiento,
    e.telefono,
    e.clasificacion,
    s.nombreSede,
    r.nombreRedSalud
  FROM establecimientosalud e
  JOIN redsalud r ON e.idRedSalud = r.idRedSalud
  JOIN sede s ON r.idSede = s.idSede
  WHERE e.estado = 1;
`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error obteniendo los establecimientos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});

// Ruta para eliminar un establecimiento de salud
app.delete('/api/establecimientos/:id', (req, res) => {
  const { id } = req.params;

  // Consulta para eliminar el establecimiento
  const query = 'UPDATE establecimientosalud SET estado = 0 WHERE idEstablecimientoSalud = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el establecimiento:', error);
      return res.status(500).json({ message: 'Error al eliminar el establecimiento.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Establecimiento no encontrado.' });
    }

    return res.status(200).json({ message: 'Establecimiento eliminado correctamente.' });
  });
});

//ruta para obtener establecimientoSalud 2-------------------------------------------------------------
app.get('/api/establecimientoo/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      e.idEstablecimientoSalud,
      e.nombreEstablecimiento,
      e.clasificacion,
      e.telefono,
      s.nombreSede,
      r.nombreRedSalud,
      e.idRedSalud
    FROM establecimientosalud e
    JOIN redsalud r ON e.idRedSalud = r.idRedSalud
    JOIN sede s ON r.idSede = s.idSede
    WHERE e.idEstablecimientoSalud = ? AND e.estado = 1;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error obteniendo el establecimiento:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Establecimiento no encontrado' });
    }
    res.json(result[0]);  // Enviar el primer establecimiento encontrado
  });
});

//ruta para actualizar establecimiento--------------------
app.put('/api/establecimientoo/:id', (req, res) => {
  const { id } = req.params;
  const { nombreEstablecimiento, clasificacion, telefono, idRedSalud } = req.body;

  const query = `
    UPDATE establecimientosalud
    SET nombreEstablecimiento = ?, clasificacion = ?, telefono = ?, idRedSalud = ?, fechaActualizacion = NOW()
    WHERE idEstablecimientoSalud = ? AND estado = 1;
  `;

  db.query(query, [nombreEstablecimiento, clasificacion, telefono, idRedSalud, id], (err, result) => {
    if (err) {
      console.error('Error actualizando el establecimiento:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Establecimiento no encontrado o no actualizado' });
    }
    res.json({ message: 'Establecimiento actualizado correctamente' });
  });
});

/***************************************************************************************/
/******************************** FAMILIAR DE REFERENCIA *******************************/
/***************************************************************************************/


/***************************************************************************************/
/*************************************** PACIENTE **************************************/
/***************************************************************************************/
// Ruta para insertar un nuevo paciente en la tabla persona -------------------------------------------------------------------------------------------------------------------
app.post('/api/pacientes', (req, res) => {
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, EstablecimientoSalud_idEstablecimientoSalud, idCriterioIngreso } = req.body;

  const query = 'INSERT INTO persona (nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, estado, EstablecimientoSalud_idEstablecimientoSalud, idCriterioIngreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)';

  db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, EstablecimientoSalud_idEstablecimientoSalud, idCriterioIngreso], (err, result) => {
    if (err) {
      console.error('Error insertando paciente:', err);
      return res.status(500).json({ error: 'Error insertando paciente' });
    }
    res.json({ message: 'Paciente insertado con éxito', id: result.insertId });
  });
});
// Ruta para obtener la lista de pacientes
/*app.get("/api/pacientes", (req, res) => {
  const query = `
    SELECT 
    p.idPersona, 
    CONCAT(p.nombres, ' ', p.primerApellido, ' ', IFNULL(p.segundoApellido, '')) AS nombreCompleto,
    p.numeroCelular, 
    p.fechaNacimiento, 
    p.sexo, 
    p.direccion, 
    p.CI,
    e.nombreEstablecimiento,
    CONCAT(ci.tipo, '-', ci.subtipo, '-', ci.estadoIngreso) AS criterioIngreso
    FROM persona p
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    LEFT JOIN criterioingreso ci ON p.idCriterioIngreso = ci.idCriterioIngreso
    LEFT JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    WHERE p.estado = 1 AND (ps.persona_idPersona IS NULL OR ps.rol NOT IN ('Medico', 'Administrador', 'Enfermero/a'));
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error obteniendo la lista de pacientes:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});*/

app.get("/api/pacientes", (req, res) => {
  const { establecimientoId } = req.query;
  const rolUsuario = req.query.rol;  // El rol del usuario se pasa como parámetro

  // Si es superadmin, no se filtra por establecimiento
  const query = rolUsuario === 'superadmin' ?
    `
    SELECT 
      p.idPersona, 
      CONCAT(p.nombres, ' ', p.primerApellido, ' ', IFNULL(p.segundoApellido, '')) AS nombreCompleto,
      p.numeroCelular, 
      p.fechaNacimiento, 
      p.sexo, 
      p.direccion, 
      p.CI,
      e.nombreEstablecimiento,
      CONCAT(ci.tipo, '-', ci.subtipo, '-', ci.estadoIngreso) AS criterioIngreso
    FROM persona p
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    LEFT JOIN criterioingreso ci ON p.idCriterioIngreso = ci.idCriterioIngreso
    LEFT JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    WHERE p.estado = 1
    AND (ps.persona_idPersona IS NULL OR ps.rol NOT IN ('Medico', 'Administrador', 'Enfermero/a','SuperAdmin'));
    ` :
    `
    SELECT 
      p.idPersona, 
      CONCAT(p.nombres, ' ', p.primerApellido, ' ', IFNULL(p.segundoApellido, '')) AS nombreCompleto,
      p.numeroCelular, 
      p.fechaNacimiento, 
      p.sexo, 
      p.direccion, 
      p.CI,
      e.nombreEstablecimiento,
      CONCAT(ci.tipo, '-', ci.subtipo, '-', ci.estadoIngreso) AS criterioIngreso
    FROM persona p
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    LEFT JOIN criterioingreso ci ON p.idCriterioIngreso = ci.idCriterioIngreso
    LEFT JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    WHERE p.estado = 1 
    AND e.idEstablecimientoSalud = ?
    AND (ps.persona_idPersona IS NULL OR ps.rol NOT IN ('Medico', 'Administrador', 'Enfermero/a','SuperAdmin'));
    `;

  db.query(query, rolUsuario === 'superadmin' ? [] : [establecimientoId], (err, result) => {
    if (err) {
      console.error("Error obteniendo la lista de pacientes:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});

//ruta para obtener pacientes en el formulario actualizar--------------------------------------------------
app.get("/api/pacientesForm/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT 
      p.idPersona, 
      p.nombres, 
      p.primerApellido, 
      p.segundoApellido, 
      p.numeroCelular, 
      p.fechaNacimiento, 
      p.sexo, 
      p.direccion, 
      p.CI,
      p.EstablecimientoSalud_idEstablecimientoSalud, 
      p.idCriterioIngreso
    FROM persona p
    WHERE p.idPersona = ? AND p.estado = 1;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el paciente:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.json(result[0]);
  });
});

// Ruta para actualizar el paciente-------------------------------------------------------------------------------------
app.put("/api/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, EstablecimientoSalud_idEstablecimientoSalud, idCriterioIngreso } = req.body;

  const query = `
    UPDATE persona 
    SET 
      nombres = ?, 
      primerApellido = ?, 
      segundoApellido = ?, 
      numeroCelular = ?, 
      CI = ?, 
      direccion = ?, 
      sexo = ?, 
      fechaNacimiento = ?, 
      EstablecimientoSalud_idEstablecimientoSalud = ?, 
      idCriterioIngreso = ? 
    WHERE idPersona = ?`;

  db.query(query, [nombres, primerApellido, segundoApellido, numeroCelular, CI, direccion, sexo, fechaNacimiento, EstablecimientoSalud_idEstablecimientoSalud, idCriterioIngreso, id], (err, result) => {
    if (err) {
      console.error("Error actualizando paciente:", err);
      return res.status(500).json({ error: "Error actualizando paciente" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json({ message: "Paciente actualizado correctamente" });
  });
});

//ruta para colocar el estado de 1 persona en 0 -----------------------------------------------------------------------------------------------------------------------------
app.put("/api/pacientesDelete/:id/estado", (req, res) => {
  const { id } = req.params;

  const query = "UPDATE persona SET estado = 0 WHERE idPersona = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al actualizar el estado del paciente:", error);
      return res.status(500).json({ message: "Error al actualizar el estado del paciente." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    return res.status(200).json({ message: "Estado del paciente actualizado a 0 correctamente." });
  });
});

//ruta para colocar reactivar a persona -----------------------------------------------------------------------------------------------------------------------------
app.put('/api/pacientesActive/:id/estado', (req, res) => {
  const { id } = req.params;


  const query = 'UPDATE persona SET estado = 1 WHERE idPersona = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al actualizar el estado del paciente:', error);
      return res.status(500).json({ message: 'Error al actualizar el estado del paciente.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }

    return res.status(200).json({ message: 'Estado del paciente actualizado a 1 correctamente.' });
  });
});

// Ruta para obtener la lista de pacientes eliminados
app.get("/api/pacientesEliminados", (req, res) => {
  const query = `
    SELECT
    p.idPersona,
    CONCAT(p.nombres, ' ', p.primerApellido, ' ', IFNULL(p.segundoApellido, '')) AS nombreCompleto,
    p.numeroCelular,
    p.fechaNacimiento,
    p.sexo,
    p.direccion,
    p.CI,
    e.nombreEstablecimiento,
    CONCAT(ci.tipo, '-', ci.subtipo, '-', ci.estadoIngreso) AS criterioIngreso
    FROM persona p
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    LEFT JOIN criterioingreso ci ON p.idCriterioIngreso = ci.idCriterioIngreso
    LEFT JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    WHERE p.estado = 0 AND (ps.persona_idPersona IS NULL OR ps.rol NOT IN ('Medico', 'Administrador', "Enfermero/a"));
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error obteniendo la lista de pacientes eliminados:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});

//recuperar paciente
app.put('/api/pacientesActive/:id/estado', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE persona SET estado = 1 WHERE idPersona = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al actualizar el estado del paciente:', error);
      return res.status(500).json({ message: 'Error al actualizar el estado del paciente.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }

    return res.status(200).json({ message: 'Estado del paciente actualizado a 1 correctamente.' });
  });
});

/***************************************************************************************/
/********************************** PERSONAL DE SALUD **********************************/
/***************************************************************************************/
//Insertar Personal Salud-----------------------------------------------------------------------------------------------------------
app.post("/api/personalSalud", (req, res) => {
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, rol, EstablecimientoSalud_idEstablecimientoSalud } = req.body;

  if (!EstablecimientoSalud_idEstablecimientoSalud) {
    return res.status(400).json({ error: "El establecimiento de salud es obligatorio." });
  }

  const checkQuery = `
    SELECT * FROM persona WHERE CI = ? OR numeroCelular = ?;
  `;

  db.query(checkQuery, [CI, numeroCelular], (err, results) => {
    if (err) {
      console.error("Error al verificar CI o número de celular:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "El CI o el número de celular ya están registrados." });
    }

    const queryPersona = `
      INSERT INTO persona (nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.query(queryPersona, [nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud], (err, result) => {
      if (err) {
        console.error("Error al insertar la persona:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      const personaId = result.insertId;

      const usuario = `${nombres.slice(0, 3).toLowerCase()}${primerApellido.slice(0, 3).toLowerCase()}`;
      const contrasenia = CI;

      const queryPersonalSalud = `
        INSERT INTO personalsalud (persona_idPersona, usuario, contrasenia, rol)
        VALUES (?, ?, ?, ?);
      `;

      db.query(queryPersonalSalud, [personaId, usuario, contrasenia, rol], (err, result) => {
        if (err) {
          console.error("Error al insertar el personal de salud:", err);
          return res.status(500).json({ error: "Error en el servidor" });
        }

        res.status(201).json({
          message: "Personal de salud registrado exitosamente",
          credentials: { usuario, contrasenia }, // Enviar las credenciales generadas
        });
      });
    });
  });
});

// Ruta para obtener el personal de salud con búsqueda por nombre
app.get("/api/personalSalud", (req, res) => {
  const { search, establecimientoId, rol } = req.query;

  if (!establecimientoId && rol !== 'superadmin') {
    return res.status(400).json({ error: "El ID del establecimiento es obligatorio." });
  }

  let query = `
    SELECT 
      p.idPersona, 
      p.nombres, 
      p.primerApellido, 
      p.segundoApellido, 
      p.numeroCelular, 
      ps.rol,  
      p.CI,
      e.nombreEstablecimiento
    FROM persona p
    INNER JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    WHERE p.estado = 1 
      AND (ps.rol = 'medico' OR ps.rol = 'enfermero/a')
  `;

  const params = [];

  // Si el rol no es superadmin, filtrar por establecimiento
  if (rol !== 'superadmin') {
    query += ` AND e.idEstablecimientoSalud = ?`;
    params.push(establecimientoId);
  }

  // Agregar búsqueda si está presente
  if (search) {
    query += ` AND (p.nombres LIKE ? OR p.primerApellido LIKE ? OR p.segundoApellido LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error obteniendo el personal de salud:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});


// Ruta para obtener el personal de salud INACTIVO
app.get('/api/personalSaludInactivo', (req, res) => {
  const { search } = req.query;
  let query = `
    SELECT 
      p.idPersona, 
      p.nombres, 
      p.primerApellido, 
      p.segundoApellido, 
      p.numeroCelular, 
      ps.rol,  
      p.CI,
      e.nombreEstablecimiento
    FROM persona p
    INNER JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    WHERE p.estado = 0
  `;

  db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, result) => {
    if (err) {
      console.error('Error obteniendo el personal de salud:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});

// Ruta para actualizar el personal de salud-------------------------------------------------------------------------------------
app.put('/api/personalSalud/:id', (req, res) => {
  const { id } = req.params; // id del personal de salud a actualizar
  const { nombres, primerApellido, segundoApellido, numeroCelular, rol, CI, EstablecimientoSalud_idEstablecimientoSalud } = req.body;

  // Actualizar la tabla persona
  const queryPersona = `
    UPDATE persona 
    SET nombres = ?, primerApellido = ?, segundoApellido = ?, numeroCelular = ?, CI = ?, EstablecimientoSalud_idEstablecimientoSalud = ? 
    WHERE idPersona = ?;
  `;

  db.query(queryPersona, [nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la persona:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Ahora actualizamos la tabla personalsalud
    const queryPersonalSalud = `
      UPDATE personalsalud 
      SET rol = ? 
      WHERE persona_idPersona = ?;
    `;

    db.query(queryPersonalSalud, [rol, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar el personal de salud:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      res.status(200).json({ message: 'Personal de salud actualizado correctamente' });
    });
  });
});

/***************************************************************************************/
/************************************ REDES DE SALUD ***********************************/
/***************************************************************************************/
// Ruta para insertar red de salud -----------------------------------------------------------------
// Ruta para insertar red de salud -----------------------------------------------------------------
app.post("/api/redesSalud", (req, res) => {
  const { nombreRedSalud, idSede } = req.body;

  const query = `
    INSERT INTO redsalud (nombreRedSalud, idSede)
    VALUES (?, ?);
  `;

  db.query(query, [nombreRedSalud, idSede], (err, result) => {
    if (err) {
      console.error("Error insertando la red de salud:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(201).json({ message: "Red de salud creada exitosamente", id: result.insertId });
  });
});

// Ruta para obtener redes de salud según la sede ----------------------------------------------
app.get("/api/redesSalud/:idSede", (req, res) => {
  const { idSede } = req.params;
  console.log('Solicitud recibida para idSede:', idSede);
  const query = `
    SELECT idRedSalud, nombreRedSalud 
    FROM redsalud 
    WHERE idSede = ? AND estado = 1; 
  `;
  db.query(query, [idSede], (err, result) => {
    if (err) {
      console.error("Error obteniendo las redes de salud:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    console.log('Redes de salud obtenidas:', result);
    res.json(result);
  });
});

/***************************************************************************************/
/**************************************** SEDES ****************************************/
/***************************************************************************************/
// Ruta para obtener id y nombre de Sedes ------------------------------------------------------------
app.get("/api/sedes", (req, res) => {
  const query = `
    SELECT idSede, nombreSede 
    FROM Sede 
    WHERE estado = 1;  
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error obteniendo las sedes:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});

/***************************************************************************************/
/************************************* SEGUIMIENTO *************************************/
/***************************************************************************************/

/***************************************************************************************/
/************************************ TRANSFERENCIA ************************************/
/***************************************************************************************/
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
    const query = `
      INSERT INTO transferencia (idEstablecimientoSaludOrigen, idPersona, idEstablecimientoSaludDestino, motivo, observacion, documentoRef)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [idEstablecimientoSaludOrigen, persona_idPersona, idEstablecimientoSaludDestino, Motivo, Observacion, documentoRef];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al insertar transferencia:', err);
        return res.status(500).json({ error: 'Error al guardar la transferencia' });
      }

      res.status(200).json({ message: 'Transferencia registrada exitosamente' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la transferencia' });
  }
});

// Obtener una transferencia por ID
app.get('/api/transferencias/:id', async (req, res) => {
  try {
    const query = 'SELECT * FROM transferencia WHERE idTransferencia = ?';
    const [rows] = await db.query(query, [req.params.id]);

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

// API PARA VER EL PDF
app.get("/api/get-pdf/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT documentoRef
    FROM transferencia 
    WHERE idTransferencia = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al recuperar el archivo PDF:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    const pdfData = result[0].documentoRef;

    // Establecer encabezados para enviar el archivo como respuesta
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfData);
  });
});

/***************************************************************************************/
/************************************* TRATAMIENTO *************************************/
/***************************************************************************************/
// Ruta para agregar un nuevo tratamiento--------------------------------------------------------------------------------------------------------------------
app.post('/api/tratamientos', (req, res) => {
  const { medicamento, fechaInicio, fechaFinalizacion, cantDosis, intervaloTiempo, Persona_idPersona } = req.body;

  const query = `
    INSERT INTO tratamiento (medicamento, fechaInicio, fechaFinalizacion, cantDosis, intervaloTiempo, Persona_idPersona)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(query, [medicamento, fechaInicio, fechaFinalizacion, cantDosis, intervaloTiempo, Persona_idPersona], (err, result) => {
    if (err) {
      console.error('Error insertando tratamiento:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ message: 'Tratamiento añadido exitosamente', id: result.insertId });
  });
});

//obtener tratamientos ---------------------------------------------------------------------------------------------------------------------------------------------
app.get("/api/tratamientos/:personaId", (req, res) => {
  const { personaId } = req.params;

  const sql = `
    SELECT medicamento, fechaInicio, fechaFinalizacion, cantDosis, intervaloTiempo
    FROM tratamiento
    WHERE Persona_idPersona = ?;
  `;

  db.query(sql, [personaId], (err, result) => {
    if (err) {
      return res.status(500).send("Error al obtener los tratamientos");
    }
    res.json(result);
  });
});


/***************************************************************************************/
/**************************************** LOGIN ****************************************/
/***************************************************************************************/
// LOGIN O AUTENTICACION DE USUARIOS CON VERIFICACION DE NOMBRE_USUARIO Y CONTRASEÑA
// NOTA:      EJECUTAR -> ALTER TABLE personalsalud ADD COLUMN estado TINYINT DEFAULT 1;
//            1
app.get("/api/login", (req, res) => {
  const { nombreUsuario, contrasenia } = req.query;
  if (!nombreUsuario || !contrasenia) {
    return res.status(400).json({ error: "Nombre de usuario y contraseña son obligatorios" });
  }
  const query = `
    SELECT 
      PS.persona_idPersona AS Nro,
      PS.usuario AS Credencial,
      PS.contrasenia AS 'Clave Segura',
      PS.rol AS 'Nivel Acceso',
      ES.idEstablecimientoSalud AS EstablecimientoId,
      ES.nombreEstablecimiento AS EstablecimientoNombre
    FROM 
      personalsalud PS
    JOIN 
      persona P ON PS.persona_idPersona = P.idPersona
    JOIN 
      establecimientosalud ES ON P.EstablecimientoSalud_idEstablecimientoSalud = ES.idEstablecimientoSalud
    WHERE 
      PS.usuario = ? AND PS.contrasenia = ? AND P.estado = 1;
  `;

  db.query(query, [nombreUsuario, contrasenia], (error, result) => {

    if (error) {

      return res.status(500).json({ error: "Error en el servidor" });

    }

    if (result.length === 0) {

      return res.status(401).json({ error: "Credenciales incorrectas" });

    }

    res.json({
      Nro: result[0].Nro,
      usuario: result[0].Credencial,
      rol: result[0]["Nivel Acceso"],
      establecimiento: {
        id: result[0].EstablecimientoId,
        nombre: result[0].EstablecimientoNombre,
      },
    });
  });
});

// RUTA PROTEGIDA SOLO PARA ADMINISTRADORES
const verifyRole = (role) => {
  return (req, res, next) => {
    const { correo, contrasenia } = req.query;

    const query =
      "SELECT rol FROM persona WHERE correo = ? AND contrasenia = ?";
    db.query(query, [correo, contrasenia], (error, result) => {
      if (error || result.length === 0 || result[0].rol !== role) {
        return res.status(403).json({ error: "No autorizado" });
      }
      next();
    });
  };
};
app.get("/api/admin-data", verifyRole("administrador"), (req, res) => {
  res.json({ message: "Datos confidenciales del administrador" });
});

// OBTENER LOS DATOS  RELACIONADOS AL USUARIO
app.get("/api/data-user/:idPersona", (req, res) => {
  const { idPersona } = req.query; // Obtener el idPersona desde los parámetros de la solicitud

  const query = `
    SELECT 
      P.idPersona, 
      P.nombres, 
      ES.idEstablecimientoSalud, 
      ES.nombreEstablecimiento
    FROM 
      persona P
    LEFT JOIN 
      establecimientosalud ES 
    ON 
      P.EstablecimientoSalud_idEstablecimientoSalud = ES.idEstablecimientoSalud
    WHERE 
      P.estado = 1 
      AND P.idPersona = ?`;

  // Ejecutar la consulta
  db.query(query, [idPersona], (err, result) => {
    if (err) {
      console.error("Error al recuperar datos del usuario:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result[0]); // Enviar el primer resultado
  });
});

// -------------------administradores-----------------
// para hacer crud de administradores
// Ruta para obtener los administradores
app.get("/api/administradores", (req, res) => {
  const query = `
    SELECT 
      p.idPersona, 
      p.nombres, 
      p.primerApellido, 
      p.segundoApellido, 
      p.numeroCelular, 
      ps.rol, 
      p.CI,
      e.idEstablecimientoSalud, 
      e.nombreEstablecimiento
    FROM persona p
    INNER JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    WHERE ps.rol = 'Administrador'
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener los administradores:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(result);
  });
});

//para actualizar admin
app.put("/api/administradores/:id", (req, res) => {
  const { id } = req.params;
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud } = req.body;

  const queryPersona = `
    UPDATE persona 
    SET nombres = ?, primerApellido = ?, segundoApellido = ?, numeroCelular = ?, CI = ?
    WHERE idPersona = ?
  `;

  db.query(queryPersona, [nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el administrador:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.status(200).json({ message: 'Administrador actualizado correctamente' });
  });
});

//para eliminar admin
app.delete("/api/administradores/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE persona 
    SET estado = 0 
    WHERE idPersona = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el administrador:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.status(200).json({ message: 'Administrador eliminado correctamente' });
  });
});

//insertar admin
/* API: Registrar Administrador */

app.post("/api/administradores", (req, res) => {
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud } = req.body;
  
  // Verificar que todos los campos requeridos estén presentes
  if (!nombres || !primerApellido || !numeroCelular || !CI || !EstablecimientoSalud_idEstablecimientoSalud) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Consulta SQL para insertar el nuevo administrador en la base de datos
  const queryPersona = `
    INSERT INTO persona (nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(queryPersona, [nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud], (err, result) => {
    if (err) {
      console.error('Error al registrar el administrador:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    const personaId = result.insertId;
    const usuario = `${nombres.slice(0, 3).toLowerCase()}${primerApellido.slice(0, 3).toLowerCase()}`;
    const contrasenia = CI;  // Considera encriptar la contraseña

    // Insertar el rol "Administrador" para la persona recién creada
    const queryPersonalSalud = `
      INSERT INTO personalsalud (persona_idPersona, usuario, contrasenia, rol)
      VALUES (?, ?, ?, 'Administrador');
    `;

    db.query(queryPersonalSalud, [personaId, usuario, contrasenia], (err, result) => {
      if (err) {
        console.error('Error al asignar el rol:', err);
        return res.status(500).json({ error: 'Error al asignar el rol' });
      }

      res.status(201).json({ message: 'Administrador registrado correctamente' });
    });
  });
});

//para
app.get("/api/administradores/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      p.idPersona, 
      p.nombres, 
      p.primerApellido, 
      p.segundoApellido, 
      p.numeroCelular, 
      ps.rol, 
      p.CI,
      e.idEstablecimientoSalud, 
      e.nombreEstablecimiento
    FROM persona p
    INNER JOIN personalsalud ps ON p.idPersona = ps.persona_idPersona
    INNER JOIN establecimientosalud e ON p.EstablecimientoSalud_idEstablecimientoSalud = e.idEstablecimientoSalud
    WHERE ps.rol = 'Administrador' AND p.idPersona = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el administrador:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.json(result[0]);  // Devuelve solo el primer administrador
  });
});
