import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const isAdmin = AuthService.isAdmin();
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/search');
      }
    }
  }, [navigate]);
};

export default useAuthRedirect;
