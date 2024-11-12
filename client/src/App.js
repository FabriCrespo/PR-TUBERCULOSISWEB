import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ListaPersonalSalud from './pages/ListaPersonalSalud';
import RegistrarEstablecimiento from './pages/RegistrarEstablecimiento';
import RegistrarPersonalSalud from './pages/RegistrarPersonalSalud';
import ActualizarPersonalSalud from './pages/ActualizarPersonalSalud';
import Tratamiento from './pages/tratamiento';
import Paciente from './pages/Paciente';
import AñadirPaciente from './pages/AñadirPaciente';
import ActualizarPaciente from './pages/ActualizarPaciente';
import Transferencia from './pages/Transferencia';







function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lista-personal-salud" element={<ListaPersonalSalud />} />
          <Route path="/registrar-establecimiento" element={<RegistrarEstablecimiento />} />
          <Route path="/registrar-personal-salud" element={<RegistrarPersonalSalud />} />
          <Route path="/actualizar-personal-salud" element={<ActualizarPersonalSalud />} />
          <Route path="/seguimiento-tratamientos" element={<Tratamiento />} />
          <Route path="/lista-pacientes" element={<Paciente />} />
          <Route path="/añadir-paciente" element={<AñadirPaciente />} /> 
          <Route path="/actualizar-paciente/:id" element={<ActualizarPaciente />} />
          <Route path="/transferencia" element={<Transferencia />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
