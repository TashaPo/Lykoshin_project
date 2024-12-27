const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Настройка подключения к базе данных PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
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
    req.user = user;
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

    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Вход успешен', token });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Универсальный маршрут для сохранения события или задачи
app.post('/api/save', authenticateToken, async (req, res) => {
  const { title, description, start_date, end_date } = req.body;

  try {
    // Преобразование строк дат в объекты Date
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка корректности дат
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Некорректные значения даты или времени' });
    }

    // Корректировка времени для локальной зоны
    const correctStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const correctEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

    // Преобразование дат в строки для сохранения
    const startDateISO = correctStartDate.toISOString().replace('Z', '');
    const endDateISO = correctEndDate.toISOString().replace('Z', '');

    // Проверка на совпадение времени начала и конца
    if (correctStartDate.getTime() === correctEndDate.getTime()) {
      // Сохраняем в таблицу events
      console.log('Сохраняем как событие...');
      console.log('Event Date:', startDateISO);

      const newEvent = await pool.query(
        'INSERT INTO events (user_id, title, description, event_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, title, description, startDateISO]
      );
      return res.status(201).json({ message: 'Event added', event: newEvent.rows[0] });
    } else {
      // Сохраняем в таблицу tasks
      console.log('Сохраняем как задачу...');
      console.log('Start Date:', startDateISO);
      console.log('End Date:', endDateISO);

      const newTask = await pool.query(
        'INSERT INTO tasks (user_id, title, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.user.id, title, description, startDateISO, endDateISO]
      );
      return res.status(201).json({ message: 'Task added', task: newTask.rows[0] });
    }
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Маршрут для получения событий и задач на указанную дату
app.get('/api/schedule', authenticateToken, async (req, res) => {
  const { date } = req.query;

  try {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const events = await pool.query(
      `SELECT 'event' AS type, event_date AS start_time, NULL AS end_time, title, description 
       FROM events 
       WHERE user_id = $1 AND event_date >= $2 AND event_date < $3`,
      [req.user.id, startDate, endDate]
    );

    const tasks = await pool.query(
      `SELECT 'task' AS type, start_date AS start_time, end_date AS end_time, title, description 
       FROM tasks 
       WHERE user_id = $1 AND start_date >= $2 AND start_date < $3`,
      [req.user.id, startDate, endDate]
    );

    // Объединяем и сортируем данные
    const schedule = [...events.rows, ...tasks.rows].sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Ошибка при получении расписания:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
