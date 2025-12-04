const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Нэвтэрч орно уу' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'local-secret');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Токен хүчингүй байна' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Эрх хүрэхгүй байна' });
  }
  return next();
};

module.exports = { verifyToken, requireRole };
