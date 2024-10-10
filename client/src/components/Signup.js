import React from "react";
import './Account.css';

const Signup = () => {
    return (
        <section className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <div className="card shadow-sm container-doc">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h2>Cree una cuenta</h2>
                            </div>

                            <form method="post">
                                <div className="row content">
                                    <div className="col-md-6 mb-3 input-field">
                                        <label className="form-label">*Primer Nombre</label>
                                        <input className="form-control input" type="text" placeholder="Ingrese su primer nombre"></input>
                                    </div>
                                    <div className="col-md-6 mb-3 input-field">
                                        <label className="form-label"> Segundo Nombre</label>
                                        <input className="form-control input" type="text" placeholder="Ingrese el segundo nombre"></input>
                                    </div>
                                </div>
                                <div className="row content">
                                    <div className="col-md-6 mb-3 input-field">
                                        <label className="form-label">*Primer Apellido</label>
                                        <input className="form-control input" type="text" placeholder="Ingrese su primer apellido"></input>
                                    </div>
                                    <div className="col-md-6 mb-3 input-field">
                                        <label className="form-label"> Segundo Apellido</label>
                                        <input className="form-control input" type="text" placeholder="Ingrese el segundo apellido"></input>
                                    </div>
                                </div>
                                <div className="mb-3 input-field">
                                    <label className="form-label">*Número Celular</label>
                                    <input className="form-control input" type="tel"></input>
                                </div>
                                <div className="mb-3 input-field">
                                    <label className="form-label"> Correo Electrónico</label>
                                    <input className="form-control input" type="email"></input>
                                </div>
                                <div className="mb-3 input-field">
                                    <label className="form-label"> Correo Electrónico</label>
                                    <select className="form-control input">
                                        <option value="2"></option>
                                        <option value="3"></option>
                                    </select>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;