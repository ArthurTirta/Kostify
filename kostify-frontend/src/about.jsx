import { Link } from 'react-router-dom';

function About() {
  return (
    <>
      <h1>Tentang Kami</h1>
      <p>Tentang Kami.</p>

      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue' }}>
        ⬅️ Kembali ke Halaman Utama
      </Link>
    </>
  );
}

export default About;
