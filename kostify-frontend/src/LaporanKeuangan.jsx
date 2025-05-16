import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

function LaporanKeuangan() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fetch financial reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/finance');
        
        if (response.status === 200) {
          console.log('Financial reports data:', response.data);
          setReports(response.data);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching financial reports:', err);
        setError(err.message || 'Error fetching financial reports');
      } finally {
        setLoading(false);
      }
    };

    if (auth && auth.role === 'admin') {
      fetchReports();
    }
  }, [auth]);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan keuangan ini?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/finance/${id}`);
      
      if (response.status === 200) {
        // Remove the deleted report from state
        setReports(reports.filter(report => report.id !== id));
        alert('Laporan keuangan berhasil dihapus');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error deleting financial report:', err);
      alert('Gagal menghapus laporan keuangan');
    }
  };

  // Helper untuk menampilkan nama bulan
  const formatMonth = (month) => {
    return month || "Tidak ada data";
  };

  if (!auth || auth.role !== 'admin') {
    return null; // This will be handled by the redirect in useEffect
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content">
        <div className="admin-container">
          <div className="header-with-button">
            <h2>Laporan Keuangan</h2>
            <Link to="/laporan-keuangan/add" className="add-button">
              <span>+</span>
            </Link>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="finance-reports-container">
              {reports && reports.length > 0 ? (
                <table className="finance-table">
                  <thead>
                    <tr>
                      <th>Bulan</th>
                      <th>Tahun</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Foto</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.id}>
                        <td>{formatMonth(report.bulan)}</td>
                        <td>{report.tahun}</td>
                        <td>{new Date(report.tanggal).toLocaleDateString('id-ID')}</td>
                        <td>{report.status}</td>
                        <td>
                          {report.bukti_foto ? (
                            <a 
                              href={`http://localhost:3000${report.bukti_foto}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="view-image"
                            >
                              <img 
                                src={`http://localhost:3000${report.bukti_foto}`} 
                                alt="Bukti Pembayaran" 
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </a>
                          ) : (
                            "Tidak ada bukti"
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/laporan-keuangan/edit/${report.id}`} className="edit-button">
                              <span role="img" aria-label="Edit">✏️</span>
                            </Link>
                            <button 
                              className="delete-button"
                              onClick={() => handleDelete(report.id)}
                            >
                              <span role="img" aria-label="Delete">🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Tidak ada data laporan keuangan</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LaporanKeuangan;