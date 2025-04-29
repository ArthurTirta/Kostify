import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:3000';

function UserDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    duration: 1,
    name: '',
    phone: ''
  });
  
  const navigate = useNavigate();

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms from:', `${API_BASE_URL}/rooms`);
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      console.log('Response:', response.data);
      setRooms(response.data);
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError('Error fetching rooms: ' + (err.response?.data?.error || err.message));
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };
  
  const handleBookRoom = () => {
    if (selectedRoom) {
      setShowRoomDetails(false);
      setShowBookingForm(true);
    }
  };
  
  const handleBookingSubmit = async () => {
    // Validate form
    if (!bookingData.name || !bookingData.phone || !bookingData.startDate) {
      alert('Semua field harus diisi!');
      return;
    }
    
    try {
      // Update room status to booked
      const response = await axios.patch(`${API_BASE_URL}/rooms/${selectedRoom.id}/book`);
      
      // Update local state
      setRooms(rooms.map(room => 
        room.id === selectedRoom.id ? response.data.room : room
      ));
      
      setShowBookingForm(false);
      
      // Show success message
      alert(`Pemesanan ${selectedRoom.name} berhasil dilakukan!`);
      
      // Reset booking data
      setBookingData({
        startDate: '',
        duration: 1,
        name: '',
        phone: ''
      });
      
      setSelectedRoom(null);
    } catch (err) {
      alert('Error booking room: ' + (err.response?.data?.error || err.message));
      console.error('Error booking room:', err);
    }
  };
  
  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    navigate('/AuthPage');
  };
  
  // Placeholder image for rooms without images
  const defaultRoomImage = 'https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D';
  
  return (
    <div className="page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Menu Pengguna</h3>
        <div className="button-container">
          <button>Ruangan Tersedia</button>
          <button>Pemesanan Saya</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Dashboard Penyewa</h1>
        <p>Lihat dan pesan ruangan yang tersedia</p>

        {error && <div className="error-message">{error}</div>}

        {/* Room Details Modal */}
        {showRoomDetails && selectedRoom && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{selectedRoom.name}</h2>
              <img 
                src={selectedRoom.image || defaultRoomImage} 
                alt={selectedRoom.name} 
                className="room-detail-image"
              />
              <div className="room-details">
                <p><strong>Harga:</strong> Rp {parseInt(selectedRoom.price).toLocaleString()} / bulan</p>
                <p><strong>Status:</strong> {selectedRoom.status === 'available' ? 'Tersedia' : 'Terpesan'}</p>
                <p><strong>Deskripsi:</strong> {selectedRoom.description}</p>
              </div>
              <div className="modal-actions">
                {selectedRoom.status === 'available' && (
                  <button onClick={handleBookRoom}>Pesan Sekarang</button>
                )}
                <button onClick={() => setShowRoomDetails(false)} className="cancel">Tutup</button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedRoom && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Formulir Pemesanan - {selectedRoom.name}</h2>
              <div className="form-group">
                <label>Nama Lengkap:</label>
                <input 
                  type="text" 
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nomor Telepon:</label>
                <input 
                  type="text" 
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tanggal Mulai Sewa:</label>
                <input 
                  type="date" 
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Durasi Sewa (bulan):</label>
                <select 
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 6, 12].map((month) => (
                    <option key={month} value={month}>{month} Bulan</option>
                  ))}
                </select>
              </div>
              <div className="price-summary">
                <p>Total Biaya: Rp {(parseInt(selectedRoom.price) * bookingData.duration).toLocaleString()}</p>
              </div>
              <div className="modal-actions">
                <button onClick={handleBookingSubmit}>Konfirmasi Pemesanan</button>
                <button onClick={() => setShowBookingForm(false)} className="cancel">Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* Room List */}
        <div className="card-container">
          {loading ? (
            <p>Loading...</p>
          ) : rooms.length === 0 ? (
            <p>Tidak ada data ruangan tersedia</p>
          ) : (
            rooms.map(room => (
              <div className="card" key={room.id}>
                <img 
                  src={room.image || defaultRoomImage}
                  alt={room.name} 
                />
                <div className="card-content">
                  <div className="card-title">{room.name}</div>
                  <div className="card-price">Rp {parseInt(room.price).toLocaleString()} / bulan</div>
                  <div className={`card-status ${room.status}`}>
                    {room.status === 'available' ? 'Tersedia' : 'Terpesan'}
                  </div>
                  <button 
                    onClick={() => handleViewDetails(room)}
                    className="view-details-btn"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Link to="/" className="link-back">
          ⬅️ Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}

export default UserDashboard; 