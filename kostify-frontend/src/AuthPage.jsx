import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './AuthPage.css';

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Basic form validation
    if (!email || !password) {
      setErrorMessage("Email and Password are required!");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      setSuccessMessage(response.data.message);
      // You might want to redirect on successful login
      // navigate('/dashboard');
    } catch (error) {
      setErrorMessage(
        error.response 
          ? error.response.data.message 
          : "Network error. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please login to your account</p>
        </div>
        
        {errorMessage && <div className="message error-message">{errorMessage}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;