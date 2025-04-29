import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './index.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [newNama, setNewNama] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState('');

  const api = 'http://localhost:3000/users';

  // GET
  const fetchUsers = () => {
    axios.get(api)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // POST
  const handleAddUser = () => {
    if (!newNama.trim()) return;
    axios.post(api, { nama: newNama })
      .then(() => {
        setNewNama('');
        fetchUsers();
      });
  };

  // DELETE
  const handleDelete = (id) => {
    axios.delete(`${api}/${id}`).then(() => fetchUsers());
  };

  // PUT
  const handleUpdate = () => {
    axios.put(`${api}/${editId}`, { nama: editNama })
      .then(() => {
        setEditId(null);
        setEditNama('');
        fetchUsers();
      });
  };

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
          <div className="card">
          <Link to="/cardroomadmin">
          
            <img 
              src="https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Room 1" 
              />
            <div className="card-content">
              <div className="card-title">Ruangan 1</div>
              <div className="card-status available">Available</div>
            </div>
              </Link>
          </div>

          <div className="card">
            <img 
              src="https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Room 2" 
            />
            <div className="card-content">
              <div className="card-title">Ruangan 2</div>
              <div className="card-status booked">Booked</div>
            </div>
          </div>

          <div className="card">
            <img 
              src="https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Room 3" 
            />
            <div className="card-content">
              <div className="card-title">Ruangan 3</div>
              <div className="card-status available">Available</div>
            </div>
          </div>

          <div className="card">
            <img 
              src="https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Room 4" 
            />
            <div className="card-content">
              <div className="card-title">Ruangan 4</div>
              <div className="card-status available">Available</div>
            </div>
          </div>
        </div>

        <Link to="/" className="link-back">
          ⬅️ Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
