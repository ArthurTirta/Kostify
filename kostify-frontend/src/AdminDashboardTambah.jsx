import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboardTambah.css'; // File CSS terpisah

const API_BASE_URL = 'http://localhost:3000';

const AdminDashboardTambah = () => {
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState({
    name: '',
    price: '',
    description: '',
    status: 'available',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRoom(prev => ({ ...prev, image: file }));
      
      // Membuat preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!newRoom.name || !newRoom.price) {
      setError('Nama dan harga ruangan harus diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Membuat FormData untuk mengunggah file
      const formData = new FormData();
      formData.append('name', newRoom.name);
      formData.append('price', newRoom.price);
      formData.append('description', newRoom.description);
      formData.append('status', newRoom.status);
      if (newRoom.image) {
        formData.append('image', newRoom.image);
      }

      const response = await axios.post(`${API_BASE_URL}/rooms`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Ruangan berhasil ditambahkan!');
      navigate('/rooms'); // Redirect ke halaman daftar ruangan
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error adding room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room-container">
      <div className="add-room-header">
        <h1>Tambah Ruangan Baru</h1>
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Kembali
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-room-form">
        <div className="form-section">
          <div className="image-upload-section">
            <div className="image-preview">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="preview-image" />
              ) : (
                <div className="placeholder-image">
                  <span>Preview Gambar</span>
                </div>
              )}
            </div>
            <label className="upload-button">
              Pilih Gambar
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="name">Nama Ruangan*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
                placeholder="Contoh: Ruangan VIP"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Harga per Bulan*</label>
              <div className="price-input">
                <span className="currency">Rp</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newRoom.price}
                  onChange={handleInputChange}
                  placeholder="Contoh: 1000000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Deskripsi Fasilitas</label>
              <textarea
                id="description"
                name="description"
                value={newRoom.description}
                onChange={handleInputChange}
                placeholder="Deskripsikan fasilitas yang tersedia..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status Awal</label>
              <select
                id="status"
                name="status"
                value={newRoom.status}
                onChange={handleInputChange}
              >
                <option value="available">Tersedia</option>
                <option value="booked">Dipesan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Ruangan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboardTambah;