// src/components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL); // Отладочный вывод

        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
                username,
                password,
            });                      
            if (response.status === 201) {
                alert('Регистрация успешна! Теперь вы можете войти.');
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message);
                alert(error.response.data.message);
            } else {
                console.error('Ошибка при регистрации:', error);
                alert('Ошибка при регистрации');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1>Регистрация</h1>
                <form onSubmit={handleRegister}>
                    <label style={styles.label}>Введите логин:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Введите пароль:</label>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={styles.input}
                        required
                    />
                    <div style={styles.checkboxContainer}>
                        <input 
                            type="checkbox" 
                            id="showPassword" 
                            checked={showPassword} 
                            onChange={() => setShowPassword(!showPassword)} 
                            style={styles.checkbox}
                        />
                        <label htmlFor="showPassword" style={styles.checkboxLabel}>Показать пароль</label>
                    </div>
                    <label style={styles.label}>Повторите пароль:</label>
                    <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        style={styles.input}
                        required
                    />
                    <div style={styles.checkboxContainer}>
                        <input 
                            type="checkbox" 
                            id="showConfirmPassword" 
                            checked={showConfirmPassword} 
                            onChange={() => setShowConfirmPassword(!showConfirmPassword)} 
                            style={styles.checkbox}
                        />
                        <label htmlFor="showConfirmPassword" style={styles.checkboxLabel}>Показать пароль</label>
                    </div>
                    <Link to="/login" style={styles.link}>Уже есть аккаунт? Войти</Link>
                    <button type="submit" style={styles.button}>Зарегистрироваться</button>
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
        justifyContent: 'center',
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

export default Register;
