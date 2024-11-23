import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homea from './pages/Homea';
import Homeps from './pages/Homeps';
import Homesa from './pages/Homesa';
import Login from './pages/Login'; 
import ListaPersonalSalud from './pages/ListaPersonalSalud';
import RegistrarEstablecimiento from './pages/RegistrarEstablecimiento';
import RegistrarPersonalSalud from './pages/RegistrarPersonalSalud';
import ActualizarPersonalSalud from './pages/ActualizarPersonalSalud';
import Tratamiento from './pages/tratamiento';
import Paciente from './pages/Paciente';
import AñadirPaciente from './pages/AñadirPaciente';
import ActualizarPaciente from './pages/ActualizarPaciente';
import Establecimientos from './pages/ListaEstablecimientos';
import Transferencia from './pages/Transferencia';
import TransferenciaSA from './pages/TransferenciaSA';
import TransferenciaPS from './pages/TransferenciaPS';
import ListasTransferencias from './pages/ListaTransferencias';
import ListasTransferenciasSA from './pages/ListaTransferenciasSA';
import ListasTransferenciasPS from './pages/ListaTransferenciasPS';
import VideoList from './pages/VideoList';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/Homea" element={<Homea />} />
          <Route path="/Homeps" element={<Homeps />} />
          <Route path="/Homesa" element={<Homesa />} />
          <Route path="/lista-personal-salud" element={<ListaPersonalSalud />} />
          <Route path="/lista-personal-salud" element={<ListaPersonalSalud />} />
          <Route path="/registrar-establecimiento" element={<RegistrarEstablecimiento />} />
          <Route path="/registrar-personal-salud" element={<RegistrarPersonalSalud />} />
          <Route path="/actualizar-personal-salud" element={<ActualizarPersonalSalud />} />
          <Route path="/seguimiento-tratamientos" element={<Tratamiento />} />
          <Route path="/lista-pacientes" element={<Paciente />} />
          <Route path="/añadir-paciente" element={<AñadirPaciente />} /> 
          <Route path="/actualizar-paciente/:id" element={<ActualizarPaciente />} />
          <Route path="/lista-establecimientos" element={<Establecimientos />} />
          <Route path="/transferencia" element={<Transferencia />} />
          <Route path="/transferenciaPS" element={<TransferenciaPS />} />
          <Route path="/transferenciaSA" element={<TransferenciaSA />} />
          <Route path="/lista-transferencias" element={<ListasTransferencias />} />
          <Route path="/lista-transferenciasPS" element={<ListasTransferenciasPS />} />
          <Route path="/lista-transferenciasSA" element={<ListasTransferenciasSA />} />
          <Route path="/videos" element={<VideoList />} />
        </Routes>
    </Router>
  );
}

export default App;
