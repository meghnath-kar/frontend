import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UserRegister from './UserRegister';
import AuthService from '../services/AuthService';
import useAuthRedirect from '../hooks/useAuthRedirect';

jest.mock('../services/AuthService', () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
    saveAuthData: jest.fn(),
    isAuthenticated: jest.fn(),
  },
}));

jest.mock('../hooks/useAuthRedirect');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserRegister Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthRedirect as jest.Mock).mockImplementation(() => {});
  });

  const renderUserRegister = (initialEntries = ['/register']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the registration form with all elements', () => {
      renderUserRegister();

      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText(/join us today/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render link to login page', () => {
      renderUserRegister();

      expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should have correct placeholder text for inputs', () => {
      renderUserRegister();

      expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your country/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update full name field when typing', () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      expect(fullNameInput.value).toBe('John Doe');
    });

    it('should update email field when typing', () => {
      renderUserRegister();

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field when typing', () => {
      renderUserRegister();

      const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('should update confirm password field when typing', () => {
      renderUserRegister();

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      expect(confirmPasswordInput.value).toBe('password123');
    });

    it('should update country field when typing', () => {
      renderUserRegister();

      const countryInput = screen.getByLabelText(/country/i) as HTMLInputElement;
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      expect(countryInput.value).toBe('USA');
    });

    it('should clear error message when user types in form fields', async () => {
      renderUserRegister();

      const submitButton = screen.getByRole('button', { name: /create account/i });
    
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });

      const fullNameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error when full name is empty', async () => {
      renderUserRegister();

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is empty', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should accept valid email format', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });

    it('should show error when password is empty', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is less than 6 characters', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show error when country is empty', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/country is required/i)).toBeInTheDocument();
      });
    });

    it('should not show errors when all fields are valid', async () => {
      const mockRegisterResponse = {
        user: {
          _id: '123',
          fullName: 'John Doe',
          email: 'test@example.com',
          country: 'USA',
          userType: { _id: '1', name: 'user' },
        },
        token: 'mock-token',
      };

      (AuthService.register as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call AuthService.register with correct data on submit', async () => {
      const mockRegisterResponse = {
        user: {
          _id: '123',
          fullName: 'John Doe',
          email: 'test@example.com',
          country: 'USA',
          userType: { _id: '1', name: 'user' },
        },
        token: 'mock-token',
      };

      (AuthService.register as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(AuthService.register).toHaveBeenCalledWith({
          fullName: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
          country: 'USA',
        });
      });
    });

    it('should save auth data and navigate to /search on successful registration', async () => {
      const mockRegisterResponse = {
        user: {
          _id: '123',
          fullName: 'John Doe',
          email: 'test@example.com',
          country: 'USA',
          userType: { _id: '1', name: 'user' },
        },
        token: 'mock-token',
      };

      (AuthService.register as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(AuthService.saveAuthData).toHaveBeenCalledWith('mock-token', mockRegisterResponse.user);
        expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
      });
    });

    it('should show error message when registration fails', async () => {
      (AuthService.register as jest.Mock).mockRejectedValueOnce(new Error('Email already exists'));

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it('should show generic error when registration response is invalid', async () => {
      (AuthService.register as jest.Mock).mockResolvedValueOnce({
        user: null,
        token: null,
      });

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/registration failed\. please try again\./i)).toBeInTheDocument();
      });
    });

    it('should show generic error message when error has no message', async () => {
      (AuthService.register as jest.Mock).mockRejectedValueOnce({});

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/an error occurred during registration/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during registration', async () => {
      const mockRegisterResponse = {
        user: {
          _id: '123',
          fullName: 'John Doe',
          email: 'test@example.com',
          country: 'USA',
          userType: { _id: '1', name: 'user' },
        },
        token: 'mock-token',
      };

      (AuthService.register as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockRegisterResponse), 100))
      );

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByText(/creating account\.\.\./i)).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should disable form inputs during loading', async () => {
      const mockRegisterResponse = {
        user: {
          _id: '123',
          fullName: 'John Doe',
          email: 'test@example.com',
          country: 'USA',
          userType: { _id: '1', name: 'user' },
        },
        token: 'mock-token',
      };

      (AuthService.register as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockRegisterResponse), 100))
      );

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(fullNameInput).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(confirmPasswordInput).toBeDisabled();
        expect(countryInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });

      await waitFor(() => {
        expect(fullNameInput).not.toBeDisabled();
      }, { timeout: 3000 });
    });

    it('should reset loading state after error', async () => {
      (AuthService.register as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Navigation Links', () => {
    it('should have a link to login page', () => {
      renderUserRegister();

      const loginLink = screen.getByRole('link', { name: /sign in/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Attributes', () => {
    it('should have correct input types', () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);

      expect(fullNameInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(countryInput).toHaveAttribute('type', 'text');
    });

    it('should have autocomplete attributes', () => {
      renderUserRegister();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
      expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should have correct input names', () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);

      expect(fullNameInput).toHaveAttribute('name', 'fullName');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(confirmPasswordInput).toHaveAttribute('name', 'confirmPassword');
      expect(countryInput).toHaveAttribute('name', 'country');
    });
  });

  describe('useAuthRedirect Hook', () => {
    it('should call useAuthRedirect hook on mount', () => {
      renderUserRegister();

      expect(useAuthRedirect).toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    it('should display error in an alert with danger role', async () => {
      renderUserRegister();

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('alert-danger');
      });
    });

    it('should clear error when form becomes valid', async () => {
      renderUserRegister();

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      const fullNameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Email Validation Edge Cases', () => {
    it('should reject email without extension', async () => {
      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should accept valid email with subdomain', async () => {
      const mockRegisterResponse = {
        user: {
          _id: '123',
          fullName: 'John Doe',
          email: 'test@mail.example.com',
          country: 'USA',
          userType: { _id: '1', name: 'user' },
        },
        token: 'mock-token',
      };

      (AuthService.register as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);

      renderUserRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const countryInput = screen.getByLabelText(/country/i);
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@mail.example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.change(countryInput, { target: { value: 'USA' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(AuthService.register).toHaveBeenCalled();
      });
    });
  });
});
