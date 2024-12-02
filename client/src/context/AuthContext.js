import React, { useState, createContext, useContext } from 'react';
import Cookies from 'js-cookie'; // Importa Cookies si no lo tienes ya

// Crear un contexto
const AuthContext = createContext();

// Proveedor para AuthContext
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('rol')); // Inicia basado en la cookie

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar AuthContext
export const useAuth = () => useContext(AuthContext);
