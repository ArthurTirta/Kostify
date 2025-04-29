import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './AuthPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("penyewa");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Basic form validation
    if (!username || !password || !confirmPassword) {
      setErrorMessage("Semua field harus diisi!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password tidak cocok!");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        password,
        role
      });
      setSuccessMessage(response.data.message);
      // Reset form after successful registration
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        error.response 
          ? error.response.data.message || error.response.data.error
          : "Network error. Silakan coba lagi nanti."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Buat Akun</h2>
          <p>Daftar untuk mengakses layanan kami</p>
        </div>
        
        {errorMessage && <div className="message error-message">{errorMessage}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username Anda"
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
              placeholder="Masukkan password Anda"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password Anda"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Peran</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="penyewa">Penyewa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>

          <div className="auth-footer">
            <p>Sudah memiliki akun? <Link to="/Authpage">Masuk</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 