const pool = require('../config/db');

const defaultCars = [
  {
    name: 'Toyota Camry',
    daily_price: 85000,
    fuel_type: 'Бензин',
    power_hp: 203,
    image_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    notes: 'Тохиромжтой, найдвартай суудлын автомашин. Хотын болон хөдөө аялалд тохиромжтой.'
  },
  {
    name: 'Honda CR-V',
    daily_price: 95000,
    fuel_type: 'Бензин',
    power_hp: 190,
    image_url: 'https://images.unsplash.com/photo-1549394656-7b5b2d1b866c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    notes: 'Орон зайн SUV, гэр бүлийн аялалд хамгийн тохиромжтой сонголт.'
  },
  {
    name: 'BMW 3 Series',
    daily_price: 120000,
    fuel_type: 'Бензин',
    power_hp: 255,
    image_url: 'https://th.bing.com/th/id/R.c7e4042ecb93b84607bf3c7323bd0327?rik=27qhwh4YaFhYhA&riu=http%3a%2f%2fcdn.bmwblog.com%2fwp-content%2fuploads%2f2015%2f05%2f2015-bmw-3-series-sedan-images-07.jpg&ehk=PCyuIpvlJS%2bsiAt%2fFXxEQYI53%2bPREPvgIyaJuIfrfyI%3d&risl=&pid=ImgRaw&r=0',
    notes: 'Спортын загварын люкс автомашин. Хурд, тогтвортой байдал, загварын төгс хослол.'
  },
  {
    name: 'Mercedes-Benz C-Class',
    daily_price: 130000,
    fuel_type: 'Бензин',
    power_hp: 255,
    image_url: 'https://images.unsplash.com/photo-1617654112368-ac309ce37b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    notes: 'Германы чанар, тансаг загвар. Бизнес уулзалт, тусгай үйл явдалд тохиромжтой.'
  },
  {
    name: 'Audi A4',
    daily_price: 115000,
    fuel_type: 'Бензин',
    power_hp: 261,
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    notes: 'Технологи, гүйцэтгэл, загварын төгс хослол. Quattro 4-дугуйт хөтлөгчтэй.'
  },
  {
    name: 'Toyota RAV4',
    daily_price: 90000,
    fuel_type: 'Бензин',
    power_hp: 203,
    image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    notes: 'Их бие, найдвартай SUV. Бүх замд тохиромжтой, багтаамжтай.'
  }
];

async function seedCars() {
  const [rows] = await pool.execute('SELECT COUNT(*) AS count FROM cars');
  if (rows[0].count > 0) return;

  for (const car of defaultCars) {
    // eslint-disable-next-line no-await-in-loop
    await pool.execute(
      `INSERT INTO cars (name, daily_price, fuel_type, power_hp, image_url, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [car.name, car.daily_price, car.fuel_type, car.power_hp, car.image_url, car.notes]
    );
  }
}

async function seedDefaultData() {
  try {
    await seedCars();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Анхны мэдээлэл нэмэхэд алдаа гарлаа:', err.message);
  }
}

module.exports = seedDefaultData;
