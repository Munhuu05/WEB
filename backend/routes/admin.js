const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, requireRole('admin'));

router.get('/users', async (req, res) => {
  const { q } = req.query;
  const search = q ? `%${q}%` : '%';
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, phone, role, is_active FROM users WHERE email LIKE ? OR phone LIKE ? ORDER BY created_at DESC',
      [search, search]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Хэрэглэгч хайхад алдаа', error: err.message });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role, is_active } = req.body;
  try {
    await pool.execute('UPDATE users SET role=?, is_active=? WHERE id=?', [role, is_active ?? 1, id]);
    res.json({ message: 'Эрх шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Эрх солиход алдаа', error: err.message });
  }
});

router.post('/categories', async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO car_categories (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ id: result.insertId, message: 'Ангилал нэмэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Ангилал нэмэхэд алдаа', error: err.message });
  }
});

router.post('/types', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO car_types (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, message: 'Төрөл нэмэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Төрөл нэмэхэд алдаа', error: err.message });
  }
});

router.put('/payment/config', async (req, res) => {
  const { provider, api_key, enabled } = req.body;
  try {
    await pool.execute(
      'INSERT INTO payment_configs (provider, api_key, enabled) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE api_key=?, enabled=?',
      [provider, api_key, enabled, api_key, enabled]
    );
    res.json({ message: 'Төлбөрийн тохиргоо шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Тохиргоо хадгалахад алдаа', error: err.message });
  }
});

module.exports = router;
