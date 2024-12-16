import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const existingUsers = ['user1@example.com', 'user2@example.com']; // Пример существующих пользователей

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Проверка на совпадение паролей
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        // Проверка на уникальность логина
        if (existingUsers.includes(email)) {
            setError('Такой логин уже существует');
            return;
        }

        // Здесь должна быть логика для регистрации
        // Если регистрация успешна, перенаправляем на страницу входа
        navigate('/login'); // Замените на путь к странице входа
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <label>Введите логин:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Введите пароль:</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Показать пароль
                </label>
                <label>Введите пароль повторно:</label>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={showConfirmPassword}
                        onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                    Показать пароль
                </label>
                {error && <p style={{ color: 'red', fontSize: 'small' }}>{error}</p>}
                <button type="submit">Зарегистрироваться</button>
            </form>
            <div>
                <label>Уже есть аккаунт? <Link to="/login">Войти</Link></label>
            </div>
        </div>
    );
};

export default Register;