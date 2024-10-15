
/* src/App.js */

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import Paciente from './pages/Paciente';
import Medico from './pages/Medico';
import EditPaciente from './pages/EditPaciente';  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/pacientes' element={<Paciente />} />
        <Route path='/medicos' element={<Medico />} />
        <Route path='/editPaciente/:idPersona' element={<EditPaciente />}/>
      </Routes>
    </Router>
  );
}

export default App;
