const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Добавь JWT
require('dotenv').config(); // Добавь dotenv

const app = express();
const port = 5000;

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

// Маршрут регистрации
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        console.error('Ошибка: не все поля заполнены.');
        return res.status(400).send({ message: 'Все поля обязательны' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Хэширование пароля
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [username, hashedPassword]
        );
        console.log('Пользователь создан:', result.rows[0]);
        res.status(201).send({ message: 'Пользователь зарегистрирован', user: result.rows[0] });
    } catch (error) {
        console.error('Ошибка на сервере при создании пользователя:', error);
        if (error.code === '23505') { // Уникальное ограничение
            return res.status(400).send({ message: 'Имя пользователя уже существует' });
        }
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Маршрут входа
app.post('/login', async (req, res) => { // Измени маршрут на /login
    const { username, password } = req.body;
    if (!username || !password) {
        console.error('Ошибка: не все поля заполнены.');
        return res.status(400).send({ message: 'Все поля обязательны' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).send({ message: 'Неверные имя пользователя или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Неверные имя пользователя или пароль' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).send({ token });
    } catch (error) {
        console.error('Ошибка на сервере при входе пользователя:', error);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Пример маршрута для получения событий
app.get('/api/events', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).send({ message: 'userId обязателен' });
    }
    try {
        const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [userId]);
        res.status(200).json({ events: result.rows });
    } catch (error) {
        console.error('Ошибка при получении событий:', error.message);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
