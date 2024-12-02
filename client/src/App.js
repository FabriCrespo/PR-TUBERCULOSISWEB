import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login'; 
import ListaPersonalSalud from './pages/ListaPersonalSalud';
import RegistrarEstablecimiento from './pages/RegistrarEstablecimiento';
import RegistrarPersonalSalud from './pages/RegistrarPersonalSalud';
import ActualizarPersonalSalud from './pages/ActualizarPersonalSalud';
import Tratamiento from './pages/tratamiento';
import Paciente from './pages/Paciente';
import AñadirPaciente from './pages/AñadirPaciente';
import ActualizarPaciente from './pages/ActualizarPaciente';
import RecuperarPacientes from './pages/RecuperarPacientes';
import Establecimientos from './pages/ListaEstablecimientos';
import ActualizarEstablecimiento from './pages/ActualizarEstablecimiento';
import Transferencia from './pages/Transferencia';
import PdfViewer from './pages/VistaPdf';
import ListaAdministradores from './pages/ListaAdministradores';
import ActualizarAdministrador from './pages/ActualizarAdministrador';
import RegistrarAdministrador from './pages/RegistrarAdministrador';






function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/lista-personal-salud" element={<ListaPersonalSalud />} />
          <Route path="/registrar-establecimiento" element={<RegistrarEstablecimiento />} />
          <Route path="/registrar-personal-salud" element={<RegistrarPersonalSalud />} />
          <Route path="/actualizar-personal-salud" element={<ActualizarPersonalSalud />} />
          <Route path="/seguimiento-tratamientos" element={<Tratamiento />} />
          <Route path="/lista-pacientes" element={<Paciente />} />
          <Route path="/añadir-paciente" element={<AñadirPaciente />} /> 
          <Route path="/actualizar-paciente/:id" element={<ActualizarPaciente />} />
          <Route path='/recuperar-pacientes' element={<RecuperarPacientes /> } />
          <Route path="/lista-establecimientos" element={<Establecimientos />} />
          <Route path='/actualizar-establecimiento/:id' element={<ActualizarEstablecimiento />} />
          <Route path="/transferencia" element={<Transferencia />} />
          <Route path='/vista-pdf' element={<PdfViewer />} />
          <Route path='/lista-admins' element={<ListaAdministradores/>}/>
          <Route path="/modificar-administrador/:id" element={<ActualizarAdministrador />} />
          <Route path='/registrar-administrador' element={<RegistrarAdministrador/>}/>

          
        </Routes>
      
    </Router>
  );
}

export default App;
