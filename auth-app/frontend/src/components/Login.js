import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Для состояния загрузки
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Установить состояние загрузки
        setErrorMessage(''); // Очистить предыдущее сообщение об ошибке

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
                navigate('/month');
            } else {
                setErrorMessage(data.message || 'Ошибка при входе');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setErrorMessage('Ошибка подключения к серверу');
        } finally {
            setIsLoading(false); // Снять состояние загрузки
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1>Вход</h1>
                {errorMessage && (
                    <div style={styles.errorMessage}>{errorMessage}</div>
                )}
                <form onSubmit={handleLogin}>
                    <label style={styles.label}>Введите логин:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        autoFocus
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
                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            backgroundColor: isLoading ? '#cccccc' : '#19789c',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
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
        width: '90%',
        maxWidth: '400px',
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
        width: '50%',
        border: 'none',
        backgroundColor: '#19789c',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '20px',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
        justifyContent: 'flex-start', // Выравнивание по левому краю
        paddingLeft: '10%',
    },
    checkbox: {
        marginRight: '10px',
    },
    checkboxLabel: {
        cursor: 'pointer',
    },
    label: {
        display: 'block',
        textAlign: 'left',
        width: '80%',
        marginLeft: '10%',
    },
    link: {
        display: 'block',
        marginTop: '10px',
        textDecoration: 'none',
        color: '#19789c',
    },
};

export default Login;