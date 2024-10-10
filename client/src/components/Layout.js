// src/components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header className='layout-header'/>
      <main className="layout-main">
        {children}
      </main>
      <Footer className='layout-footer'/>

      {/* <div></div> */}

    </div>
  );
};

export default Layout;
