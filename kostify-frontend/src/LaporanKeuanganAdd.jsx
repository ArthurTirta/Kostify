import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

function LaporanKeuanganAdd() {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    bulan: 'Januari',
    tahun: currentYear,
    tanggal: '',
    status: 'Belum Lunas',
    bukti_foto: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Array bulan untuk dropdown
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Generate array tahun untuk dropdown (5 tahun ke belakang dan 5 tahun ke depan)
  const generateYearOptions = () => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const years = generateYearOptions();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!auth) {
      navigate('/AuthPage');
    } else if (auth.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Ensure tahun is treated as a number
    if (name === 'tahun') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bukti_foto: file
      }));
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append('bulan', formData.bulan);
      
      // Explicitly convert tahun to a number before appending to FormData
      const yearValue = parseInt(formData.tahun, 10);
      submitData.append('tahun', yearValue);
      
      submitData.append('tanggal', formData.tanggal);
      submitData.append('status', formData.status);
      
      if (formData.bukti_foto) {
        submitData.append('bukti_foto', formData.bukti_foto);
      }
      
      // For debugging
      console.log('Submitting data with tahun:', yearValue);
      
      const response = await axios.post('http://localhost:3000/finance', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        alert('Laporan keuangan berhasil ditambahkan');
        navigate('/laporan-keuangan');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error creating financial report:', err);
      setError(err.message || 'Error creating financial report');
    } finally {
      setLoading(false);
    }
  };

  if (!auth || auth.role !== 'admin') {
    return null; // This will be handled by the redirect in useEffect
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content">
        <div className="admin-container">
          <h2>Tambah Laporan Keuangan</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label htmlFor="bulan">Bulan</label>
              <select
                id="bulan"
                name="bulan"
                value={formData.bulan}
                onChange={handleChange}
                required
              >
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="tahun">Tahun</label>
              <select
                id="tahun"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="tanggal">Tanggal</label>
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="bukti_foto">Bukti</label>
              <input
                type="file"
                id="bukti_foto"
                name="bukti_foto"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {previewUrl && (
                <div className="image-preview">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/laporan-keuangan')}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LaporanKeuanganAdd;