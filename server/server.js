const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Настройка CORS
app.use(cors());
app.use(bodyParser.json());

// Настройка подключения к базе данных PostgreSQL
const pool = new Pool({
    user: 'postgres', // имя пользователя
    host: 'localhost', // адрес сервера
    database: 'auth_db', // имя базы данных
    password: 1234, // пароль
    port: 5432, // порт PostgreSQL
});

// Эндпоинт для регистрации пользователя
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверка на уникальность логина
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Такой логин уже существует' });
        }

        // Регистрация нового пользователя
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});