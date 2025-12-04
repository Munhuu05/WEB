const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role = 'customer' } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hashed, role]
    );
    res.status(201).json({ message: 'Амжилттай бүртгэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Бүртгэл амжилтгүй', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Нууц үг буруу' });
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'local-secret',
      { expiresIn: '12h' }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Нэвтрэхэд алдаа гарлаа', error: err.message });
  }
});

router.post('/password/reset', async (req, res) => {
  const { email, phone } = req.body;
  // Token based reset stub
  res.json({ message: 'Сэргээх холбоос явууллаа', email, phone });
});

module.exports = router;
