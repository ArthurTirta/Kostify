import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dashboard from './dashboard.jsx';
import Ruangan from './ruangan.jsx';
import LaporanKeuangan from './laporan.jsx';
import Feedback from './feedback.jsx';
import AuthPage from './AuthPage.jsx';
import About from './about.jsx';
import CardRoomAdmin from './cardroomadmin.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ruangan" element={<Ruangan />} />
        <Route path="/laporan" element={<LaporanKeuangan />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/Authpage" element={<AuthPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/cardroomadmin" element={<CardRoomAdmin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
