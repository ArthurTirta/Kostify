import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!auth) {
      navigate('/AuthPage');
    } else if (auth.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  // Fetch users dari database melalui API yang telah diubah
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Menggunakan endpoint /users yang sudah dimodifikasi untuk mengembalikan data dari database
        console.log('Fetching users from database via /users endpoint');
        const response = await axios.get('http://localhost:3000/users');
        
        if (response.status === 200) {
          const userData = response.data;
          console.log('Users data from database:', userData);
          
          // Data dari backend sudah dalam format yang diharapkan dengan field role
          // Langsung gunakan data tanpa perlu format lagi
          setUsers(userData);
          setLoading(false);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Error fetching users');
        setLoading(false);
      }
    };

    if (auth && auth.role === 'admin') {
      fetchUsers();
    }
  }, [auth]);

  const handleDeleteUser = async (userId, username) => {
    // Confirm before deleting
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user: ${username}?`)) {
      return;
    }

    try {
      // Menggunakan endpoint /users yang menghapus data di database
      const response = await axios.delete(`http://localhost:3000/users/${userId}`);
      
      if (response.status === 200) {
        // Update state to remove the deleted user
        setUsers(users.filter(user => user.id !== userId));
        setSuccessMessage(`User ${username} berhasil dihapus`);
        
        console.log('Delete successful:', response.data);
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Gagal menghapus pengguna. Coba lagi nanti.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (!auth || auth.role !== 'admin') {
    return null; // This will be handled by the redirect in useEffect
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content">
        <div className="admin-container">
          <h2>Kelola Pengguna</h2>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="user-management-container">
              {users && users.length > 0 ? (
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>Peran</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nama}</td>
                        <td>{user.role === 'admin' ? 'Admin' : 'Penyewa'}</td>
                        <td>
                          {user.id !== auth.userId && (
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteUser(user.id, user.nama)}
                            >
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Tidak ada data pengguna</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement; 