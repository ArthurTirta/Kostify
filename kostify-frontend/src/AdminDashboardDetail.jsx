import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboardDetail.css';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this to your backend URL

const AdminDashboardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    price: 0,
    contact: '0812-5624-5862', // Default contact as per your design
    facilities: '',
    status: 'available',
    image: 'room-image.jpg' // Default image
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch room data when component mounts
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/rooms/${id}`);
        setRoomData({
          ...response.data,
          // Map database fields to your component's expected structure
          facilities: response.data.description, // Assuming description contains facilities
          contact: '0812-5624-5862' // Default contact
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API (only send fields that exist in your database)
      const updateData = {
        name: roomData.name,
        price: roomData.price,
        description: roomData.facilities, // Assuming facilities go to description
        status: roomData.status
      };

      const response = await axios.put(`${API_BASE_URL}/rooms/${id}`, updateData);
      setRoomData({
        ...response.data,
        facilities: response.data.description,
        contact: '0812-5624-5862'
      });
      setIsEditing(false);
    } catch (err) {
      alert('Gagal menyimpan perubahan: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
      try {
        await axios.delete(`${API_BASE_URL}/rooms/${id}`);
        navigate('/admin-dashboard'); // Redirect to rooms list after deletion
      } catch (err) {
        alert('Gagal menghapus ruangan: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRoomData(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookRoom = async () => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/rooms/${id}/book`);
      setRoomData(prev => ({ ...prev, status: 'booked' }));
      alert('Ruangan berhasil dipesan!');
    } catch (err) {
      alert('Gagal memesan ruangan: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="loading">Memuat data ruangan...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-room-container">
      <div className="admin-header">
        <h1>Admin Panel - Manajemen Ruangan</h1>
        <div className="admin-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Simpan Perubahan</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Batal</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Ruangan</button>
          )}
          <button className="delete-btn" onClick={handleDelete}>Hapus Ruangan</button>
        </div>
      </div>

      <div className="room-content">
        <div className="image-section">
          <img 
            src={roomData.image} 
            alt="Room" 
            className="room-image"
          />
          {isEditing && (
            <div className="image-upload">
              <label htmlFor="room-image-upload">Ganti Gambar:</label>
              <input 
                id="room-image-upload"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        <div className="details-section">
          {isEditing ? (
            <>
              <div className="form-group">
                <label>Nama Ruangan:</label>
                <input
                  type="text"
                  name="name"
                  value={roomData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Deskripsi:</label>
                <textarea
                  name="description"
                  value={roomData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Fasilitas:</label>
                <textarea
                  name="facilities"
                  value={roomData.facilities}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Harga (per bulan):</label>
                <input
                  type="number"
                  name="price"
                  value={roomData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={roomData.status}
                  onChange={handleInputChange}
                >
                  <option value="available">Tersedia</option>
                  <option value="booked">Dipesan</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <h2>{roomData.name}</h2>
              <p className="description">{roomData.description}</p>
              
              <div className="facilities">
                <h3>Fasilitas</h3>
                <p>{roomData.facilities}</p>
              </div>
              
              <div className="booking-info">
                <h3>Informasi Pemesanan</h3>
                <p className="price">Rp. {parseInt(roomData.price).toLocaleString()}/bulan</p>
                <p>Kontak: {roomData.contact}</p>
                <p>Status: {roomData.status === 'available' ? 'Tersedia' : 'Dipesan'}</p>
                <button 
                  className="book-btn"
                  onClick={handleBookRoom}
                  disabled={roomData.status !== 'available'}
                >
                  {roomData.status === 'available' ? 'Pesan Ruangan' : 'Sudah Dipesan'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardDetail;