const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Contoh data dummy
let users = [
    { id: 1, nama: 'Athala' },
    { id: 2, nama: 'Nara' }
  ];
  
  // GET semua user
  app.get('/users', (req, res) => {
    res.json(users);
  });
  
  // GET user by ID
  app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  });
  
  // POST user baru
  app.post('/users', (req, res) => {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ message: 'Nama harus diisi' });
  
    const newUser = {
      id: users.length + 1,
      nama
    };
  
    users.push(newUser);
    res.status(201).json({ message: 'User ditambahkan', user: newUser });
  });
  
  // PUT update user (seluruh data)
  app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ message: 'Nama harus diisi' });
  
    user.nama = nama;
    res.json({ message: 'User diperbarui', user });
  });
  
  // PATCH update sebagian data user
  app.patch('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  
    const { nama } = req.body;
    if (nama) user.nama = nama;
  
    res.json({ message: 'User diubah sebagian', user });
  });
  
  // DELETE user
  app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ message: 'User tidak ditemukan' });
  
    const deletedUser = users.splice(userIndex, 1);
    res.json({ message: 'User dihapus', user: deletedUser[0] });
  });
  
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});