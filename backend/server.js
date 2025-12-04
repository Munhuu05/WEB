const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const driverRoutes = require('./routes/driver');
const seedDefaultData = require('./utils/seedData');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/driver', driverRoutes);

seedDefaultData();

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint олдсонгүй' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server http://localhost:${port}`);
});
