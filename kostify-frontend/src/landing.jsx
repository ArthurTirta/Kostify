import { Link } from 'react-router-dom';

function Landing() {
  return (
    <>
      <h1>Selamat Datang!</h1>
      <p>Ini adalah halaman utama (landing page).</p>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </>
  );
}

export default Landing;
