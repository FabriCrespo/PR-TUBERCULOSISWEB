import Layout from '../components/Layout';
import Signin from '../components/Signin';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');       // Nombre de usuario
    const [contrasenia, setContrasenia] = useState('');       // Contrasenia
    const [error, setError] = useState('');             // Mensajes de error
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        //const c_username = username.replace(/"/g, '');
        //const c_password = password.replace(/"/g, '');

        //fetch(`http://localhost:3001/api/login?correo=${'admin@gmail.com'}&contrasenia=${'admin123'}`)
        //fetch(`http://localhost:3001/api/login?usuario=doc1&contrasenia=doc1`)
        try {
            const response = await fetch(`http://localhost:3001/api/login?nombreUsuario=${encodeURIComponent(nombreUsuario)}&contrasenia=${encodeURIComponent(contrasenia)}`);
            const data = await response.json();

            if (response.ok) {
                const userRole = data['Nivel Acceso'];
                localStorage.setItem('userRole', userRole);

                // REDIRIGIMOS SEGUN EL ROL DEL USUARIO
                if (userRole === 'Administrador') {
                    navigate('./../medicos');
                } else if (userRole === 'Doctor') {
                    navigate('./../pacientes');
                }
            } else {
                setError(data.error || 'Credenciales incorrectas');
            }
            
            
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Error de conexión, intente nuevamente');
        }
        
    };
    
    
    return (
        <Layout>
            <Signin 
                /*usuario={username} 
                setUsuario={setUsername} 
                contrasenia={password} 
                setContrasenia={setPassword} 
                handleLogin={handleLogin} ></Signin>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </Layout>
    );
};

export default Login;

/*
HTTP Request    HTTP/1.1 200 OK
Status line     
HEADERS
BODY



Scheme              hosta name              Path
https://            graph.microsoft.com     




*/