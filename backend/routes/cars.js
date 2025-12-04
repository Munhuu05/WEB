const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, fuel, power, type } = req.query;
  const conditions = [];
  const values = [];

  if (category) { conditions.push('c.category_id = ?'); values.push(category); }
  if (type) { conditions.push('c.type_id = ?'); values.push(type); }
  if (fuel) { conditions.push('c.fuel_type = ?'); values.push(fuel); }
  if (power) { conditions.push('c.power_hp >= ?'); values.push(power); }
  if (minPrice) { conditions.push('c.daily_price >= ?'); values.push(minPrice); }
  if (maxPrice) { conditions.push('c.daily_price <= ?'); values.push(maxPrice); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.image_url, c.daily_price, c.fuel_type, c.power_hp,
              cc.name AS category, ct.name AS type
       FROM cars c
       LEFT JOIN car_categories cc ON c.category_id = cc.id
       LEFT JOIN car_types ct ON c.type_id = ct.id
       ${where}
       ORDER BY c.created_at DESC`
      , values
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Машины жагсаалт авахад алдаа гарлаа', error: err.message });
  }
});

router.post('/', verifyToken, requireRole('admin', 'manager'), async (req, res) => {
  const { name, category_id, type_id, daily_price, fuel_type, power_hp, image_url, notes } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO cars (name, category_id, type_id, daily_price, fuel_type, power_hp, image_url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category_id, type_id, daily_price, fuel_type, power_hp, image_url, notes]
    );
    res.status(201).json({ id: result.insertId, message: 'Машин нэмэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Машин нэмэхэд алдаа', error: err.message });
  }
});

router.put('/:id', verifyToken, requireRole('admin', 'manager'), async (req, res) => {
  const { id } = req.params;
  const { name, category_id, type_id, daily_price, fuel_type, power_hp, image_url, notes } = req.body;
  try {
    await pool.execute(
      `UPDATE cars SET name=?, category_id=?, type_id=?, daily_price=?, fuel_type=?, power_hp=?, image_url=?, notes=? WHERE id=?`,
      [name, category_id, type_id, daily_price, fuel_type, power_hp, image_url, notes, id]
    );
    res.json({ message: 'Мэдээлэл шинэчлэгдлээ' });
  } catch (err) {
    res.status(400).json({ message: 'Шинэчлэхэд алдаа', error: err.message });
  }
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM cars WHERE id=?', [id]);
    res.json({ message: 'Устгалаа' });
  } catch (err) {
    res.status(400).json({ message: 'Устгахад алдаа', error: err.message });
  }
});

module.exports = router;
