import Layout from '../components/Layout';
import Signin from '../components/Signin';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    /*const [personal, setPersona] = useState([]);*/
    //const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');   // Correo del usuario
    const [contrasenia, setContrasenia] = useState(''); // Contrasenia
    const [error, setError] = useState('');     // Mensajes de error
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const c_correo = correo.replace(/"/g, '');
        const c_contrasenia = contrasenia.replace(/"/g, '');

        //fetch(`http://localhost:3001/api/login?correo=${'admin@gmail.com'}&contrasenia=${'admin123'}`)
        fetch(`http://localhost:3001/api/login?correo=${encodeURIComponent(c_correo)}&contrasenia=${encodeURIComponent(c_contrasenia)}`)

            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    const user = data;   // Acceder al primer usuario
                    
                    // GUARDAMOS EL ROL EN localStorage
                    localStorage.setItem('userRole', user.rol);
                    
                    // REDIRIGIMOS SEGUN EL ROL DEL USUARIO
                    if (user.rol === 'administrador') {
                        navigate('./../medicos');
                    } else if (user.rol === 'doctor') {
                        navigate('/../pacientes');
                    }
                } else {
                    setError('Credenciales incorrectas');
                }
            })
            .catch((error) => console.error('Error fetching', error));
    };
    
    
    return (
        <Layout>
            <Signin 
                correo={correo} 
                setCorreo={setCorreo} 
                contrasenia={contrasenia} 
                setContrasenia={setContrasenia} 
                handleLogin={handleLogin} ></Signin>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </Layout>
    );
};

export default Login;