const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, requireRole('driver'));

router.get('/orders', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.id, o.status, o.start_date, o.end_date, o.delivery_status, c.name AS car_name, o.delivery_route
       FROM orders o
       LEFT JOIN cars c ON o.car_id = c.id
       WHERE o.driver_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Хүргэлтийн жагсаалт алдаа', error: err.message });
  }
});

router.patch('/orders/:id/delivery', async (req, res) => {
  const { id } = req.params;
  const { delivery_status } = req.body;
  try {
    await pool.execute('UPDATE orders SET delivery_status=? WHERE id=? AND driver_id=?', [delivery_status, id, req.user.id]);
    res.json({ message: 'Хүргэлтийн төлөв шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Хүргэлт шинэчлэхэд алдаа', error: err.message });
  }
});

module.exports = router;
