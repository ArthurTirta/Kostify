import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = 'http://localhost:3000';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/rooms`);
        setRooms(response.data);
      } catch (err) {
        setError('Gagal memuat data ruangan: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="dashboard-admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Menu</h2>
        </div>
        <div className="sidebar-menu">
          <Link to="/admin-dashboard" className="sidebar-link active">
            <i className="icon">📊</i> Dashboard

          </Link>
          <Link to="/about-us" className="sidebar-link">
            <i className="icon">ℹ️</i> About Us
          </Link>
          <Link to="/admindashboardtambah" className="sidebar-link">
            <i className="icon">➕</i> Tambah Ruangan
          </Link>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn">
            <i className="icon">🚪</i> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>Dashboard</h1>
          <p>Kelola ruangan dan lihat status pemesanan</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-cards">
          {loading ? (
            <div className="loading">Memuat data ruangan...</div>
          ) : (
            rooms.map(room => (
              <div key={room.id} className="room-card-admin">
                <div className="card-header">
                  <h3>{room.name}</h3>
                  <span className={`status-badge ${room.status}`}>
                    {room.status === 'available' ? 'Available' : 'Booked'}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-price">Rp {room.price.toLocaleString()}/bulan</p>
                  <p className="card-facilities">
                    {room.facilities?.split(',').slice(0, 3).join(', ')}...
                  </p>
                </div>
                <div className="card-footer">
                 <button 
                    className="edit-btn"
                    onClick={() => navigate(`/AdminDashboardDetail/${room.id}`)}
                    // navigate(`/AdminDashboardDetail/${room.id}`)}
                  >
                    Telusuri
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;