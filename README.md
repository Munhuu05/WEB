# MN Car Rental

Энэ бол Express + MySQL ба HTML/CSS/JavaScript ашигласан энгийн full-stack "Автомашин түрээс" жишээ. UI нь Монгол хэл дээр бөгөөд REST API нь Admin, Manager, Customer, Driver эрхүүдийг дэмжинэ.

## Суурилуулах
1. `npm install`
2. `.env.example`-ийг `.env` болгон хуулж, MySQL холболтын мэдээлэлээ тохируулна.
3. `sql/schema.sql` файлыг ашиглан MySQL дээр хүснэгтүүдээ үүсгэнэ.
4. `npm start` командыг ажиллуулж API серверээ асаана (анхдагч порт 4000).
   - Сервер анх асахдаа `cars` хүснэгт хоосон бол 6 ширхэг демо машины мэдээллийг автоматаар MySQL-д нэмнэ.

## Фронтенд
`public/` директорт байгаа HTML/CSS/JS нь серверээс статик байдлаар үйлчилгээ үзүүлнэ. Логин, машин хайлт, захиалга үүсгэх болон жолоочийн хүргэлтийн мэдээлэл үзэх энгийн загварууд багтсан.

## REST API бүтэц
- `/api/auth` – нэвтрэх, бүртгэл, нууц үг сэргээх
- `/api/cars` – машин жагсаалт (шүүлтүүртэй), CRUD (админ/менежер)
- `/api/orders` – захиалга үүсгэх, жагсаах, төлөв солих, цуцлах
- `/api/admin` – хэрэглэгч хайх, эрх солих, ангилал/төрөл нэмэх, төлбөрийн тохиргоо
- `/api/manager` – захиалгын төлөв хянах, урамшуулал тохируулах
- `/api/driver` – жолоочийн даалгавар болон хүргэлтийн төлөв шинэчлэх

### Жишээ хүсэлтүүд
- **Нэвтрэх**: `POST /api/auth/login` `{ email, password }`
- **Машин шүүх**: `GET /api/cars?category=1&minPrice=50000&fuel=electric`
- **Захиалга үүсгэх**: `POST /api/orders` `{ car_id, start_date, end_date, payment_method, notes }`
- **Захиалгын төлөв солих** (manager/admin): `PATCH /api/orders/:id/status` `{ status: 'confirmed' }`
- **Хүргэлтийн төлөв** (driver): `PATCH /api/driver/orders/:id/delivery` `{ delivery_status: 'in_progress' }`

Бүх JWT токен `Authorization: Bearer <token>` толгой дээр дамжина.

## Техникийн шаардлага
- Express router-уудыг модульчлан задласан (`backend/routes/*`)
- MySQL pool (`backend/config/db.js`) болон bcrypt/JWT ашигласан нууцлал
- Шүүлтүүртэй SQL асуулга (`/api/cars`)
- Парент/child харьяаллыг FK-ээр баталгаажуулсан `sql/schema.sql`

