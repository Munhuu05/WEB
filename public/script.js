const API = '/api';
let token = '';

const authStatus = document.getElementById('authStatus');
const carList = document.getElementById('carList');
const driverOrders = document.getElementById('driverOrders');
const orderStatus = document.getElementById('orderStatus');

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Алдаа' }));
    throw new Error(error.message);
  }
  return res.json();
}

async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  token = data.token;
  authStatus.textContent = `Амжилттай нэвтэрлээ. Эрх: ${data.role}`;
  authStatus.classList.remove('muted');
  refreshCars();
  if (data.role === 'driver') loadDriverOrders();
}

async function register(email, password) {
  await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  authStatus.textContent = 'Бүртгэл амжилттай. Одоо нэвтэрнэ үү.';
}

async function refreshCars() {
  const params = new URLSearchParams();
  ['category', 'minPrice', 'maxPrice', 'fuel', 'power'].forEach(key => {
    const el = document.getElementById(`filter${key.charAt(0).toUpperCase() + key.slice(1)}`);
    if (el && el.value) params.append(key, el.value);
  });
  try {
    const cars = await apiFetch(`/cars?${params.toString()}`);
    carList.innerHTML = cars.map(c => `
      <article class="card">
        <img src="${c.image_url || 'https://placehold.co/400x240'}" alt="${c.name}" />
        <h3>${c.name}</h3>
        <p>${c.category || ''} · ${c.type || ''}</p>
        <p class="muted">₮${c.daily_price}/өдөр · ${c.fuel_type}</p>
      </article>
    `).join('');
  } catch (err) {
    carList.innerHTML = `<p class="muted">${err.message}</p>`;
  }
}

async function createOrder(payload) {
  const data = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  orderStatus.textContent = data.message;
}

async function loadDriverOrders() {
  try {
    const orders = await apiFetch('/driver/orders');
    driverOrders.innerHTML = orders.map(o => `
      <article class="card">
        <h4>#${o.id} · ${o.car_name}</h4>
        <p>Төлөв: ${o.delivery_status || 'Хүлээгдэж байна'}</p>
        <p class="muted">Маршрут: ${o.delivery_route || 'Тун удахгүй'}</p>
      </article>
    `).join('');
  } catch (err) {
    driverOrders.innerHTML = `<p class="muted">${err.message}</p>`;
  }
}

// Events
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login(document.getElementById('email').value, document.getElementById('password').value)
    .catch(err => authStatus.textContent = err.message);
});

const registerBtn = document.getElementById('registerBtn');
registerBtn.addEventListener('click', () => {
  register(document.getElementById('email').value, document.getElementById('password').value)
    .catch(err => authStatus.textContent = err.message);
});

document.getElementById('searchCars').addEventListener('click', refreshCars);

const orderForm = document.getElementById('orderForm');
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = {
    car_id: Number(document.getElementById('orderCar').value),
    start_date: document.getElementById('startDate').value,
    end_date: document.getElementById('endDate').value,
    payment_method: document.getElementById('paymentMethod').value,
    notes: document.getElementById('orderNotes').value
  };
  createOrder(payload).catch(err => orderStatus.textContent = err.message);
});

refreshCars();
