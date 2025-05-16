import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dashboard from './dashboard.jsx';
import Ruangan from './ruangan.jsx';
import LaporanKeuangan from './LaporanKeuangan.jsx';
import LaporanKeuanganAdd from './LaporanKeuanganAdd.jsx';
import LaporanKeuanganEdit from './LaporanKeuanganEdit.jsx';
import AuthPage from './AuthPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import UserDashboard from './UserDashboard.jsx';
import About from './about.jsx';
import AdminAbout from './AdminAbout.jsx';
import Feedback from './feedback.jsx';
import SimpleTester from './simpletester.jsx';
import UserManagement from './UserManagement.jsx';
import AuthProvider from './AuthContext.jsx';

// Komponen wrapper dengan AuthProvider dan useNavigate
const AuthWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ruangan" element={<Ruangan />} />
      <Route path="/laporan" element={<LaporanKeuangan />} />
      <Route path="/laporan-keuangan" element={<LaporanKeuangan />} />
      <Route path="/laporan-keuangan/add" element={<LaporanKeuanganAdd />} />
      <Route path="/laporan-keuangan/edit/:id" element={<LaporanKeuanganEdit />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/test-feedback" element={<SimpleTester />} />
      <Route path="/Authpage" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin-about" element={<AdminAbout />} />
      <Route path="/user-management" element={<UserManagement />} />
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
