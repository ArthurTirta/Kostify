import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import './index.css';

// API URL
const API_URL = 'http://localhost:3001';

function Feedback() {
  // State variables
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Auth context
  const { auth } = useContext(AuthContext);
  const isAdmin = auth?.role === 'admin';
  
  // Fetch feedbacks on component mount
  useEffect(() => {
    loadFeedbacks();
  }, []);
  
  // Function to load feedbacks
  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      
      /*
      // Mock data for testing the UI
      const mockData = [
        {
          id: 1,
          user_name: 'Test User 1',
          rating: 5,
          comment: 'This is a test comment from the mock data',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_name: 'Test User 2',
          rating: 4,
          comment: 'Another test comment from the mock data',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3, 
          user_name: 'Test User 3',
          rating: 3,
          comment: 'A third test comment with a different rating',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      // Use mock data instead of fetching
      setFeedbacks(mockData);
      setError(null);
      */
      
      console.log('Fetching feedback from:', `${API_URL}/feedback`);
      const response = await fetch(`${API_URL}/feedback`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received feedback data:', data.length, 'entries');
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      console.error("Error loading feedbacks:", err);
      setError("Failed to load feedbacks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }
    
    if (!auth && !userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Prepare data
      const feedbackData = {
        comment: comment.trim(),
        rating: Number(rating),
        user_name: auth?.username || userName.trim() || 'Anonymous User'
      };
      
      console.log('Submitting feedback:', feedbackData);
      
      // Submit with fetch API
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || `Server error: ${response.status}`);
      }
      
      // Success case
      console.log('Feedback submitted successfully:', responseData);
      setComment('');
      setUserName('');
      setRating(5);
      loadFeedbacks();
      alert('Thank you for your feedback!');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(`Failed to submit feedback: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Function to handle feedback deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      loadFeedbacks();
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="page-container" style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <Navbar />
      </div>
      
      <div style={{ padding: '20px', flexGrow: 1, overflowY: 'auto', maxWidth: 'calc(100% - 250px)' }}>
        <h1>Feedback</h1>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffdddd', 
            color: '#D8000C', 
            padding: '15px', 
            margin: '15px 0', 
            borderRadius: '5px' 
          }}>
            {error}
          </div>
        )}
        
        {/* Submit feedback form - hidden for admins */}
        {!isAdmin && (
          <div style={{ 
            marginBottom: '30px', 
            backgroundColor: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '5px',
            maxWidth: '800px'
          }}>
            <h2>Submit Feedback</h2>
            
            <form onSubmit={handleSubmit}>
              {!auth && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Your Name:</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ width: '100%', padding: '8px' }}
                    disabled={submitting}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px' }}
                  disabled={submitting}
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '8px', minHeight: '100px' }}
                  disabled={submitting}
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: submitting ? '#ccc' : '#4CAF50',
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
        
        {/* Feedback list */}
        <div style={{ maxWidth: '800px' }}>
          <h2>{isAdmin ? "Manage Feedbacks" : "Feedback List"}</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : feedbacks.length === 0 ? (
            <p>No feedbacks yet.</p>
          ) : (
            <div>
              {feedbacks.map((feedback) => (
                <div 
                  key={feedback.id}
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '5px', 
                    padding: '15px', 
                    marginBottom: '15px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0' }}>{feedback.user_name}</h3>
                      <small>{formatDate(feedback.created_at)}</small>
                    </div>
                    <div>
                      <span style={{ fontSize: '18px', color: '#FFD700' }}>
                        {"★".repeat(feedback.rating || 5)}
                        {"☆".repeat(5 - (feedback.rating || 5))}
                      </span>
                    </div>
                  </div>
                  
                  <p style={{ margin: '10px 0' }}>{feedback.comment}</p>
                  
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <div style={{ marginTop: '20px' }}>
          {auth ? (
            auth.role === 'admin' ? (
              <Link to="/admin-dashboard" style={{ color: '#2196F3', textDecoration: 'none' }}>
                ⬅️ Back to Admin Dashboard
              </Link>
            ) : (
              <Link to="/user-dashboard" style={{ color: '#2196F3', textDecoration: 'none' }}>
                ⬅️ Back to User Dashboard
              </Link>
            )
          ) : (
            <Link to="/" style={{ color: '#2196F3', textDecoration: 'none' }}>
              ⬅️ Back to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback; 