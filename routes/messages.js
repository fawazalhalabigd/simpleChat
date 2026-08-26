const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET /api/messages
router.get('/', async (req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM messages ORDER BY created_at ASC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/messages (Last 10 minutes only)
router.get('/getUpdated/massages', async (req, res) => {
  try {
    const query = `
      SELECT * FROM messages 
      WHERE created_at >= NOW() - INTERVAL 10 MINUTE 
      ORDER BY created_at ASC
    `;
    const [messages] = await db.query(query);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST /api/messages - Post message with password authentication
router.post('/', async (req, res) => {
  const { username, password, text } = req.body;
  if (!username || !password || !text) {
    return res.status(400).json({ error: 'Username, password, and text are required.' });
  }

  try {
    // Check if user exists and password matches
    const [users] = await db.query('SELECT * FROM users WHERE name = ? AND password = ?', [username, password]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid user password.' });
    }

    await db.query('INSERT INTO messages (text, username) VALUES (?, ?)', [text, username]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages/update/:id
router.post('/update/:id', async (req, res) => {
  const { text } = req.body;
  try {
    await db.query('UPDATE messages SET text = ? WHERE id = ?', [text, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages/delete/:id
router.post('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;