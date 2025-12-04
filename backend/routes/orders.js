const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, requireRole('customer'), async (req, res) => {
  const { car_id, start_date, end_date, payment_method, notes } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO orders (user_id, car_id, start_date, end_date, status, payment_method, notes)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [req.user.id, car_id, start_date, end_date, payment_method, notes]
    );
    res.status(201).json({ id: result.insertId, message: 'Захиалга илгээгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Захиалга амжилтгүй', error: err.message });
  }
});

router.get('/', verifyToken, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.*, u.email, c.name AS car_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN cars c ON o.car_id = c.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Захиалгын жагсаалт алдаа', error: err.message });
  }
});

router.patch('/:id/status', verifyToken, requireRole('manager', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.execute('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ message: 'Төлөв шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Төлөв солиход алдаа', error: err.message });
  }
});

router.post('/:id/cancel', verifyToken, requireRole('customer'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('UPDATE orders SET status="cancelled" WHERE id=? AND user_id=?', [id, req.user.id]);
    res.json({ message: 'Захиалга цуцлагдлаа' });
  } catch (err) {
    res.status(400).json({ message: 'Цуцлахад алдаа', error: err.message });
  }
});

module.exports = router;
