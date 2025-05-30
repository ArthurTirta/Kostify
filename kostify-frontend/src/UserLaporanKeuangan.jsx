import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

function UserLaporanKeuangan() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    year: '',
    month: ''
  });
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Array bulan untuk filter dropdown
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Redirect if not authenticated or not penyewa
  useEffect(() => {
    if (!auth) {
      navigate('/AuthPage');
    } else if (auth.role !== 'penyewa') {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  // Fetch financial reports for the logged-in user
  useEffect(() => {
    const fetchUserReports = async () => {
      setLoading(true);
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No auth token found');
          setError('Silakan login terlebih dahulu');
          return;
        }
        
        const response = await axios.get('http://localhost:3000/finance/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          console.log('User financial reports data:', response.data);
          setReports(response.data);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching user financial reports:', err);
        if (err.response && err.response.status === 404) {
          setError('Akun Anda tidak ditemukan dalam sistem. Silakan hubungi admin.');
        } else if (err.response && err.response.status === 500) {
          setError('Terjadi kesalahan server. Silakan coba lagi nanti.');
        } else {
          setError('Gagal mengambil data laporan keuangan: ' + (err.message || 'Error tidak diketahui'));
        }
      } finally {
        setLoading(false);
      }
    };

    if (auth && auth.role === 'penyewa') {
      fetchUserReports();
    }
  }, [auth]);

  // Helper untuk menampilkan nama bulan
  const formatMonth = (month) => {
    return month || "Tidak ada data";
  };

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    if (filter.month && report.bulan !== filter.month) return false;
    if (filter.year && report.tahun !== parseInt(filter.year)) return false;
    return true;
  });

  if (!auth || auth.role !== 'penyewa') {
    return null; // This will be handled by the redirect in useEffect
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content">
        <div className="user-container">
          <h2>Laporan Keuangan Saya</h2>
          
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
              
              <button 
                type="button" 
                className="filter-reset" 
                onClick={() => setFilter({...filter, year: '', month: ''})}
              >
                Reset Filter
              </button>
            </div>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="finance-reports-container">
              {reports && reports.length > 0 ? (
                <>
                  {filteredReports.length > 0 ? (
                    <table className="finance-table">
                      <thead>
                        <tr>
                          <th>Bulan</th>
                          <th>Tahun</th>
                          <th>Tanggal</th>
                          <th>Ruangan</th>
                          <th>Bukti Bayar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map(report => (
                          <tr key={report.id}>
                            <td>{formatMonth(report.bulan)}</td>
                            <td>{report.tahun}</td>
                            <td>{new Date(report.tanggal).toLocaleDateString('id-ID')}</td>
                            <td>{report.ruangan || "Tidak ada data"}</td>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Tidak ada laporan keuangan yang sesuai dengan filter</p>
                  )}
                  <div className="report-summary">
                    <p>Menampilkan {filteredReports.length} dari {reports.length} laporan</p>
                  </div>
                </>
              ) : (
                <div className="no-reports">
                  <p>Belum ada laporan keuangan untuk Anda</p>
                  <p className="no-reports-info">
                    Laporan keuangan akan ditampilkan di sini setelah admin menginputkan data pembayaran
                    untuk akun Anda. Jika Anda sudah melakukan pembayaran tetapi belum muncul di sini,
                    silakan hubungi admin.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserLaporanKeuangan;
