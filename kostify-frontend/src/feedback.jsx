import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

const API_BASE_URL = 'http://localhost:3000';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for new feedback
  const [newFeedback, setNewFeedback] = useState({
    comment: '',
    user_name: ''
  });
  
  const { auth } = useContext(AuthContext);
  
  // Determine if user is admin
  const isAdmin = auth?.role === 'admin';

  // Fetch feedbacks on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);
  
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/feedback`);
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Error loading feedbacks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    try {
      const feedbackToSubmit = {
        ...newFeedback,
        user_id: auth?.id || null,
        user_name: auth?.username || newFeedback.user_name || 'Anonymous User'
      };
      
      await axios.post(`${API_BASE_URL}/feedback`, feedbackToSubmit);
      
      // Reset form
      setNewFeedback({
        comment: '',
        user_name: ''
      });
      
      // Refresh feedbacks
      fetchFeedbacks();
      
      alert('Thank you for your feedback!');
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    }
  };
  
  return (
    <div className="page-container">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="main-content">
        <h1>Feedback Kostify</h1>
        
        {/* Development Message */}
        <div className="development-message">
          <div className="message-container">
            <h2>🚧 Halaman Dalam Pengembangan 🚧</h2>
            <p>Mohon maaf, fitur feedback saat ini sedang dalam tahap pengembangan.</p>
            <p>Kami sedang bekerja untuk menyempurnakan fitur ini dan akan segera tersedia.</p>
            <p>Terima kasih atas pengertian Anda. Silakan kunjungi kembali nanti.</p>
          </div>
        </div>
        
        {auth ? (
          auth.role === 'admin' ? (
            <Link to="/admin-dashboard" className="link-back">
              ⬅️ Back to Admin Dashboard
            </Link>
          ) : (
            <Link to="/user-dashboard" className="link-back">
              ⬅️ Back to User Dashboard
            </Link>
          )
        ) : (
          <Link to="/" className="link-back">
            ⬅️ Back to Home
          </Link>
        )}
      </div>
    </div>
  );
}

export default Feedback; 