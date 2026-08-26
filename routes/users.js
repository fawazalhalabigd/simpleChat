const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET /users - Render user list
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.render('users', { users, editUser: null });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /users/edit/:id - Render user edit form
router.get('/edit/:id', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    const [allUsers] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.render('users', { users: allUsers, editUser: users[0] || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST /users/create - Create new user
router.post('/create', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  try {
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.redirect('/users');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).send('User with this email or username already exists.');
    }
    res.status(500).send(err.message);
  }
});

// POST /users/update/:id - Update user details
router.post('/update/:id', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [name, email, password, req.params.id]
    );
    res.redirect('/users');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST /users/delete/:id - Delete user
router.post('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;