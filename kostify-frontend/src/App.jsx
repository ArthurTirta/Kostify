import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Halaman Utama</h1>
      <p>Silakan navigasi ke halaman lain:</p>
      <nav>
        <ul>
          <li><Link to="/landing">Landing Page</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/ruangan">Ruangan</Link></li>
          <li><Link to="/laporan">Laporan Keuangan</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
          <li><Link to="/about">About Us</Link></li>

        </ul>
      </nav>
    </>
  );
}

export default App;
