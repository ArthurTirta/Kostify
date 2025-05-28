import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

function LaporanKeuanganEdit() {
  const { id } = useParams();
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    bulan: '',
    tahun: currentYear,
    tanggal: '',
    status: '',
    bukti_foto: null,
    user_id: '',
    room_id: ''
  });
  
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  
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

  // Fetch financial report data
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/finance/${id}`);
        
        if (response.status === 200) {
          const reportData = response.data;
          
          // Format date for input element (YYYY-MM-DD)
          const dateObj = new Date(reportData.tanggal);
          const formattedDate = dateObj.toISOString().split('T')[0];
          
          setFormData({
            bulan: reportData.bulan || 'Januari',
            // Ensure tahun is stored as a number
            tahun: parseInt(reportData.tahun, 10) || currentYear,
            tanggal: formattedDate,
            status: reportData.status,
            bukti_foto: null, // Will be set through file input if user uploads a new image
            user_id: reportData.user_id || '',
            room_id: reportData.room_id || ''
          });
          
          // Set current image if available
          if (reportData.bukti_foto) {
            setCurrentImage(`http://localhost:3000${reportData.bukti_foto}`);
          }
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching financial report:', err);
        setError(err.message || 'Error fetching financial report');
      } finally {
        setLoading(false);
      }
    };

    if (auth && auth.role === 'admin' && id) {
      fetchReport();
    }
  }, [auth, id, currentYear]);

  // Fetch users and rooms for dropdowns
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No auth token found');
          return;
        }
        
        const response = await axios.get('http://localhost:3000/auth/dropdown-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await axios.get('http://localhost:3000/rooms');
        if (response.status === 200) {
          setRooms(response.data);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoadingRooms(false);
      }
    };

    if (auth && auth.role === 'admin') {
      fetchUsers();
      fetchRooms();
    }
  }, [auth]);

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
    setSubmitLoading(true);
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
      submitData.append('user_id', formData.user_id);
      submitData.append('room_id', formData.room_id);
      
      if (formData.bukti_foto) {
        submitData.append('bukti_foto', formData.bukti_foto);
      }
      
      // For debugging
      console.log('Submitting data with tahun:', yearValue);
      
      const response = await axios.put(`http://localhost:3000/finance/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        alert('Laporan keuangan berhasil diperbarui');
        navigate('/laporan-keuangan');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error updating financial report:', err);
      setError(err.message || 'Error updating financial report');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!auth || auth.role !== 'admin') {
    return null; // This will be handled by the redirect in useEffect
  }

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="content">
          <div className="admin-container">
            <h2>Edit Laporan Keuangan</h2>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content">
        <div className="admin-container">
          <h2>Edit Laporan Keuangan</h2>
          
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
              <label htmlFor="user_id">Nama Penyewa</label>
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Penyewa</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              {loadingUsers && <small>Loading users...</small>}
            </div>
            
            <div className="form-group">
              <label htmlFor="room_id">Ruangan</label>
              <select
                id="room_id"
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Ruangan</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
              {loadingRooms && <small>Loading rooms...</small>}
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
              
              {previewUrl ? (
                <div className="image-preview">
                  <p>New Image Preview:</p>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              ) : currentImage && (
                <div className="image-preview">
                  <p>Current Image:</p>
                  <img 
                    src={currentImage} 
                    alt="Current Bukti" 
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
                disabled={submitLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={submitLoading}
              >
                {submitLoading ? 'Menyimpan...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LaporanKeuanganEdit;