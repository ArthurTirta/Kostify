import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

const API_BASE_URL = 'http://localhost:3000';

function About() {
  const [aboutContent, setAboutContent] = useState({
    id: 1,
    title: 'Tentang Kostify',
    content: 'Kostify adalah aplikasi manajemen kost modern...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Jika user admin, redirect ke halaman admin about
    if (auth && auth.role === 'admin') {
      navigate('/admin-about');
      return;
    }
    
    fetchAboutContent();
  }, [auth, navigate]);
  
  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/about`);
      setAboutContent(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError('Error fetching content: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="about-content">
            <h1>{aboutContent.title}</h1>
            <div className="content-text">
              {aboutContent.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
        
        {auth && auth.role === 'penyewa' ? (
          <Link to="/user-dashboard" className="link-back">
            ⬅️ Kembali ke Dashboard
          </Link>
        ) : (
          // Tampilkan tombol kembali ke halaman utama hanya untuk pengunjung yang tidak login
          auth ? null : (
            <Link to="/" className="link-back">
              ⬅️ Kembali ke Halaman Utama
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default About;
