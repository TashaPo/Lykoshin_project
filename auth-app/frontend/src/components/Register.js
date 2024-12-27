import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setErrorMessage('Пароли не совпадают');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });
            const data = await response.json();
    
            if (response.ok) {
                navigate('/login');
            } else {
                setErrorMessage(data.message || 'Ошибка при регистрации');
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            setErrorMessage('Ошибка подключения к серверу');
        }
    };    

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1>Регистрация</h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleRegister}>
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
                    <label style={styles.label}>Введите пароль повторно:</label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                    />
                    <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            id="showConfirmPassword"
                            checked={showConfirmPassword}
                            onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.checkbox}
                        />
                        <label htmlFor="showConfirmPassword" style={styles.checkboxLabel}>
                            Показать пароль
                        </label>
                    </div>
                    <div><Link to="/login">Уже есть аккаунт? Войти</Link></div>
                    <button style={styles.button} type="submit">Зарегистрироваться</button>
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

export default Register;