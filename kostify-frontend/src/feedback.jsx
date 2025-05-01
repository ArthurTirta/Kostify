import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './feedback.css';

const Feedback = () => {
  const navigate = useNavigate();  

  const feedbackCards = [
    {
      id: 1,
      name: "John Doe",
      comment: "Pelayanan sangat memuaskan, ruangan bersih dan nyaman.",
      rating: 5
    },
    {
      id: 2,
      name: "Jane Smith",
      comment: "Sistem informasi yang sangat membantu dalam manajemen ruangan.",
      rating: 4
    },
    {
      id: 3,
      name: "Robert Johnson",
      comment: "Laporan keuangan sangat detail dan mudah dipahami.",
      rating: 5
    },
    {
      id: 4,
      name: "Emily Davis",
      comment: "Antarmuka yang user-friendly dan intuitif.",
      rating: 4
    },
    {
      id: 5,
      name: "Michael Wilson",
      comment: "Respon cepat dari tim support ketika ada kendala.",
      rating: 5
    },
    {
      id: 6,
      name: "Anna Taylor",
      comment: "Kos yang sangat nyaman dan aman, dekat dengan fasilitas umum.",
      rating: 5
    }
  ];

  const [newFeedback, setNewFeedback] = useState({
    comment: '',
    rating: 1
  });
  const [visibleComments, setVisibleComments] = useState(3);

  const handleGoBack = () => {
    navigate(-1);  
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Feedback berhasil dikirim!');
    setNewFeedback({ comment: '', rating: 1 }); 
  };

  const handleShowMore = () => {
    setVisibleComments(prev => Math.min(feedbackCards.length, prev + 3));
  };

  return (
    <div className="feedback-container">
      <button className="back-button" onClick={handleGoBack}>Kembali</button>

      <h2>Apa Kata Pengguna Kami?</h2>

      {/* Display limited comments */}
      <div className="comments-list">
        {feedbackCards.slice(0, visibleComments).map((card) => (
          <div key={card.id} className="comment-item">
            <div className="user-name">{card.name}</div>
            <div className="feedback-comment">
              "{card.comment}"
              <div className="rating">Rating: {"★".repeat(card.rating)}</div>
            </div>
          </div>
        ))}
      </div>

      {visibleComments < feedbackCards.length && (
        <button className="show-more-button" onClick={handleShowMore}>Lihat Lainnya</button>
      )}

      <div className="new-feedback-form">
        <h3>Tulis Feedback Anda</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="comment">Komentar dan Rating:</label>
            <div className="comment-rating-container">
              <textarea
                id="comment"
                name="comment"
                value={newFeedback.comment}
                onChange={handleInputChange}
                placeholder="Tulis komentar Anda"
                required
              />
              <select
                id="rating"
                name="rating"
                value={newFeedback.rating}
                onChange={handleInputChange}
                required
              >
                <option value="1">1 - ★</option>
                <option value="2">2 - ★★</option>
                <option value="3">3 - ★★★</option>
                <option value="4">4 - ★★★★</option>
                <option value="5">5 - ★★★★★</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-button">Kirim Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
