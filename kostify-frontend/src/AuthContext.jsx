import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); 
  const history = useHistory();

  // Check if the token is in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, fetch user data to validate token
      axios.get('http://localhost:3000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAuth(response.data); // Store user data in auth state
      })
      .catch(() => {
        localStorage.removeItem('token'); // If token is invalid, remove it
      });
    }
  }, []);

  // Login function to authenticate user
  const login = (username, password) => {
    axios.post('http://localhost:3000/login', { username, password })
      .then((response) => {
        const { token, user } = response.data;
        localStorage.setItem('token', token); // Store token in localStorage
        setAuth(user); // Set user data in context
        history.push('/dashboard'); // Redirect to the dashboard after login
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    history.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
