import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/main');
            } else {
                setErrorMessage(data.message || 'Ошибка при входе');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setErrorMessage('Ошибка подключения к серверу');
        }
    };    

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1>Вход</h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleLogin}>
                    <label style={styles.label}>Введите логин:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                    <label style={styles.label}>Введите пароль:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            style={styles.checkbox}
                        />
                        <label htmlFor="showPassword" style={styles.checkboxLabel}>
                            Показать пароль
                        </label>
                    </div>
                    <div><Link to="/register">Нет аккаунта? Зарегистрироваться</Link></div>
                    <button type="submit" style={styles.button}>Войти</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#aec6cf',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: '#e9f7fb',
        borderRadius: '15px',
        padding: '20px',
        width: '90%', // Ширина адаптируемая
        maxWidth: '600px', // Максимальная ширина
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginTop: '10px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '20px',
        width: '30%',
        border: 'none',
        backgroundColor: '#19789c', // Цвет кнопки
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '20px', // Отступ сверху для кнопки
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
        marginTop: '-4px',
    },
    checkbox: {
        marginRight: '10px',
        marginLeft: '50px',
    },
    checkboxLabel: {
        cursor: 'pointer',
    },
    label: {
        marginTop: '20px', // Отступ сверху для label
        display: 'block', // Чтобы label занимал всю ширину
        textAlign: 'left', // Выровнять текст по левому краю
        width: '80%', // Ширина метки
        marginLeft: '9%', // Отступ слева для метки
    },
};

export default Login;