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

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li key={user.id} style={{ margin: '10px 0' }}>
            {editId === user.id ? (
              <>
                <input
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                />
                <button onClick={handleUpdate}>Simpan</button>
                <button onClick={() => setEditId(null)}>Batal</button>
              </>
            ) : (
              <>
                {user.nama}{" "}
                <button onClick={() => {
                  setEditId(user.id);
                  setEditNama(user.nama);
                }}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Hapus</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </div>
  );
}

export default Dashboard;

