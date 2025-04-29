import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:3000';

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    price: '',
    description: '',
    status: 'available'
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
  
  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.price) {
      alert('Nama ruangan dan harga harus diisi!');
      return;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/rooms`, newRoom);
      setRooms([...rooms, response.data]);
      setNewRoom({
        name: '',
        price: '',
        description: '',
        status: 'available'
      });
      setShowAddForm(false);
    } catch (err) {
      alert('Error adding room: ' + (err.response?.data?.error || err.message));
      console.error('Error adding room:', err);
    }
  };
  
  const handleEditClick = (room) => {
    setCurrentRoom(room);
    setShowEditForm(true);
  };
  
  const handleEditRoom = async () => {
    if (!currentRoom.name || !currentRoom.price) {
      alert('Nama ruangan dan harga harus diisi!');
      return;
    }
    
    try {
      const response = await axios.put(`${API_BASE_URL}/rooms/${currentRoom.id}`, currentRoom);
      setRooms(rooms.map(room => 
        room.id === currentRoom.id ? response.data : room
      ));
      setShowEditForm(false);
      setCurrentRoom(null);
    } catch (err) {
      alert('Error updating room: ' + (err.response?.data?.error || err.message));
      console.error('Error updating room:', err);
    }
  };
  
  const handleDeleteRoom = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
      try {
        await axios.delete(`${API_BASE_URL}/rooms/${id}`);
        setRooms(rooms.filter(room => room.id !== id));
      } catch (err) {
        alert('Error deleting room: ' + (err.response?.data?.error || err.message));
        console.error('Error deleting room:', err);
      }
    }
  };
  
  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    navigate('/AuthPage');
  };
  
  return (
    <div className="page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <div className="button-container">
          <button onClick={() => setShowAddForm(true)}>+ Tambah Ruangan</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Dashboard Admin</h1>
        <p>Kelola ruangan dan lihat status pemesanan</p>

        {error && <div className="error-message">{error}</div>}

        {/* Add Room Form */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Tambah Ruangan Baru</h2>
              <div className="form-group">
                <label>Nama Ruangan:</label>
                <input 
                  type="text" 
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Harga (per bulan):</label>
                <input 
                  type="number" 
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Deskripsi:</label>
                <textarea 
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select 
                  value={newRoom.status}
                  onChange={(e) => setNewRoom({...newRoom, status: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleAddRoom}>Simpan</button>
                <button onClick={() => setShowAddForm(false)} className="cancel">Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Room Form */}
        {showEditForm && currentRoom && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Ruangan</h2>
              <div className="form-group">
                <label>Nama Ruangan:</label>
                <input 
                  type="text" 
                  value={currentRoom.name}
                  onChange={(e) => setCurrentRoom({...currentRoom, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Harga (per bulan):</label>
                <input 
                  type="number" 
                  value={currentRoom.price}
                  onChange={(e) => setCurrentRoom({...currentRoom, price: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Deskripsi:</label>
                <textarea 
                  value={currentRoom.description}
                  onChange={(e) => setCurrentRoom({...currentRoom, description: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select 
                  value={currentRoom.status}
                  onChange={(e) => setCurrentRoom({...currentRoom, status: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleEditRoom}>Simpan</button>
                <button onClick={() => setShowEditForm(false)} className="cancel">Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* Room List */}
        <div className="admin-room-list">
          <h2>Daftar Ruangan</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Ruangan</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center'}}>Tidak ada data ruangan</td>
                  </tr>
                ) : (
                  rooms.map(room => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td>{room.name}</td>
                      <td>Rp {parseInt(room.price).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${room.status}`}>
                          {room.status === 'available' ? 'Tersedia' : 'Terpesan'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(room)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteRoom(room.id)} className="delete-btn">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <Link to="/" className="link-back">
          ⬅️ Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard; 