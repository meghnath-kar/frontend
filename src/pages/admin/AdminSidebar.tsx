import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './AdminLayout.scss';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    AuthService.logout();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <i className="bi bi-book"></i>
          <span>Manage Courses</span>
        </NavLink>
        <NavLink to="/admin/courses/add" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <i className="bi bi-plus-circle"></i>
          <span>Add Course</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <i className="bi bi-people"></i>
          <span>Manage Users</span>
        </NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <i className="bi bi-tags"></i>
          <span>Categories</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <i className="bi bi-gear"></i>
          <span>Settings</span>
        </NavLink>
        <NavLink to="/admin" onClick={handleLogout} className="nav-item">
          <i className="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
