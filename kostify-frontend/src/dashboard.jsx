import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="#">Dashboard</Link></li>
        </ul>

        <div className="button-container">
          <button>Feedback</button>
          <button>Laporan Keuangan</button>
          <button>About Us</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Dashboard - Data Users</h1>

        <div>
          <input
            type="text"
            value={newNama}
            onChange={(e) => setNewNama(e.target.value)}
            placeholder="Nama baru"
          />
          <button onClick={handleAddUser}>Tambah User</button>
        </div>

        <div className="card-container">
          <div className="card">
            <img src="room1.jpg" alt="Room 1" />
            <div className="card-content">
              <div className="card-title">Ruangan 1</div>
              <div className="card-status available">Available</div>
            </div>
          </div>

          <div className="card">
            <img src="room2.jpg" alt="Room 2" />
            <div className="card-content">
              <div className="card-title">Ruangan 2</div>
              <div className="card-status booked">Booked</div>
            </div>
          </div>

          <div className="card">
            <img src="room3.jpg" alt="Room 3" />
            <div className="card-content">
              <div className="card-title">Ruangan 3</div>
              <div className="card-status available">Available</div>
            </div>
          </div>

          <div className="card">
            <img src="room4.jpg" alt="Room 4" />
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
