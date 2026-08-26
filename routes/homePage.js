const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM messages ORDER BY created_at ASC');
    const [users] = await db.query('SELECT name FROM users ORDER BY name ASC');
    
    res.render('index', { messages, users });
  } catch (err) {
    res.status(500).send('Error loading chat: ' + err.message);
  }
});

module.exports = router;