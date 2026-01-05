import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../App.scss';
import Header from '../components/Header';
import Footer from '../components/Footer/Footer';

const Layout: React.FC = () => (
  <div className="app-container">
    <Header />
    <main className="container">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
