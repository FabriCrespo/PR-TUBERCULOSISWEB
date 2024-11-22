// import Layout from '../components/Layout';
import React, { useState } from 'react';
import Signin from '../components/Signin';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');       // Nombre de usuario
    const [contrasenia, setContrasenia] = useState('');       // Contrasenia
    const [error, setError] = useState('');             // Mensajes de error
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const c_nombreUsuario = nombreUsuario.trim();
        const c_contrasenia = contrasenia.trim();

        //fetch(`http://localhost:3001/api/login?correo=${'admin@gmail.com'}&contrasenia=${'admin123'}`)
        //fetch(`http://localhost:3001/api/login?usuario=doc1&contrasenia=doc1`)
        try {
            const response = await fetch(`http://localhost:3001/api/login?nombreUsuario=${encodeURIComponent(c_nombreUsuario)}&contrasenia=${encodeURIComponent(c_contrasenia)}`);
            //const response = await fetch(`http://localhost:3001/api/login?nombreUsuario=josmar&contrasenia=784905875`);
            const data = await response.json();

            if (response.ok && data.rol) {
                const userRole = data.rol.toLowerCase();
                localStorage.setItem('userRole', userRole);

                // MAPEO DE RUTAS SEGUN EL ROL
                /*if (userRole === 'Administrador') {
                    navigate('./../medicos');
                } else if (userRole === 'Doctor') {
                    navigate('./../pacientes');
                }*/
                    const roleRoutes = {
                        //'administrador': '/lista-personal-salud', 
                        //'medico': '/lista-pacientes'
                        'administrador': '/homea', 
                        'medico': '/homeps'
                    };

                // REDIRIGIMOS SEGUN EL ROL DEL USUARIO
                navigate(roleRoutes[userRole] || '/');

            } else {
                setError(data.error || 'Credenciales incorrectas');
            }
            
            
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Error de conexión, intente nuevamente');
        }
        
    };
    
    
    return (
        <div>
            <Signin 
                usuario={nombreUsuario} 
                setUsuario={setNombreUsuario} 
                contrasenia={contrasenia} 
                setContrasenia={setContrasenia} 
                handleLogin={handleLogin} />
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Login;