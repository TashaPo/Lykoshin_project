// src/components/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Дефолтный импорт

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL); // Отладочный вывод
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Используем jwtDecode как функцию
                // Проверяем, не истёк ли токен
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser({ userId: decoded.userId, username: decoded.username });
                }
            } catch (error) {
                console.error('Invalid token', error);
                setUser(null);
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token); // Используем jwtDecode как функцию
        setUser({ userId: decoded.userId, username: decoded.username });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
