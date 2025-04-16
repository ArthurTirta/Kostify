import { Link } from 'react-router-dom';

function Laporan() {
  return (
    <>
      <h1>Laporan Keuangan</h1>
      <p>Rekap laporan keuangan bulanan.</p>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </>
  );
}

export default Laporan;
