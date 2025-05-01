import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Feedback from './feedback.jsx';
import './App.css';

function App() {
  const slides = [
    '/gambar1.jpg',
    '/gambar2.jpg',
    '/gambar3.jpg',
  ];
  
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
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    const cardInterval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % feedbackCards.length);
    }, 4000);
    
    return () => {
      clearInterval(slideInterval);
      clearInterval(cardInterval);
    };
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-container">
          <img id="logo" src="/logokos.jpg" alt="Logo" className="logo" />
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            {/* <li><Link to="/ruangan" className="nav-link">Ruangan</Link></li>
            <li><Link to="/laporan" className="nav-link">Laporan Keuangan</Link></li>
            <li><Link to="/feedback" className="nav-link">Feedback</Link></li> */}
            <li><Link to="/AuthPage" className="nav-link">AuthPage</Link></li>
            {/* <li><Link to="/about" className="nav-link">About Us</Link></li> */}
          </ul>
        </div>
      </nav>

      <main className="main-contentlp">
        <div className="hero-section">
          <div className="hero-text">
            <h1>Selamat Datang di Kostify</h1>
            <p className="subtitle">Temukan hunian nyaman, aman, dan sesuai gaya hidupmu.</p>
            <button className="cta-button" > <Link to="/AuthPage" className="nav-link">Get Started</Link></button>
          </div>
          <div className="autoslide-container">
            <img 
              src={slides[currentSlide]} 
              alt={`Slide ${currentSlide}`} 
              className="slide-image"
            />
            <div className="slide-indicators">
              {slides.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>

        <div className="description-section">
          <h2>Mengapa Memilih Kos Kami?</h2>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Fasilitas Lengkap</h3>
              <p>Kos kami menyediakan fasilitas bawaan lengkap sehingga penyewa bisa langsung tidur !!! </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Harga Terjangkau</h3>
              <p>Kami menyediakan harga kos-kosan yang terjangkau dilengkapi dengan dokumentasi ruangan yang lengkap sehingga kamu tidak perlu ragu lagi. </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Strategis</h3>
              <p>Kos kami berada di posisi yang cukup strategis dekat dengan perbelanjaan, pasar, tempat ibadah dan tempat-tempat wisata yang menarik di Balikpapan</p>
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h2>Apa Kata Pengguna Kami?</h2>
          <div className="cards-container">
            {feedbackCards.map((card, index) => (
              <div 
                key={card.id}
                className={`feedback-card ${index === currentCard ? 'active' : ''}`}
              >
                <div className="card-header">
                  <div className="user-avatar">{card.name.charAt(0)}</div>
                  <div className="user-info">
                    <h4>{card.name}</h4>
                    <div className="rating">
                      {Array(card.rating).fill().map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="card-comment">"{card.comment}"</p>
              </div>
            ))}
            <div className="card-indicators">
              {feedbackCards.map((_, index) => (
                <span 
                  key={index}
                  className={`card-indicator ${index === currentCard ? 'active' : ''}`}
                  onClick={() => setCurrentCard(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Tentang Kami</h4>
            <p>Kami menyediakan solusi sistem informasi terintegrasi untuk manajemen ruangan dan keuangan.</p>
          </div>
          <div className="footer-section">
            <h4>Kontak</h4>
            <p>Email: markus.tupa@gmail.com</p>
            <p>Telepon: +628</p>
          </div>
          <div className="footer-section">
            <h4>Tautan Cepat</h4>
            <ul>
              <li><Link to="/AuthPage">Get Started</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Sistem Informasi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;