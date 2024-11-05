const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
app.use(cors());
app.use(express.json()); // Asegúrate de incluir este middleware

//conexion a la base de datos----------IMPORTANTE

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Luxxo.2004', // 11352871
  database: 'tuberculosisproyect',
});

// Comprobar conexión
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Puerto en el que corre el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});

// Rutas

// Ruta para obtener id y nombre de Sedes ------------------------------------------------------------
app.get('/api/sedes', (req, res) => {
  const query = `
    SELECT idSede, nombreSede 
    FROM Sede 
    WHERE estado = 1;  
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error obteniendo las sedes:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});

// Ruta para insertar red de salud -----------------------------------------------------------------
app.post('/api/redesSalud', (req, res) => {
  const { nombreRedSalud, idSede } = req.body;

  const query = `
    INSERT INTO RedSalud (nombreRedSalud, idSede)
    VALUES (?, ?);
  `;

  db.query(query, [nombreRedSalud, idSede], (err, result) => {
    if (err) {
      console.error('Error insertando la red de salud:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ message: 'Red de salud creada exitosamente', id: result.insertId });
  });
});

// Ruta para obtener redes de salud según la sede ----------------------------------------------
app.get('/api/redesSalud/:idSede', (req, res) => {
  const { idSede } = req.params;
  const query = `
    SELECT idRedSalud, nombreRedSalud 
    FROM RedSalud 
    WHERE idSede = ? AND estado = 1; 
  `;
  db.query(query, [idSede], (err, result) => {
    if (err) {
      console.error('Error obteniendo las redes de salud:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});

 // Ruta para insertar establecimiento de salud---------------------------------------------
app.post('/api/establecimientoSalud', (req, res) => {
  const { nombreEstablecimiento, telefono, clasificacion, idRedSalud } = req.body;

  // Primero, verificar si el establecimiento ya existe
  const checkQuery = `
    SELECT COUNT(*) AS count FROM establecimientosalud 
    WHERE nombreEstablecimiento = ?;
  `;

  db.query(checkQuery, [nombreEstablecimiento], (err, result) => {
    if (err) {
      console.error('Error verificando el establecimiento:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Si ya existe, retornar un error
    if (result[0].count > 0) {
      return res.status(400).json({ error: 'El establecimiento ya está registrado.' });
    }

    // Si no existe, proceder a la inserción
    const insertQuery = `
      INSERT INTO establecimientosalud (nombreEstablecimiento, telefono, clasificacion, idRedSalud)
      VALUES (?, ?, ?, ?);
    `;

    db.query(insertQuery, [nombreEstablecimiento, telefono, clasificacion, idRedSalud], (err, result) => {
      if (err) {
        console.error('Error insertando el establecimiento de salud:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.status(201).json({ message: 'Establecimiento de salud creado exitosamente', id: result.insertId });
    });
  });
});

// Ruta para obtener el personal de salud con búsqueda por nombre
app.get('/api/personalSalud', (req, res) => {
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
    WHERE p.estado = 1
  `;

  // Si hay un término de búsqueda, agregar la condición al query
  if (search) {
    query += ` AND (p.nombres LIKE ? OR p.primerApellido LIKE ? OR p.segundoApellido LIKE ?)`;
  }

  db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, result) => {
    if (err) {
      console.error('Error obteniendo el personal de salud:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});


//Insertar Personal Salud-----------------------------------------------------------------------------------------------------------
app.post('/api/personalSalud', (req, res) => {
  const { nombres, primerApellido, segundoApellido, numeroCelular, CI, rol, EstablecimientoSalud_idEstablecimientoSalud } = req.body;

  if (!EstablecimientoSalud_idEstablecimientoSalud) {
    return res.status(400).json({ error: 'El establecimiento de salud es obligatorio.' });
  }

  const checkQuery = `
    SELECT * FROM persona WHERE CI = ? OR numeroCelular = ?;
  `;

  db.query(checkQuery, [CI, numeroCelular], (err, results) => {
    if (err) {
      console.error('Error al verificar CI o número de celular:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'El CI o el número de celular ya están registrados.' });
    }

    const queryPersona = `
      INSERT INTO persona (nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.query(queryPersona, [nombres, primerApellido, segundoApellido, numeroCelular, CI, EstablecimientoSalud_idEstablecimientoSalud], (err, result) => {
      if (err) {
        console.error('Error al insertar la persona:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
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
          console.error('Error al insertar el personal de salud:', err);
          return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.status(201).json({ 
          message: 'Personal de salud registrado exitosamente', 
          credentials: { usuario, contrasenia } // Enviar las credenciales generadas
        });
      });
    });
  });
});

// Ruta para obtener establecimientos de salud -----------------------------------------------------------------------
app.get('/api/establecimientos', (req, res) => {
  const query = `
  SELECT idEstablecimientoSalud, nombreEstablecimiento 
  FROM establecimientosalud 
  WHERE estado = 1;  
`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error obteniendo los establecimientos:', err);
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

//obtener tratamientos ---------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/tratamientos/:personaId', (req, res) => {
  const { personaId } = req.params;

  const sql = `
    SELECT medicamento, fechaInicio, fechaFinalizacion, cantDosis, intervaloTiempo
    FROM tratamiento
    WHERE Persona_idPersona = ?;
  `;

  db.query(sql, [personaId], (err, result) => {
    if (err) {
      return res.status(500).send('Error al obtener los tratamientos');
    }
    res.json(result);
  });
});

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


// Ruta para obtener la lista de pacientes
app.get('/api/pacientes', (req, res) => {  
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
    LEFT JOIN criterioingreso ci ON p.idCriterioIngreso = ci.idCriterioIngreso  -- Asegúrate de que la columna exista
    WHERE p.estado = 1;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error obteniendo la lista de pacientes:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});

// Ruta para obtener criterios de ingreso -----------------------------------------------------------------------------------------------------------------------------
app.get('/api/criterios', (req, res) => {
  const query = 'SELECT idCriterioIngreso, tipo, subtipo, estadoIngreso FROM tuberculosisproyect.criterioingreso WHERE estado = 1;';
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error obteniendo los criterios:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(result);
  });
});


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

//ruta para obtener pacientes en el formulario actualizar--------------------------------------------------
app.get('/api/pacientesForm/:id', (req, res) => {
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
      console.error('Error al obtener el paciente:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(result[0]); 
  });
});

// Ruta para actualizar el paciente-------------------------------------------------------------------------------------
app.put('/api/pacientes/:id', (req, res) => {
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
      console.error('Error actualizando paciente:', err);
      return res.status(500).json({ error: 'Error actualizando paciente' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json({ message: 'Paciente actualizado correctamente' });
  });
});



//ruta para colocar el estado de 1 persona en 0 -----------------------------------------------------------------------------------------------------------------------------
app.put('/api/pacientesDelete/:id/estado', (req, res) => {
  const { id } = req.params;

  // Consulta SQL para actualizar el estado del paciente a 0
  const query = 'UPDATE persona SET estado = 0 WHERE idPersona = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al actualizar el estado del paciente:', error);
      return res.status(500).json({ message: 'Error al actualizar el estado del paciente.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }

    return res.status(200).json({ message: 'Estado del paciente actualizado a 0 correctamente.' });
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

  const query = ` SELECT PS.persona_idPersona AS Nro, PS.usuario AS Credencial, 
                  PS.contrasenia AS 'Clave Segura', PS.rol AS 'Nivel Acceso'
                  FROM personalsalud PS
                  WHERE PS.usuario = ? AND PS.contrasenia = ?`;   // CONSULTA SQL

  db.query(query, [nombreUsuario, contrasenia], (error, result) => {      // EJECUCION
    if (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json({      // ENVIO DE DATOS
      Nro: result[0].Nro,
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

