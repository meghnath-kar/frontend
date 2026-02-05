import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './UserLogin';
import AuthService from '../services/AuthService';
import useAuthRedirect from '../hooks/useAuthRedirect';

jest.mock('../services/AuthService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    saveAuthData: jest.fn(),
    isAuthenticated: jest.fn(),
    isAdmin: jest.fn(),
  },
}));

jest.mock('../hooks/useAuthRedirect');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

describe('UserLogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthRedirect as jest.Mock).mockImplementation(() => {});
  });

  const renderUserLogin = (initialEntries = ['/login']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<div>Register Page</div>} />
          <Route path="/admin" element={<div>Admin Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the login form with all elements', () => {
      renderUserLogin();

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render links to register and admin login', () => {
      renderUserLogin();

      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /admin login/i })).toBeInTheDocument();
    });

    it('should have correct placeholder text for inputs', () => {
      renderUserLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update email field when typing', () => {
      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field when typing', () => {
      renderUserLogin();

      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('should clear error message when user types in form fields', () => {
      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      (AuthService.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));
      fireEvent.click(submitButton);

      waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      waitFor(() => {
        expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call AuthService.login with correct credentials on submit', async () => {
      const mockLoginResponse = {
        user: {
          _id: '123',
          fullName: 'Test User',
          email: 'test@example.com',
          country: 'USA',
          age: 25,
          userType: { _id: '1', name: 'user' },
          is_active: true,
          createdAt: '2025-01-01',
        },
        token: 'mock-token',
      };

      (AuthService.login as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(AuthService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should save auth data and navigate to /search on successful login', async () => {
      const mockLoginResponse = {
        user: {
          _id: '123',
          fullName: 'Test User',
          email: 'test@example.com',
          country: 'USA',
          age: 25,
          userType: { _id: '1', name: 'user' },
          is_active: true,
          createdAt: '2025-01-01',
        },
        token: 'mock-token',
      };

      (AuthService.login as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(AuthService.saveAuthData).toHaveBeenCalledWith('mock-token', mockLoginResponse.user);
        expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during login', async () => {
      const mockLoginResponse = {
        user: {
          _id: '123',
          fullName: 'Test User',
          email: 'test@example.com',
          country: 'USA',
          age: 25,
          userType: { _id: '1', name: 'user' },
          is_active: true,
          createdAt: '2025-01-01',
        },
        token: 'mock-token',
      };

      (AuthService.login as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockLoginResponse), 100))
      );

      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/signing in\.\.\./i)).not.toBeInTheDocument();
      });
    });

    it('should disable form inputs during loading', async () => {
      const mockLoginResponse = {
        user: {
          _id: '123',
          fullName: 'Test User',
          email: 'test@example.com',
          country: 'USA',
          age: 25,
          userType: { _id: '1', name: 'user' },
          is_active: true,
          createdAt: '2025-01-01',
        },
        token: 'mock-token',
      };

      (AuthService.login as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockLoginResponse), 100))
      );

      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(emailInput).not.toBeDisabled();
      });
    });
  });

  describe('Navigation Links', () => {
    it('should have a link to register page', () => {
      renderUserLogin();

      const registerLink = screen.getByRole('link', { name: /sign up/i });
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should have a link to admin login page', () => {
      renderUserLogin();

      const adminLink = screen.getByRole('link', { name: /admin login/i });
      expect(adminLink).toHaveAttribute('href', '/admin');
    });
  });

  describe('Form Validation', () => {
    it('should have required attribute on email field', () => {
      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeRequired();
    });

    it('should have required attribute on password field', () => {
      renderUserLogin();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeRequired();
    });

    it('should have email type on email input', () => {
      renderUserLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password type on password input', () => {
      renderUserLogin();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('useAuthRedirect Hook', () => {
    it('should call useAuthRedirect hook on mount', () => {
      renderUserLogin();

      expect(useAuthRedirect).toHaveBeenCalled();
    });
  });
});
