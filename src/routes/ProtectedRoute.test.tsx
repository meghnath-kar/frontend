import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthService from '../services/AuthService';

// Mock the AuthService
jest.mock('../services/AuthService', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(),
    isAdmin: jest.fn(),
  },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user is authenticated', () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to /admin when user is not authenticated', () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
    (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render children when user is authenticated and is admin (requireAdmin=true)', () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin-protected']}>
        <Routes>
          <Route
            path="/admin-protected"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div>Admin Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Protected Content')).toBeInTheDocument();
  });

  it('should redirect to /admin when user is authenticated but not admin (requireAdmin=true)', () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/admin-protected']}>
        <Routes>
          <Route
            path="/admin-protected"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div>Admin Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect to /admin when user is not authenticated (requireAdmin=true)', () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
    (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/admin-protected']}>
        <Routes>
          <Route
            path="/admin-protected"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div>Admin Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
