import axios, { AxiosError } from 'axios';

const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  create: jest.fn(() => mockAxiosInstance),
  isAxiosError: jest.fn(),
}));

import AuthService from './AuthService';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  const mockUser = {
    _id: '123',
    fullName: 'John Doe',
    email: 'john@example.com',
    country: 'USA',
    age: 30,
    userType: {
      _id: 'type1',
      name: 'user',
    },
    is_active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    
    mockAxiosInstance.post = jest.fn();
    mockAxiosInstance.get = jest.fn();
    mockAxiosInstance.put = jest.fn();
    mockAxiosInstance.delete = jest.fn();

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });

    it('should throw error with server message on axios error', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      } as AxiosError<{ message: string }>;

      mockAxiosInstance.post.mockRejectedValue(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(AuthService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should throw generic error when axios error has no message', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          data: {},
        },
      } as AxiosError<{ message: string }>;

      mockAxiosInstance.post.mockRejectedValue(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(AuthService.login(credentials)).rejects.toThrow('Login failed');
    });

    it('should throw generic error on non-axios error', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(AuthService.login(credentials)).rejects.toThrow('An error occurred during login');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        country: 'USA',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register(userData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });

    it('should throw error with server message on axios error', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        country: 'USA',
        password: 'password123',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: 'Email already exists',
          },
        },
      } as AxiosError<{ message: string }>;

      mockAxiosInstance.post.mockRejectedValue(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(AuthService.register(userData)).rejects.toThrow('Email already exists');
    });

    it('should throw generic error when axios error has no message', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        country: 'USA',
        password: 'password123',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          data: {},
        },
      } as AxiosError<{ message: string }>;

      mockAxiosInstance.post.mockRejectedValue(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(AuthService.register(userData)).rejects.toThrow('Registration failed');
    });

    it('should throw generic error on non-axios error', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        country: 'USA',
        password: 'password123',
      };

      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(AuthService.register(userData)).rejects.toThrow('An error occurred during registration');
    });
  });

  describe('logout', () => {
    it('should remove token and user from sessionStorage', () => {
      sessionStorage.setItem('token', mockToken);
      sessionStorage.setItem('user', JSON.stringify(mockUser));

      AuthService.logout();

      expect(sessionStorage.getItem('token')).toBeNull();
      expect(sessionStorage.getItem('user')).toBeNull();
    });

    it('should not throw error when sessionStorage is already empty', () => {
      expect(() => AuthService.logout()).not.toThrow();
    });
  });

  describe('saveAuthData', () => {
    it('should save token and user to sessionStorage', () => {
      AuthService.saveAuthData(mockToken, mockUser);

      expect(sessionStorage.getItem('token')).toBe(mockToken);
      expect(sessionStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('should overwrite existing token and user data', () => {
      sessionStorage.setItem('token', 'old-token');
      sessionStorage.setItem('user', JSON.stringify({ ...mockUser, fullName: 'Old Name' }));

      AuthService.saveAuthData(mockToken, mockUser);

      expect(sessionStorage.getItem('token')).toBe(mockToken);
      expect(sessionStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });
  });

  describe('getToken', () => {
    it('should return token from sessionStorage', () => {
      sessionStorage.setItem('token', mockToken);

      const token = AuthService.getToken();

      expect(token).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      const token = AuthService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return parsed user object from sessionStorage', () => {
      sessionStorage.setItem('user', JSON.stringify(mockUser));

      const user = AuthService.getUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null when no user exists', () => {
      const user = AuthService.getUser();

      expect(user).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      sessionStorage.setItem('user', 'invalid-json');

      expect(() => AuthService.getUser()).toThrow();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      sessionStorage.setItem('token', mockToken);

      const isAuthenticated = AuthService.isAuthenticated();

      expect(isAuthenticated).toBe(true);
    });

    it('should return false when token does not exist', () => {
      const isAuthenticated = AuthService.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });

    it('should return false when token is empty string', () => {
      sessionStorage.setItem('token', '');

      const isAuthenticated = AuthService.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', () => {
      const adminUser = {
        ...mockUser,
        userType: {
          _id: 'admin1',
          name: 'admin',
        },
      };
      sessionStorage.setItem('user', JSON.stringify(adminUser));

      const isAdmin = AuthService.isAdmin();

      expect(isAdmin).toBe(true);
    });

    it('should return false when user is not admin', () => {
      sessionStorage.setItem('user', JSON.stringify(mockUser));

      const isAdmin = AuthService.isAdmin();

      expect(isAdmin).toBe(false);
    });

    it('should return false when no user exists', () => {
      const isAdmin = AuthService.isAdmin();

      expect(isAdmin).toBe(false);
    });

    it('should return false when user has no userType', () => {
      const userWithoutType = { ...mockUser, userType: null as any };
      sessionStorage.setItem('user', JSON.stringify(userWithoutType));

      const isAdmin = AuthService.isAdmin();

      expect(isAdmin).toBe(false);
    });

    it('should return false when userType has no name', () => {
      const userWithoutTypeName = {
        ...mockUser,
        userType: { _id: 'type1', name: '' } as any,
      };
      sessionStorage.setItem('user', JSON.stringify(userWithoutTypeName));

      const isAdmin = AuthService.isAdmin();

      expect(isAdmin).toBe(false);
    });
  });
});
