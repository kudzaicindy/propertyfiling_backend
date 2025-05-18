import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'property_manager' | 'finance' | 'ceo' | 'assistant';
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { token, user } = JSON.parse(storedAuth);
      
      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid token');
      }

      setAuthState({
        user: data.data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('auth');
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data.success || !data.data?.token) {
        throw new Error('Invalid login response');
      }

      const { token, user } = data.data;

      // Store auth data
      localStorage.setItem('auth', JSON.stringify({ token, user }));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return data;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!authState.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authState.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      logout();
      throw new Error('Session expired');
    }

    return response;
  };

  // Role-based access control helpers
  const hasRole = (role: User['role']) => {
    return authState.user?.role === role;
  };

  const isPropertyManager = () => {
    return hasRole('property_manager');
  };

  return {
    ...authState,
    login,
    logout,
    fetchWithAuth,
    hasRole,
    isPropertyManager
  };
}; 