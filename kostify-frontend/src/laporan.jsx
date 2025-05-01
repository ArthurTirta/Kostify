import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

function LaporanKeuangan() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="page-container">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="main-content">
        <h1>Laporan Keuangan</h1>
        <p>Rekap laporan keuangan bulanan.</p>
        
        {/* Content to be added here */}
        <div className="laporan-container">
          <p>Fitur ini sedang dalam pengembangan.</p>
        </div>
        
        {auth ? (
          auth.role === 'admin' ? (
            <Link to="/admin-dashboard" className="link-back">
              ⬅️ Kembali ke Dashboard Admin
            </Link>
          ) : (
            <Link to="/user-dashboard" className="link-back">
              ⬅️ Kembali ke Dashboard Penyewa
            </Link>
          )
        ) : (
          <Link to="/" className="link-back">
            ⬅️ Kembali ke Halaman Utama
          </Link>
        )}
      </div>
    </div>
  );
}

export default LaporanKeuangan;
