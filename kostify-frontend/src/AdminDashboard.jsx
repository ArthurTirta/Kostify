import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:3000';

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  
  // New state for booking details
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingBookingDetails, setLoadingBookingDetails] = useState(false);
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    price: '',
    description: '',
    status: 'available',
    image_url: ''
  });
  
  // State untuk upload gambar
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);  // Fetch rooms and user count from API
  useEffect(() => {
    fetchRooms();
    fetchUserCount();
    
    // Check if there's an action parameter in the URL
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');
    
    if (action === 'add-room') {
      setShowAddForm(true);
      // Clear the action parameter to avoid reopening the form on refresh
      navigate('/admin-dashboard', { replace: true });
    }
  }, [location, navigate]);
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms from:', `${API_BASE_URL}/rooms`);
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      console.log('Response:', response.data);
      setRooms(response.data);
      setRoomCount(response.data.length); // Set room count here
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError('Error fetching rooms: ' + (err.response?.data?.error || err.message));
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserCount = async () => {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, cannot fetch user count');
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.users) {
        setUserCount(response.data.users.length);
      }
    } catch (err) {
      console.error('Error fetching user count:', err);
      // Don't set an error state here to avoid disrupting the UI if this fails
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
        status: 'available',
        image_url: ''
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
  // Function to handle view booking details
  const handleViewBookingDetails = async (roomId) => {
    try {
      setLoadingBookingDetails(true);
      console.log(`Fetching booking details for room ID: ${roomId}`);
      const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}/booking`);
      console.log('Booking details response:', response.data);
      setBookingDetails({...response.data, room_id: roomId});
      setShowBookingDetailsModal(true);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      if (err.response && err.response.status === 404) {
        alert('Tidak ada data pemesanan untuk ruangan ini.');
      } else {
        alert('Error fetching booking details: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoadingBookingDetails(false);
    }
  };
  
  const handleLogout = () => {
    logout(() => {
      navigate('/AuthPage');
    });
  };
  
  // Fungsi untuk menangani drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e, isEdit = false) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], isEdit);
    }
  };

  const handleFileInput = (e, isEdit = false) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], isEdit);
    }
  };

  const handleFile = async (file, isEdit = false) => {
    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    
    console.log('File yang akan diupload:', file.name, file.type, file.size);
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Tampilkan data yang dikirim
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1].name);
      }
      
      console.log('Mengirim permintaan upload ke:', `${API_BASE_URL}/upload`);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
          console.log('Upload progress:', progress + '%');
        }
      });
      
      console.log('Response upload:', response.data);
      const imageUrl = response.data.imageUrl;
      
      if (isEdit) {
        setCurrentRoom({ ...currentRoom, image_url: imageUrl });
      } else {
        setNewRoom({ ...newRoom, image_url: imageUrl });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert('Gagal mengunggah gambar: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="page-container">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="main-content">
        <h1>Dashboard Admin</h1>
        <p>Kelola ruangan dan lihat status pemesanan</p>

        {error && <div className="error-message">{error}</div>}

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon user-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="summary-details">
              <h3>Total Pengguna</h3>
              <p className="summary-count">{userCount}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon room-icon">
              <i className="fas fa-door-open"></i>
            </div>
            <div className="summary-details">
              <h3>Total Ruangan</h3>
              <p className="summary-count">{roomCount}</p>
            </div>
          </div>
        </div>

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
                <label>Gambar Ruangan:</label>
                <div 
                  className={`file-drop-area ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={(e) => handleDrop(e, false)}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => handleFileInput(e, false)}
                    accept="image/*"
                    className="file-input"
                  />
                  {uploading ? (
                    <div className="upload-progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                      <p>{uploadProgress}% Uploaded</p>
                    </div>
                  ) : (
                    <div className="drop-message">
                      {newRoom.image_url ? (
                        <div className="preview-container">
                          <img 
                            src={newRoom.image_url}
                            alt="Preview"
                            className="image-preview"
                          />
                          <p>Klik atau seret gambar untuk mengganti</p>
                        </div>
                      ) : (
                        <p>Klik atau seret gambar ke sini untuk mengunggah</p>
                      )}
                    </div>
                  )}
                </div>
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
                <label>Gambar Ruangan:</label>
                <div 
                  className={`file-drop-area ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={(e) => handleDrop(e, true)}
                  onClick={() => editFileInputRef.current.click()}
                >
                  <input 
                    type="file" 
                    ref={editFileInputRef}
                    onChange={(e) => handleFileInput(e, true)}
                    accept="image/*"
                    className="file-input"
                  />
                  {uploading ? (
                    <div className="upload-progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                      <p>{uploadProgress}% Uploaded</p>
                    </div>
                  ) : (
                    <div className="drop-message">
                      {currentRoom.image_url ? (
                        <div className="preview-container">
                          <img 
                            src={currentRoom.image_url}
                            alt="Preview"
                            className="image-preview"
                          />
                          <p>Klik atau seret gambar untuk mengganti</p>
                        </div>
                      ) : (
                        <p>Klik atau seret gambar ke sini untuk mengunggah</p>
                      )}
                    </div>
                  )}
                </div>
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
                  <th>Gambar</th>
                  <th>Nama Ruangan</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>Tidak ada data ruangan</td>
                  </tr>
                ) : (
                  rooms.map(room => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td>
                        <img 
                          src={room.image_url || "https://plus.unsplash.com/premium_photo-1684164601278-3063c81f17dc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D"} 
                          alt={room.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td>{room.name}</td>
                      <td>Rp {parseInt(room.price).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${room.status}`}>
                          {room.status === 'available' ? 'Tersedia' : 'Terpesan'}
                        </span>
                      </td>                      <td className="action-buttons">
                        <button onClick={() => handleEditClick(room)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteRoom(room.id)} className="delete-btn">Hapus</button>
                        {room.status === 'booked' && (
                          <button onClick={() => handleViewBookingDetails(room.id)} className="view-booking-btn">Lihat Detail</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}        </div>
          {/* Booking Details Modal */}
        {showBookingDetailsModal && (
          <div className="modal-overlay">
            <div className="modal-content booking-details-modal">
              <h2>Detail Pemesanan</h2>
              
              {loadingBookingDetails ? (
                <p>Loading booking details...</p>
              ) : bookingDetails ? (
                <div className="booking-details-content">
                  <div className="detail-item">
                    <span className="detail-label">Nama Penyewa:</span>
                    <span className="detail-value">{bookingDetails.tenant_name}</span>
                  </div>
                  {bookingDetails.username && (
                    <div className="detail-item">
                      <span className="detail-label">Username:</span>
                      <span className="detail-value">{bookingDetails.username}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Nomor Telepon:</span>
                    <span className="detail-value">{bookingDetails.phone_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tanggal Mulai Sewa:</span>
                    <span className="detail-value">{new Date(bookingDetails.start_date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Durasi Sewa:</span>
                    <span className="detail-value">{bookingDetails.duration} bulan</span>
                  </div>
                </div>
              ) : (
                <p>No booking details found.</p>
              )}              <div className="modal-actions">
                <button onClick={() => {
                  setShowBookingDetailsModal(false);
                  setTimeout(() => setBookingDetails(null), 300); // Reset booking details after modal animation
                }} className="close-btn">Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;