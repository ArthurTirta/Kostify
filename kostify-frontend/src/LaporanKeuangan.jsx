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
  const [filter, setFilter] = useState({
    year: '',
    month: '',
    penyewa: ''
  });
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Array bulan untuk filter dropdown
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

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

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    if (filter.month && report.bulan !== filter.month) return false;
    if (filter.year && report.tahun !== parseInt(filter.year)) return false;
    if (filter.penyewa && report.penyewa && !report.penyewa.toLowerCase().includes(filter.penyewa.toLowerCase())) return false;
    return true;
  });

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
          
          {/* Filter Form */}
          <div className="filter-container">
            <div className="filter-form">
              <div className="filter-group">
                <label>Bulan:</label>
                <select 
                  value={filter.month}
                  onChange={(e) => setFilter({...filter, month: e.target.value})}
                >
                  <option value="">Semua</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Tahun:</label>
                <select 
                  value={filter.year}
                  onChange={(e) => setFilter({...filter, year: e.target.value})}
                >
                  <option value="">Semua</option>
                  {Array.from(new Set(reports.map(report => report.tahun))).sort().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Penyewa:</label>
                <input 
                  type="text" 
                  value={filter.penyewa}
                  onChange={(e) => setFilter({...filter, penyewa: e.target.value})}
                  placeholder="Cari nama penyewa..."
                />
              </div>
              
              <button 
                type="button" 
                className="filter-reset" 
                onClick={() => setFilter({...filter, year: '', month: '', penyewa: ''})}
              >
                Reset Filter
              </button>
            </div>
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="finance-reports-container">
              {reports && reports.length > 0 ? (
                <>
                  {filteredReports.length > 0 ? (
                    <>
                      <table className="finance-table">
                        <thead>
                          <tr>
                            <th>Bulan</th>
                            <th>Tahun</th>
                            <th>Tanggal</th>
                            <th>Nama Penyewa</th>
                            <th>Ruangan</th>
                            <th>Status</th>
                            <th>Foto</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReports.map(report => (
                            <tr key={report.id}>
                              <td>{formatMonth(report.bulan)}</td>
                              <td>{report.tahun}</td>
                              <td>{new Date(report.tanggal).toLocaleDateString('id-ID')}</td>
                              <td>{report.penyewa || "Tidak ada data"}</td>
                              <td>{report.ruangan || "Tidak ada data"}</td>
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
                      <div className="report-summary">
                        <p>Menampilkan {filteredReports.length} dari {reports.length} laporan</p>
                      </div>
                    </>
                  ) : (
                    <p>Tidak ada laporan keuangan yang sesuai dengan filter</p>
                  )}
                </>
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