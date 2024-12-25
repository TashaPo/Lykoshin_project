// src/components/MonthView.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const MonthView = () => {
    const { user } = useContext(AuthContext);
    const [calendarData, setCalendarData] = useState(null);

    useEffect(() => {
        console.log('User:', user); // Отладочный вывод
        if (user && user.userId) {
            // Ваш код для загрузки данных календаря
            axios.get(`${process.env.REACT_APP_API_URL}/calendar/${user.userId}`)
                .then(response => {
                    setCalendarData(response.data);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке календаря:', error);
                });
        } else {
            console.error('userId не определен');
        }
    }, [user]);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h2>Добро пожаловать, {user.username}</h2>
            {/* Ваш код для отображения календаря */}
            {calendarData ? (
                <div>
                    {/* Отображение данных календаря */}
                </div>
            ) : (
                <p>Загрузка календаря...</p>
            )}
        </div>
    );
};

export default MonthView;
