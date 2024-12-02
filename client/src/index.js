import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <div id='main'></div>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


