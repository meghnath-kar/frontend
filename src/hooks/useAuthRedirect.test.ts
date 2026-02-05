import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from './useAuthRedirect';
import AuthService from '../services/AuthService';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../services/AuthService', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(),
    isAdmin: jest.fn(),
  },
}));

describe('useAuthRedirect', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe('Authentication and Admin Status', () => {
    test('navigates to /admin/dashboard when user is authenticated and is admin', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('navigates to /search when user is authenticated but not admin', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/search');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('does not navigate when user is not authenticated', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('useEffect Dependency', () => {
    test('re-runs effect when navigate function changes', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHook(() => useAuthRedirect());

      expect(mockNavigate).toHaveBeenCalledTimes(1);

      rerender();

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('effect runs on mount', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined authentication state', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(undefined);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('handles null authentication state', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(null);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('handles false authentication state', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('handles undefined admin status when authenticated', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(undefined);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });

    test('handles null admin status when authenticated', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(null);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  describe('Navigation Flow', () => {
    test('calls isAuthenticated before isAdmin', () => {
      const callOrder: string[] = [];
      
      (AuthService.isAuthenticated as jest.Mock).mockImplementation(() => {
        callOrder.push('isAuthenticated');
        return true;
      });
      
      (AuthService.isAdmin as jest.Mock).mockImplementation(() => {
        callOrder.push('isAdmin');
        return true;
      });

      renderHook(() => useAuthRedirect());

      expect(callOrder).toEqual(['isAuthenticated', 'isAdmin']);
    });

    test('does not call isAdmin if not authenticated', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalled();
      expect(AuthService.isAdmin).not.toHaveBeenCalled();
    });

    test('navigates to correct route based on admin status', () => {
      // Test admin user
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      const { unmount } = renderHook(() => useAuthRedirect());

      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');

      unmount();
      jest.clearAllMocks();

      // Test regular user
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  describe('Multiple Renders', () => {
    test('handles multiple renders with same authentication state', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHook(() => useAuthRedirect());

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');

      // Rerender
      rerender();

      // Should still only be called once since navigate function hasn't changed
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('handles changing authentication state across rerenders', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHook(() => useAuthRedirect());

      expect(mockNavigate).not.toHaveBeenCalled();

      // Change auth state
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      rerender();

      // Navigate function is stable, so effect runs only once on mount
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Hook Return Value', () => {
    test('returns undefined', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAuthRedirect());

      expect(result.current).toBeUndefined();
    });
  });

  describe('Service Method Calls', () => {
    test('calls AuthService.isAuthenticated exactly once per render', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalledTimes(1);
    });

    test('calls AuthService.isAdmin exactly once when authenticated', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAdmin).toHaveBeenCalledTimes(1);
    });

    test('does not call AuthService methods with any arguments', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      renderHook(() => useAuthRedirect());

      expect(AuthService.isAuthenticated).toHaveBeenCalledWith();
      expect(AuthService.isAdmin).toHaveBeenCalledWith();
    });
  });
});
