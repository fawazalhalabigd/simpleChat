const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'chat_db'
});

con.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// ==========================================
// 1. MESSAGES CRUD & PAGES
// ==========================================

// READ: Render Chat Room
app.get('/', (req, res) => {
  con.query('SELECT * FROM messages ORDER BY created_at ASC', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.render('index', { messages: results });
  });
});

// READ (API): Get all messages
app.get('/api/messages', (req, res) => {
  con.query('SELECT * FROM messages ORDER BY created_at ASC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// CREATE: Add new message
app.post('/api/messages', (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).json({ error: 'Missing fields' });

  con.query('INSERT INTO messages (text, username) VALUES (?, ?)', [text, username], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// UPDATE: Edit message text
app.post('/api/messages/update/:id', (req, res) => {
  const { text } = req.body;
  con.query('UPDATE messages SET text = ? WHERE id = ?', [text, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE: Remove a message
app.post('/api/messages/delete/:id', (req, res) => {
  con.query('DELETE FROM messages WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ==========================================
// 2. USERS CRUD & PAGES
// ==========================================

// READ: List all users & show create form
app.get('/users', (req, res) => {
  con.query('SELECT * FROM users ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.render('users', { users: results, editUser: null });
  });
});

// READ: Render single user for editing
app.get('/users/edit/:id', (req, res) => {
  con.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    con.query('SELECT * FROM users ORDER BY created_at DESC', (err2, allUsers) => {
      if (err2) return res.status(500).send(err2.message);
      res.render('users', { users: allUsers, editUser: results[0] || null });
    });
  });
});

// CREATE: Add user
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  con.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect('/users');
  });
});

// UPDATE: Modify user details
app.post('/api/users/update/:id', (req, res) => {
  const { name, email, password } = req.body;
  con.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, req.params.id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect('/users');
  });
});

// DELETE: Remove user
app.post('/api/users/delete/:id', (req, res) => {
  con.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect('/users');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));