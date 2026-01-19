import React from 'react';
import Footer from '../../components/Footer';
import AdminLayout from './AdminLayout';

const Admin: React.FC = () => {
  return (
    <div className="admin-wrapper">
      <AdminLayout />
      <Footer />
    </div>
  );
};

export default Admin;