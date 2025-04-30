import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:3000';

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  
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

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms from:', `${API_BASE_URL}/rooms`);
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      console.log('Response:', response.data);
      setRooms(response.data);
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError('Error fetching rooms: ' + (err.response?.data?.error || err.message));
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
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
  
  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    navigate('/AuthPage');
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
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <div className="button-container">
          <button onClick={() => setShowAddForm(true)}>+ Tambah Ruangan</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Dashboard Admin</h1>
        <p>Kelola ruangan dan lihat status pemesanan</p>

        {error && <div className="error-message">{error}</div>}

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
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(room)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteRoom(room.id)} className="delete-btn">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <Link to="/" className="link-back">
          ⬅️ Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard; 