const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Настройка подключения к базе данных
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

// Маршрут для регистрации пользователей
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(400).json({ error: 'Ошибка регистрации' });
    }
});

// Маршрут для входа пользователей
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Неверный пароль' });
        }
    } else {
        res.status(404).json({ error: 'Пользователь не найден' });
    }
});

// Маршрут для получения событий
app.get('/api/events', async (req, res) => {
    const { userId } = req.query; // Получаем userId из запроса
    try {
        const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка получения событий:', error);
        res.status(500).json({ error: 'Ошибка получения событий' });
    }
});

// Маршрут для добавления событий
app.post('/api/events', async (req, res) => {
    const { userId, title, date, description } = req.body;
    try {
        const result = await pool.query('INSERT INTO events (user_id, title, date, description) VALUES ($1, $2, $3, $4) RETURNING *', [userId, title, date, description]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка добавления события:', error);
        res.status(400).json({ error: 'Ошибка добавления события' });
    }
});