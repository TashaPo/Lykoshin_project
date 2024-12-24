const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5432; // Порт для вашего сервера

// Настройка пула соединений с базой данных
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'calendar_db',
    password: '1234',
    port: 5432, // Порт для PostgreSQL
});

// Middleware для обработки CORS
app.use(cors());
app.use(express.json()); // Для обработки JSON-данных

// Пример маршрута для получения данных из таблицы users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});