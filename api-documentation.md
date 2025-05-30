# Dokumentasi API Kostify

## Gambaran Umum

Kostify adalah sistem manajemen kost yang menyediakan berbagai fitur untuk administrator dan penyewa. Dokumentasi API ini menguraikan endpoint yang tersedia, tujuannya, dan cara menggunakannya.

## URL Dasar

```
http://localhost:3000
```

## Autentikasi

API Kostify menggunakan JWT (JSON Web Token) untuk autentikasi. Untuk mengakses endpoint yang dilindungi, Anda perlu menyertakan token di header Authorization:

```
Authorization: Bearer <token_anda>
```

### Endpoint Autentikasi

#### Registrasi Pengguna

Membuat akun pengguna baru.

- **URL:** `/auth/register`
- **Metode:** `POST`
- **Autentikasi:** Tidak diperlukan
- **Body Permintaan:**
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "string" // "admin" atau "penyewa"
  }
  ```
- **Respons Sukses:** `201 Created`
  ```json
  {
    "message": "User berhasil didaftarkan",
    "user": {
      "id": "number",
      "username": "string",
      "role": "string"
    }
  }
  ```
- **Respons Error:** `400 Bad Request`, `500 Internal Server Error`

#### Login

Melakukan autentikasi pengguna dan mengembalikan token JWT.

- **URL:** `/auth/login`
- **Metode:** `POST`
- **Autentikasi:** Tidak diperlukan
- **Body Permintaan:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Respons Sukses:** `200 OK`
  ```json
  {
    "message": "Login berhasil",
    "user": {
      "id": "number",
      "username": "string",
      "role": "string"
    },
    "token": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

#### Mendapatkan Profil Pengguna

Mengembalikan informasi profil pengguna yang terautentikasi.

- **URL:** `/auth/profile`
- **Metode:** `GET`
- **Autentikasi:** Diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  {
    "message": "Token valid",
    "user": {
      "id": "number",
      "username": "string",
      "role": "string"
    }
  }
  ```
- **Respons Error:** `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

## Ruangan

### Endpoint Ruangan

#### Mendapatkan Semua Ruangan

Mengembalikan daftar semua ruangan yang tersedia.

- **URL:** `/rooms`
- **Metode:** `GET`
- **Autentikasi:** Tidak diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  [
    {
      "id": "number",
      "name": "string",
      "price": "number",
      "description": "string",
      "status": "string", // "available" atau "booked"
      "image_url": "string"
    }
  ]
  ```
- **Respons Error:** `500 Internal Server Error`

#### Mendapatkan Ruangan Berdasarkan ID

Mengembalikan detail ruangan tertentu.

- **URL:** `/rooms/:id`
- **Metode:** `GET`
- **Autentikasi:** Tidak diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  {
    "id": "number",
    "name": "string",
    "price": "number",
    "description": "string",
    "status": "string",
    "image_url": "string"
  }
  ```
- **Respons Error:** `404 Not Found`, `500 Internal Server Error`

#### Membuat Ruangan Baru

Membuat entri ruangan baru (hanya admin).

- **URL:** `/rooms`
- **Metode:** `POST`
- **Autentikasi:** Diperlukan (Peran Admin)
- **Body Permintaan:**
  ```json
  {
    "name": "string",
    "price": "number",
    "description": "string",
    "status": "string", // Opsional, default ke "available"
    "image_url": "string" // Opsional
  }
  ```
- **Respons Sukses:** `201 Created`
  ```json
  {
    "id": "number",
    "name": "string",
    "price": "number",
    "description": "string",
    "status": "string",
    "image_url": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

#### Memperbarui Ruangan

Memperbarui informasi untuk ruangan yang ada (hanya admin).

- **URL:** `/rooms/:id`
- **Metode:** `PUT`
- **Autentikasi:** Diperlukan (Peran Admin)
- **Body Permintaan:**
  ```json
  {
    "name": "string",
    "price": "number",
    "description": "string",
    "status": "string",
    "image_url": "string"
  }
  ```
- **Respons Sukses:** `200 OK`
  ```json
  {
    "id": "number",
    "name": "string",
    "price": "number",
    "description": "string",
    "status": "string",
    "image_url": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

#### Menghapus Ruangan

Menghapus entri ruangan (hanya admin).

- **URL:** `/rooms/:id`
- **Metode:** `DELETE`
- **Autentikasi:** Diperlukan (Peran Admin)
- **Respons Sukses:** `200 OK`
  ```json
  {
    "message": "Ruangan berhasil dihapus",
    "deletedRoom": {
      "id": "number",
      "name": "string",
      "price": "number",
      "description": "string",
      "status": "string",
      "image_url": "string"
    }
  }
  ```
- **Respons Error:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

## Laporan Keuangan

### Endpoint Keuangan

#### Mendapatkan Semua Laporan Keuangan

Mengembalikan daftar semua laporan keuangan (hanya admin).

- **URL:** `/finance`
- **Metode:** `GET`
- **Autentikasi:** Diperlukan (Peran Admin)
- **Respons Sukses:** `200 OK`
  ```json
  [
    {
      "id": "number",
      "user_id": "number",
      "room_id": "number",
      "bulan": "string",
      "tahun": "number",
      "jumlah": "number",
      "status": "string",
      "bukti_pembayaran": "string",
      "username": "string",
      "ruangan": "string"
    }
  ]
  ```
- **Respons Error:** `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

#### Mendapatkan Laporan Keuangan Pengguna

Mengembalikan laporan keuangan untuk pengguna yang sedang login.

- **URL:** `/finance/user`
- **Metode:** `GET`
- **Autentikasi:** Diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  [
    {
      "id": "number",
      "user_id": "number",
      "room_id": "number",
      "bulan": "string",
      "tahun": "number",
      "jumlah": "number",
      "status": "string",
      "bukti_pembayaran": "string",
      "ruangan": "string"
    }
  ]
  ```
- **Respons Error:** `401 Unauthorized`, `500 Internal Server Error`

#### Membuat Laporan Keuangan

Membuat laporan keuangan baru.

- **URL:** `/finance`
- **Metode:** `POST`
- **Autentikasi:** Diperlukan
- **Body Permintaan:** Menggunakan `multipart/form-data` untuk unggah file
  ```json
  {
    "user_id": "number",
    "room_id": "number",
    "bulan": "string",
    "tahun": "number",
    "jumlah": "number",
    "status": "string", // Opsional, default ke "pending"
    "bukti_pembayaran": "file" // Unggahan file gambar
  }
  ```
- **Respons Sukses:** `201 Created`
  ```json
  {
    "id": "number",
    "user_id": "number",
    "room_id": "number",
    "bulan": "string",
    "tahun": "number",
    "jumlah": "number",
    "status": "string",
    "bukti_pembayaran": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

#### Memperbarui Status Laporan Keuangan

Memperbarui status laporan keuangan (hanya admin).

- **URL:** `/finance/:id`
- **Metode:** `PUT`
- **Autentikasi:** Diperlukan (Peran Admin)
- **Body Permintaan:**
  ```json
  {
    "status": "string" // "pending", "verified", atau "rejected"
  }
  ```
- **Respons Sukses:** `200 OK`
  ```json
  {
    "id": "number",
    "user_id": "number",
    "room_id": "number",
    "bulan": "string",
    "tahun": "number",
    "jumlah": "number",
    "status": "string",
    "bukti_pembayaran": "string"
  }
  ```
- **Respons Error:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

## Feedback

### Endpoint Feedback

#### Mendapatkan Semua Feedback

Mengembalikan daftar semua entri feedback.

- **URL:** `/feedback`
- **Metode:** `GET`
- **Autentikasi:** Tidak diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  [
    {
      "id": "number",
      "user_id": "number",
      "user_name": "string",
      "comment": "string",
      "rating": "number",
      "created_at": "string"
    }
  ]
  ```
- **Respons Error:** `500 Internal Server Error`

#### Mendapatkan Feedback berdasarkan ID

Mengembalikan detail entri feedback tertentu.

- **URL:** `/feedback/:id`
- **Metode:** `GET`
- **Autentikasi:** Tidak diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  {
    "id": "number",
    "user_id": "number",
    "user_name": "string",
    "comment": "string",
    "rating": "number",
    "created_at": "string"
  }
  ```
- **Respons Error:** `404 Not Found`, `500 Internal Server Error`

#### Membuat Feedback

Membuat entri feedback baru.

- **URL:** `/feedback`
- **Metode:** `POST`
- **Autentikasi:** Tidak diperlukan
- **Body Permintaan:**
  ```json
  {
    "comment": "string",
    "user_name": "string", // Opsional, default ke "Anonymous User"
    "rating": "number", // Opsional, default ke 5
    "user_id": "number" // Opsional
  }
  ```
- **Respons Sukses:** `201 Created`
  ```json
  {
    "id": "number",
    "user_id": "number",
    "user_name": "string",
    "comment": "string",
    "rating": "number",
    "created_at": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `500 Internal Server Error`

## Tentang Kami

### Endpoint Tentang Kami

#### Mendapatkan Konten Tentang Kami

Mengembalikan konten "Tentang Kami".

- **URL:** `/about`
- **Metode:** `GET`
- **Autentikasi:** Tidak diperlukan
- **Respons Sukses:** `200 OK`
  ```json
  {
    "id": "number",
    "title": "string",
    "content": "string",
    "created_at": "string",
    "updated_at": "string"
  }
  ```
- **Respons Error:** `404 Not Found`, `500 Internal Server Error`

#### Memperbarui Konten Tentang Kami

Memperbarui konten "Tentang Kami" (hanya admin).

- **URL:** `/about/:id`
- **Metode:** `PUT`
- **Autentikasi:** Diperlukan (Peran Admin)
- **Body Permintaan:**
  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```
- **Respons Sukses:** `200 OK`
  ```json
  {
    "id": "number",
    "title": "string",
    "content": "string",
    "created_at": "string",
    "updated_at": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

## Unggah File

### Endpoint Unggah

#### Unggah Gambar

Mengunggah file gambar.

- **URL:** `/upload/image`
- **Metode:** `POST`
- **Autentikasi:** Diperlukan
- **Body Permintaan:** `multipart/form-data` dengan field file bernama "image"
- **Respons Sukses:** `200 OK`
  ```json
  {
    "imageUrl": "string"
  }
  ```
- **Respons Error:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

## Kode Error

- `400 Bad Request` - Permintaan tidak valid atau tidak dapat diproses
- `401 Unauthorized` - Autentikasi diperlukan atau autentikasi gagal
- `403 Forbidden` - Pengguna yang terautentikasi tidak memiliki izin
- `404 Not Found` - Sumber daya yang diminta tidak dapat ditemukan
- `500 Internal Server Error` - Terjadi kesalahan tak terduga di server

## Catatan

- Semua nilai tanggal-waktu dikembalikan dalam format ISO 8601.
- URL gambar yang dikembalikan oleh API bersifat relatif terhadap URL dasar. Untuk mengakses gambar, gunakan `http://localhost:3000/uploads/<path_gambar>`.
- API ini menggunakan PostgreSQL sebagai database.
