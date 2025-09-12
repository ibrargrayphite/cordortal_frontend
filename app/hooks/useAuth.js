import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens, isAuthenticated, logout } from '../utils/auth';
import { authAPI } from '../utils/api';
import { useToast } from '../components/Toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const router = useRouter();
  const { showError, showSuccess } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setAuthenticated(true);
        showSuccess('Already logged in! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/leads';
        }, 1000);
        return;
      }
      setAuthenticated(false);
      setInitialLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      
      // Add domain to the login payload
      const loginPayload = {
        ...credentials,
        domain: process.env.NEXT_PUBLIC_DOMAIN
      };
      
      const data = await authAPI.login(loginPayload);
      
      if (data.access && data.refresh) {
        setTokens(data.access, data.refresh);
        setAuthenticated(true);
        
        showSuccess('Login successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          window.location.replace('/leads');
        }, 1500);
      } else {
        showError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  // Logout function
  const handleLogout = useCallback(() => {
    logout();
    setAuthenticated(false);
    window.location.href = '/login';
  }, []);

  return {
    loading,
    authenticated,
    initialLoading,
    login,
    logout: handleLogout,
  };
}; 