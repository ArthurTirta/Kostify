import React, { useState } from "react";
import axios from "axios";
import './AuthPage.css'; 

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setErrorMessage("Email and Password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : "Something went wrong.");
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
          />
        </div>

        <button type="submit" className="submit-button">Login</button>
      </form>
    </div>
  );
};

export default AuthPage;
