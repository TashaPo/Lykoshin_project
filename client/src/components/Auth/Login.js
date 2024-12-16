import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь должна быть логика для аутентификации
        // Если аутентификация успешна, перенаправляем на главную страницу
        navigate('/'); // Замените на путь к главной странице
    };

    return (
        <div>
            <h2>Вход</h2>
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
                <div>
                    <label>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></label>
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;