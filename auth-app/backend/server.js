const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Настройка пула соединений с базой данных
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware для обработки CORS и JSON
app.use(cors());
app.use(express.json());

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user; // Сохраняем информацию о пользователе в запросе
    next();
  });
};

// Маршрут для регистрации пользователя
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Аккаунт уже зарегистрирован ранее' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'Регистрация успешна', user: newUser.rows[0] });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Маршрут для входа пользователя
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    // Генерация JWT токена
    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Вход успешен', token });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Маршрут для получения событий пользователя
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const eventsResult = await pool.query('SELECT * FROM events WHERE user_id = $1', [req.user.id]);
    res.status(200).json(eventsResult.rows);
  } catch (error) {
    console.error('Ошибка при получении событий:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Маршрут для получения задач пользователя
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasksResult = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.id]);
    res.status(200).json(tasksResult.rows);
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Маршрут для создания события
app.post('/api/events', authenticateToken, async (req, res) => {
    const { userId, title, description, event_date } = req.body;
  
    try {
      const newEvent = await pool.query(
        'INSERT INTO events (user_id, title, description, event_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, title, description, event_date]
      );
  
      res.status(201).json({ message: 'Событие добавлено', event: newEvent.rows[0] });
    } catch (error) {
      console.error('Ошибка при добавлении события:', error);
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  });

// Обработка других маршрутов (например, для 404)
app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});