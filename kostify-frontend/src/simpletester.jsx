import React, { useState } from 'react';

function SimpleTester() {
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('Test User');
  const [rating, setRating] = useState(5);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = 'http://localhost:3001';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const data = {
        comment: comment.trim(),
        user_name: userName.trim(),
        rating: Number(rating)
      };
      
      console.log('Submitting feedback data:', data);
      
      // Try the feedback endpoint
      const feedbackResponse = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      try {
        const feedbackResult = await feedbackResponse.json();
        console.log('Feedback endpoint response:', feedbackResult);
        setResponse(feedbackResult);
        
        if (feedbackResponse.ok) {
          // Clear form on success
          setComment('');
          alert('Feedback submitted successfully!');
        }
      } catch (err) {
        console.error('Error with feedback endpoint:', err);
        setResponse({ 
          error: `Status: ${feedbackResponse.status}, Error parsing response` 
        });
      }
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Simple Feedback Tester</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffdddd', 
          color: '#D8000C', 
          padding: '10px', 
          margin: '10px 0',
          borderRadius: '5px'
        }}>
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>User Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Feedback Submission'}
        </button>
      </form>
      
      {response && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          overflowX: 'auto' 
        }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SimpleTester; 