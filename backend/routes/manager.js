const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, requireRole('manager'));

router.get('/orders', async (_req, res) => {
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

router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.execute('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ message: 'Захиалгын төлөв шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Төлөв солиход алдаа', error: err.message });
  }
});

router.put('/pricing/discount', async (req, res) => {
  const { name, percentage, active_until } = req.body;
  try {
    await pool.execute(
      'INSERT INTO discounts (name, percentage, active_until) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE percentage=?, active_until=?',
      [name, percentage, active_until, percentage, active_until]
    );
    res.json({ message: 'Урамшуулал шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Урамшуулал тохиргоо амжилтгүй', error: err.message });
  }
});

module.exports = router;
