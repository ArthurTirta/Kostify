import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './index.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newNama, setNewNama] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usersApi = 'http://localhost:3000/users';
  const roomsApi = 'http://localhost:3000/rooms';

  // GET Users
  const fetchUsers = () => {
    axios.get(usersApi)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  // GET Rooms
  const fetchRooms = () => {
    setLoading(true);
    axios.get(roomsApi)
      .then(res => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setError('Error saat memuat ruangan');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  // POST
  const handleAddUser = () => {
    if (!newNama.trim()) return;
    axios.post(usersApi, { nama: newNama })
      .then(() => {
        setNewNama('');
        fetchUsers();
      });
  };

  // DELETE
  const handleDelete = (id) => {
    axios.delete(`${usersApi}/${id}`).then(() => fetchUsers());
  };

  // PUT
  const handleUpdate = () => {
    axios.put(`${usersApi}/${editId}`, { nama: editNama })
      .then(() => {
        setEditId(null);
        setEditNama('');
        fetchUsers();
      });
  };

  // Render la tarjeta de habitación
  const renderRoomCard = (room) => (
    <div className="card" key={room.id}>
      <img 
        src={room.image_url || "https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D"}
        alt={room.name} 
      />
      <div className="card-content">
        <div className="card-title">{room.name}</div>
        <div className="card-price">Rp {room.price.toLocaleString()}</div>
        <div className={`card-status ${room.status}`}>{room.status === 'available' ? 'Available' : 'Booked'}</div>
        <div className="card-description">{room.description}</div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Sidebar */}
      <div className="sidebar">
     
        <div className="button-container">
        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>
        <Link to="/feedback">
          <button>Feedback</button>
        </Link>
        <Link to="/laporan">
          <button>Laporan Keuangan</button>
        </Link>
        <Link to="/about">
          <button>About Us</button>
        </Link>
        </div>

      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Selamat Datang di Sistem Informasi Kami</h1>
        <p>Solusi terintegrasi untuk manajemen ruangan dan keuangan</p>

        <div className="card-container">
          {loading ? (
            <p>Memuat ruangan...</p>
          ) : error ? (
            <p>{error}</p>
          ) : rooms.length === 0 ? (
            <p>Tidak ada ruangan tersedia</p>
          ) : (
            rooms.map(room => renderRoomCard(room))
          )}
        </div>

        <Link to="/" className="link-back">
          ⬅️ Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
