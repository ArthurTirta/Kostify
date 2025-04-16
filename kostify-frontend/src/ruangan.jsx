import { Link } from 'react-router-dom';

function Ruangan() {
  return (
    <>
      <h1>Data Ruangan</h1>
      <p>Informasi terkait ruangan tersedia di sini.</p>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </>
  );
}

export default Ruangan;
