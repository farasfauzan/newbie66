const express = require('express');
const mysql = require('mysql2');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// Konfigurasi Koneksi Database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Kosongkan jika pakai XAMPP standar
  database: 'belajar_db'
});


// Cek Koneksi
connection.connect((err) => {
  if (err) {
    console.error('Waduh, koneksi database gagal: ' + err.stack);
    return;
  }
  console.log('Mantap! Terhubung ke database belajar_db sebagai ID ' + connection.threadId);
});

// Rute Home
app.get('/', (req, res) => {
  res.send('<h1>Web Dewa Terhubung Database</h1><a href="/buku">Cek Database Buku</a>');
});

// Rute Ambil Data dari Database (Buku)
app.get('/buku', (req, res) => {
  connection.query('SELECT * FROM buku', (error, results) => {
    if (error) throw error;
   res.render('buku', { dataBuku: results });
  });
});
// Rute untuk menerima data dari form dan menyimpannya ke database
app.post('/tambah-buku', (req, res) => {
    const { judul, penulis } = req.body;
    const query = 'INSERT INTO buku (judul, penulis) VALUES (?, ?)';
    
    connection.query(query, [judul, penulis], (err, result) => {
        if (err) throw err;
        // Setelah berhasil simpan, balikkan user ke halaman daftar buku
        res.redirect('/buku');
    });
});
// Rute untuk menghapus buku berdasarkan ID
app.get('/hapus-buku/:id', (req, res) => {
    const idBuku = req.params.id; // Mengambil ID dari URL
    const query = 'DELETE FROM buku WHERE id = ?';

    connection.query(query, [idBuku], (err, result) => {
        if (err) throw err;
        console.log(`Buku dengan ID ${idBuku} berhasil dihapus`);
        res.redirect('/buku'); // Balik lagi ke daftar buku

         });
});

        // 1. Menampilkan form edit dengan data lama
app.get('/edit-buku/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM buku WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('edit', { buku: results[0] });
    });
});

// 2. Memproses perubahan data (Update)
app.post('/update-buku/:id', (req, res) => {
    const id = req.params.id;
    const { judul, penulis } = req.body;
    connection.query('UPDATE buku SET judul = ?, penulis = ? WHERE id = ?', [judul, penulis, id], (err) => {
        if (err) throw err;
        res.redirect('/buku');
    });
});
   
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});