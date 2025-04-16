import { Link } from 'react-router-dom';

function Feedback() {
  return (
    <>
      <h1>Halaman Feedback</h1>
      <p>Kami menghargai masukan Anda!</p>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </>
  );
}

export default Feedback;
