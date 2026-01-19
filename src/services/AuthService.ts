import axios, { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserType {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  country: string;
  age: number;
  userType: UserType;
  is_active: boolean;
  createdAt: string;
}

interface LoginResponse {
  success?: boolean;
  user: User;
  token: string;
}

const API_BASE_URL = (window as any).REACT_APP_USER_SERVICE_URL || 'http://localhost:5003';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {
  /**
   * Login user (admin or regular user)
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      if (!response?.data?.success) {
        throw new Error('Login failed');
      }
      const { data } = response.data;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Login failed');
      }
      throw new Error('An error occurred during login');
    }
  }

  /**
   * Admin login - validates admin privileges
   */
  async adminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    const loginResponse = await this.login(credentials);

    if (loginResponse.user.userType.name !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    return loginResponse;
  }

  /**
   * Register a new user
   */
  async register(userData: {
    fullName: string;
    email: string;
    country: string;
    age: number;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Registration failed');
      }
      throw new Error('An error occurred during registration');
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await apiClient.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch profile');
      }
      throw new Error('An error occurred while fetching profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: {
    fullName?: string;
    country?: string;
    age?: number;
  }): Promise<User> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await apiClient.put('/api/auth/profile', updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Failed to update profile');
      }
      throw new Error('An error occurred while updating profile');
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await apiClient.put(
        '/api/auth/change-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Failed to change password');
      }
      throw new Error('An error occurred while changing password');
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  /**
   * Save authentication data to sessionStorage
   */
  saveAuthData(token: string, user: User): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get token from sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
   * Get user from sessionStorage
   */
  getUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.userType?.name === 'admin';
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<boolean> {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const response = await apiClient.get('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
