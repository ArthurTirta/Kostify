import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './index.css';

function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout(() => {
      navigate('/AuthPage');
    });
  };
  
  // Navbar for admin users
  if (auth && auth.role === 'admin') {
    return (
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <div className="button-container">
          <Link to="/admin-dashboard"><button>Dashboard</button></Link>
          <Link to="/admin-dashboard?action=add-room"><button>+ Tambah Ruangan</button></Link>
          <Link to="/laporan-keuangan"><button>Laporan Keuangan</button></Link>
          <Link to="/feedback"><button>Feedback</button></Link>
          <Link to="/admin-about"><button>Edit About Us</button></Link>
          <Link to="/user-management"><button>Kelola Pengguna</button></Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
  
  // Navbar for tenant users
  if (auth && auth.role === 'penyewa') {
    return (
      <div className="sidebar">
        <h3>Menu Pengguna</h3>
        <div className="button-container">
          <Link to="/user-dashboard"><button>Ruangan Tersedia</button></Link>
          <button>Pemesanan Saya</button>
          <Link to="/laporan"><button>Laporan Keuangan</button></Link>
          <Link to="/feedback"><button>Feedback</button></Link>
          <Link to="/about"><button>About Us</button></Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
  
  // Navbar for non-logged in users
  return (
    <div className="sidebar">
      <div className="button-container">
        <Link to="/dashboard"><button>Dashboard</button></Link>
        <Link to="/laporan"><button>Laporan Keuangan</button></Link>
        <Link to="/feedback"><button>Feedback</button></Link>
        <Link to="/about"><button>About Us</button></Link>
        <Link to="/AuthPage"><button>Login</button></Link>
      </div>
    </div>
  );
}

export default Navbar; 