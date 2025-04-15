
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      logout();
      throw new Error('No refresh token');
    }
    
    try {
      const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
      localStorage.setItem('access_token', res.data.access);
      setIsAuthenticated(true);
      return res.data.access;
    } catch (err) {
      logout();
      throw err;
    }
  }, [logout]);

  const verifyToken = useCallback(async (token) => {
    try {
      await axios.post('http://localhost:8000/api/token/verify/', { token });
      setIsAuthenticated(true);
    } catch (err) {
      try {
        await refreshToken();
      } catch (refreshErr) {
        logout();
      }
    }
  }, [refreshToken, logout]);

  const login = useCallback(async (username, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });
      
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setUser({ username });
      setIsAuthenticated(true);
      navigate('/');
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      logout();
      return false;
    }
  }, [navigate, logout]);

  // Initialize auth state on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);

  // Add axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, logout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login, 
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};