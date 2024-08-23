import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { queryClient } from '../App'; // Adjust the import path as needed

const AuthContext = createContext(null);

const TOKEN_KEY = 'authToken';
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const setAuthToken = (token, id, isAdmin) => {
  const expirationTime = new Date().getTime() + THIRTY_DAYS_IN_MS;
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expirationTime, id, isAdmin }));
};

export const getAuthToken = () => {
  const tokenData = JSON.parse(localStorage.getItem(TOKEN_KEY));
  if (tokenData && tokenData.expirationTime > new Date().getTime()) {
    return tokenData;
  }
  removeAuthToken(); // Clear expired token
  return null;
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [userId, setUserId] = useState(() => getAuthToken()?.id || null);
  const [isAdmin, setIsAdmin] = useState(() => getAuthToken()?.isAdmin || false);

  const checkAuth = useCallback(() => {
    const authToken = getAuthToken();
    if (authToken) {
      setIsAuthenticated(true);
      setUserId(authToken.id);
      setIsAdmin(authToken.isAdmin);
      queryClient.setQueryData("authToken", { ...authToken, isAuthenticated: true });
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      setIsAdmin(false);
      queryClient.setQueryData("authToken", { token: null, isAuthenticated: false, id: null, isAdmin: false });
    }
  }, []);

  const login = useCallback((token, id, isAdmin) => {
    setAuthToken(token, id, isAdmin);
    setIsAuthenticated(true);
    setUserId(id);
    setIsAdmin(isAdmin);
    queryClient.setQueryData("authToken", { token, isAuthenticated: true, id, isAdmin });
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUserId(null);
    setIsAdmin(false);
    queryClient.setQueryData("authToken", { token: null, isAuthenticated: false, id: null, isAdmin: false });
  }, []);

  useEffect(() => {
    checkAuth();
    const handleStorageChange = (e) => {
      if (e.key === TOKEN_KEY) {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  const value = {
    isAuthenticated,
    userId,
    isAdmin,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};