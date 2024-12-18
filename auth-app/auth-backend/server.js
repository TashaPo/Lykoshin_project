const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Временное хранилище пользователей (сделать как БДы)
let users = [];

// Регистрация пользователя
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Проверка на существование пользователя
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
});

// Вход пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Поиск пользователя
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка пароля
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ token: null, message: 'Неверный пароль' });
    }

    // Генерация токена
    const token = jwt.sign({ id: user.username }, 'secret', { expiresIn: 86400 }); // 24 часа
    res.status(200).json({ token });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});