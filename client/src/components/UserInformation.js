/* src/pages/UserInformation.js */

import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const UserInformation = () => {
  const [userRole, setUserRole] = useState("");
  const [establishmentName, setEstablishmentName] = useState("");

  useEffect(() => {
    // Leer las cookies al cargar el componente
    const role = Cookies.get("rol"); // Obtener el rol de la cookie
    const establishment = Cookies.get("establecimientoNombre"); // Obtener el nombre del establecimiento de la cookie

    setUserRole(role || "Rol no definido"); // Asignar el rol o un valor por defecto
    setEstablishmentName(establishment || "Establecimiento no definido"); // Asignar el nombre del establecimiento o un valor por defecto
  }, []);

  return (
    <section style={{ display: 'flex', justifyContent: 'flex-end', padding: '0px' }}>
      <div className="card mb-3" style={{ marginTop: '0px', color: '#173D66', border: 'none', boxShadow: 'none' }}>
        <div className="row g-0">
          <div className="col-md-8">
            <div className="card-body">
              {/* Mostrar el rol en el párrafo principal */}
              <p className="card-text" style={{ color: '#173D66', display: 'ruby-text', marginBottom: '0' }}>{userRole}</p>
              {/* Mostrar el nombre del establecimiento */}
              <p className="card-text">
                <small className="text-body-secondary" style={{ color: '#173D66' }}>{establishmentName}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserInformation;


/*
<section style={{ display: 'flex', justifyContent: 'flex-end', padding: '0px' }}>
        <div className="card mb-3" style={{ marginTop: '0px', color: 'red', border: 'none', boxShadow: 'none' }}>
          <div className="row g-0">
            <div className="col-md-8">
              <div className="card-body">
                {/*<h5 className="card-title">Card title</h5>/}
                <p className="card-text"> This is a wider card. </p>
                <p className="card-text">
                  <small className="text-body-secondary">Last updated 3 mins ago</small>
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <img src="..." className="img-fluid rounded-start" alt="..." style={{ objectFit: 'cover', height: '100%' }} />
            </div>
          </div>
        </div>
      </section>
*/