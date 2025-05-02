import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dashboard from './dashboard.jsx';
import Ruangan from './ruangan.jsx';
import LaporanKeuangan from './laporan.jsx';
import AuthPage from './AuthPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import UserDashboard from './UserDashboard.jsx';
import About from './about.jsx';
import AdminAbout from './AdminAbout.jsx';
import Feedback from './feedback.jsx';
import SimpleTester from './simpletester.jsx';
import AuthProvider from './AuthContext.jsx';

// Komponen wrapper dengan AuthProvider dan useNavigate
const AuthWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ruangan" element={<Ruangan />} />
      <Route path="/laporan" element={<LaporanKeuangan />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/test-feedback" element={<SimpleTester />} />
      <Route path="/Authpage" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin-about" element={<AdminAbout />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
