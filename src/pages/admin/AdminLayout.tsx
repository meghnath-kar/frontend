import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.scss';
import { Outlet, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(AuthService.isAuthenticated() && AuthService.isAdmin());

  useEffect(() => {
    setIsAdmin(AuthService.isAuthenticated() && AuthService.isAdmin());
  }, [location]);

  return (
    <div className="admin-layout">
      { isAdmin && <AdminSidebar /> }
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
