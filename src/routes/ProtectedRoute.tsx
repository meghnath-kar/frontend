import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAdmin?: boolean;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireAuth = true,
  redirectTo
}) => {
  const isAuthenticated = AuthService.isAuthenticated() && AuthService.getUser();
  const isAdmin = AuthService.isAdmin();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirectTo || "/admin"} replace />;
  }

  return children;
};

export default ProtectedRoute;
