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

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('Attempting login with credentials:', credentials);
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      console.log('Login response:', response);
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
      console.log('Unexpected error during login:', error);
      throw new Error('An error occurred during login');
    }
  }

  async register(userData: {
    fullName: string;
    email: string;
    country: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      if (!response?.data?.success) {
        throw new Error('Registration failed');
      }
      const { data } = response.data;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Registration failed');
      }
      throw new Error('An error occurred during registration');
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  saveAuthData(token: string, user: User): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.userType?.name === 'admin';
  }
}

export default new AuthService();
