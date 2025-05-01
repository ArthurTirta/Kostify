import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

const API_BASE_URL = 'http://localhost:3000';

function AdminAbout() {
  const [aboutContent, setAboutContent] = useState({
    id: 1,
    title: 'Tentang Kostify',
    content: 'Kostify adalah aplikasi manajemen kost modern...'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Cek jika user bukan admin, redirect ke halaman about umum
    if (!auth || auth.role !== 'admin') {
      navigate('/about');
      return;
    }
    
    fetchAboutContent();
  }, [auth, navigate]);
  
  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/about`);
      setAboutContent(response.data);
      setEditContent({
        title: response.data.title,
        content: response.data.content
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError('Error fetching content: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateContent = async (e) => {
    e.preventDefault();
    
    // Cek apakah pengguna masih admin
    if (!auth || auth.role !== 'admin') {
      alert('Anda tidak memiliki akses untuk mengedit konten ini');
      navigate('/about');
      return;
    }
    
    // Cek apakah pengguna memiliki token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/AuthPage');
      return;
    }
    
    try {
      await axios.put(
        `${API_BASE_URL}/about/${aboutContent.id}`, 
        editContent, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setAboutContent({
        ...aboutContent,
        title: editContent.title,
        content: editContent.content
      });
      setIsEditing(false);
      alert('Konten berhasil diperbarui!');
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Anda tidak memiliki akses untuk mengedit konten ini. Hanya admin yang bisa melakukan edit.');
        navigate('/about');
      } else {
        alert('Error updating content: ' + (err.response?.data?.error || err.message));
      }
      console.error('Error updating content:', err);
    }
  };
  
  return (
    <div className="page-container">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="main-content">
        <h1>Kelola Halaman About Us</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : isEditing ? (
          <div className="edit-about-container">
            <h2>Edit Konten About Us</h2>
            <form onSubmit={handleUpdateContent}>
              <div className="form-group">
                <label>Judul:</label>
                <input 
                  type="text" 
                  value={editContent.title}
                  onChange={(e) => setEditContent({...editContent, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Konten:</label>
                <textarea 
                  rows="10"
                  value={editContent.content}
                  onChange={(e) => setEditContent({...editContent, content: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="edit-actions">
                <button type="submit">Simpan Perubahan</button>
                <button type="button" onClick={() => setIsEditing(false)}>Batal</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="about-content">
            <div className="content-preview">
              <h2>Pratinjau Konten:</h2>
              <div className="preview-container">
                <h3>{aboutContent.title}</h3>
                <div className="content-text">
                  {aboutContent.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            <button 
              className="edit-content-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Konten
            </button>
          </div>
        )}
        
        <Link to="/admin-dashboard" className="link-back">
          ⬅️ Kembali ke Dashboard Admin
        </Link>
      </div>
    </div>
  );
}

export default AdminAbout; 