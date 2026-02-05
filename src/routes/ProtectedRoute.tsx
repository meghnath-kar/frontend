import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated() && AuthService.getUser();
  const isAdmin = AuthService.isAdmin();

  if (requireAuth && !isAuthenticated && !requireAdmin) {
    return <Navigate to={redirectTo || "/login"} state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirectTo || "/admin"} replace />;
  }

  return children;
};

export default ProtectedRoute;
