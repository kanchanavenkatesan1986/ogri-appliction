import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read credentials from localStorage on bootstrap
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await API.post('/auth/login', { username, password });
      const { token, id, email, role } = response.data;
      
      const loggedUser = { id, username, email, role };
      
      setUser(loggedUser);
      setToken(token);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      const errMsg = error.response?.data?.message || "Invalid credentials. Please try again.";
      return { success: false, error: errMsg };
    }
  };

  const register = async (username, email, password, role = 'USER') => {
    try {
      await API.post('/auth/register', { username, email, password, role });
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      const errors = error.response?.data;
      let errMsg = "Registration failed.";
      if (errors) {
        if (typeof errors === 'object') {
          errMsg = Object.values(errors).join(', ');
        } else if (errors.message) {
          errMsg = errors.message;
        }
      }
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
