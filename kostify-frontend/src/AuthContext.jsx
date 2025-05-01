import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // User authentication state

  // Check if the token is in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, fetch user data to validate token
      axios.get('http://localhost:3000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAuth(response.data.user); // Store user data in auth state
      })
      .catch(() => {
        localStorage.removeItem('token'); // If token is invalid, remove it
        setAuth(null);
      });
    }
  }, []);

  // Login function to authenticate user
  const login = useCallback((username, password, callback) => {
    axios.post('http://localhost:3000/auth/login', { username, password })
      .then((response) => {
        const { token, user } = response.data;
        localStorage.setItem('token', token); // Store token in localStorage
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
        setAuth(user); // Set user data in context
        if (callback) callback(true, user); // Call callback function with success status and user data
      })
      .catch((error) => {
        console.error('Login failed:', error);
        if (callback) callback(false, error); // Call callback function with error
      });
  }, []);

  // Logout function
  const logout = useCallback((callback) => {
    localStorage.removeItem('token');
    setAuth(null);
    if (callback) callback(); // Call callback function after logout
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
