import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
      <h1>Ini Halaman Dashboard</h1>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </>
  );
}

export default Dashboard;
