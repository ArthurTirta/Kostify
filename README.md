# 🏠 Kostify

**Repository**: [https://github.com/ArthurTirta/Kostify](https://github.com/ArthurTirta/Kostify)

Kostify adalah sebuah aplikasi web manajemen kos yang dikembangkan sebagai solusi digital untuk membantu pemilik kos *Solata Kos* dalam mempromosikan dan mengelola usahanya. Aplikasi ini mempermudah pemilik untuk:

* Menampilkan informasi kos secara lengkap dan menarik
* Mengelola data penyewa dan pembayaran
* Menerima dan menanggapi masukan dari penyewa

Dikembangkan oleh mahasiswa dalam kerangka kerja kolaborasi dengan mitra, Kostify menyajikan fitur autentikasi, dashboard admin, sistem konfirmasi pembayaran, serta form feedback digital. Aplikasi ini dibangun menggunakan **React** di frontend dan **Express.js** di backend dengan dukungan **PostgreSQL** untuk manajemen data.

---

## 🛠️ Petunjuk Instalasi

### Prasyarat

Pastikan perangkat Anda telah terinstal:

* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [npm](https://www.npmjs.com/) 
* Git

### Langkah-langkah Instalasi

1. **Clone repositori**

   ```bash
   git clone https://github.com/ArthurTirta/Kostify.git
   cd Kostify
   ```

2. **Instal dependensi backend**

   ```bash
   cd backend
   npm install
   ```

3. **Instal dependensi frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup database**

   * Buat database PostgreSQL: `kostify_db`
   * Jalankan skrip SQL untuk membuat tabel (tersedia di `/backend/database/schema.sql`)

5. **Jalankan server**

   * Backend:

     ```bash
     cd backend
     npm run dev
     ```
   * Frontend:

     ```bash
     cd frontend
     npm start
     ```

---

## ℹ️ Petunjuk Informasi

Kostify menyajikan fitur-fitur utama sebagai berikut:

* Autentikasi pengguna (Admin dan Penyewa)
* Pengelolaan informasi dan daftar kos
* Konfirmasi dan manajemen pembayaran penyewa
* Pengumpulan dan pengelolaan feedback dari pengguna
* Tampilan antarmuka responsif dan mudah digunakan

---

## ✅ Petunjuk Konfirmasi

Untuk melakukan konfirmasi pembayaran:

1. Login sebagai penyewa
2. Akses menu “Pembayaran”
3. Upload bukti pembayaran
4. Admin akan memverifikasi pembayaran melalui dashboard

---

## ⚙️ Petunjuk Pengoperasian

### Admin

* Login
* Kelola data kos dan informasi kamar
* Kelola bukti pembayaran
* Edit dan hapus feedback dari penyewa
* Kelola halaman About us
* Logout

### Penyewa

* Login/Register
* Melihat halaman ruangan kos
* Melakukan pemesanan ruangan
* Upload bukti pembayaran
* Kirim dan lihat kritik/saran
* Lihat halaman "About Us"
* Logout

### Pengguna 

* Melihat kamar kos
* Melihat feadback Penyewa
* Melihat halaman About us

Navigasi utama:

* `/login` - Halaman masuk
* `/dashboard` - Ringkasan manajemen
* `/kos` - Daftar kos
* `/pembayaran` - Upload bukti bayar
* `/feedback` - Kirim saran/keluhan

---

## 📦 Berkas Manifest

Struktur proyek:
KOSTIFY
```
├── kostify-backend/
│   ├── package.json
│   └── server.js
├── kostify-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── laporan_progress/ 
├── .gitignore     
└── README.md         # Dokumentasi utama
```

---

## 🧰 Troubleshooting

| Masalah                              | Solusi                                            |
| ------------------------------------ | ------------------------------------------------- |
| Tidak bisa connect ke database       | Periksa `.env` dan kredensial PostgreSQL          |
| Frontend blank / tidak merespon      | Pastikan backend berjalan dan CORS tidak diblokir |
| Login gagal meski data benar         | Periksa hashing password dan endpoint `/login`    |
| Data tidak tersimpan                 | Periksa query SQL dan koneksi database            |

