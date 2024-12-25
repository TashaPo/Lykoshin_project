// src/components/Login.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                username,
                password,
            });
            if (response.status === 200) {
                login(response.data.token);
                navigate('/month');
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message);
                alert(error.response.data.message);
            } else {
                console.error('Ошибка при входе:', error);
                alert('Ошибка при входе');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1>Вход</h1>
                <form onSubmit={handleLogin}>
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
                    <Link to="/register" style={styles.link}>Нет аккаунта? Зарегистрируйтесь</Link>
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

export default Login;
