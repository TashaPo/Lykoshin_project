// Этот компонент будет основным и будет 
// содержать навигацию между различными видами 
// календаря

import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import Login from './Login'; // Импортируйте компонент Login
import Register from './Register'; // Импортируйте компонент Register
import './styles/Calendar.css'; // Убедитесь, что этот файл существует

const Calendar = ({ userId }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние для авторизации
    const location = useLocation(); // Получаем текущий путь

    const handleDayClick = (date) => {
        setSelectedDate(date);
    };

    const handleLogin = () => {
        // Логика авторизации
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        // Логика выхода
        setIsAuthenticated(false);
    };

    // Проверяем, находимся ли мы на странице входа или регистрации
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div>
            {!isAuthPage && ( // Условный рендеринг меню
                <nav style={{ height: '50px', display: 'flex', alignItems: 'center', backgroundColor: '#166582', padding: '0 20px' }}>
                    {/* Первая часть: изменение вида календаря */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/day" onClick={() => handleDayClick(selectedDate)} style={{ color: '#ffffff', marginRight: '20px' }}>День</Link>
                        <Link to="/week" style={{ color: '#ffffff', marginRight: '20px' }}>Неделя</Link>
                        <Link to="/month" style={{ color: '#ffffff', marginRight: '20px' }}>Месяц</Link>
                        <Link to="/year" style={{ color: '#ffffff', marginRight: '20px' }}>Год</Link>
                    </div>

                    {/* Вторая часть: пустая */}
                    <div style={{ flexGrow: 1 }}></div>

                    {/* Третья часть: авторизация и добавление события */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/add-event" style={{ color: '#ffffff', marginRight: '20px' }}>Добавить событие</Link>
                                <button onClick={handleLogout} style={{ backgroundColor: '#ffffff', color: '#166582', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Выйти</button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button style={{ backgroundColor: '#ffffff', color: '#166582', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Войти</button>
                            </Link>
                        )}
                    </div>
                </nav>
            )}
            <Routes>
                <Route path="/day" element={<DayView userId={userId} date={selectedDate} />} />
                <Route path="/week" element={<WeekView />} />
                <Route path="/month" element={<MonthView userId={userId} onDayClick={handleDayClick} />} />
                <Route path="/year" element={<YearView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* Добавьте маршрут для регистрации */}
                <Route path="/" element={<MonthView userId={userId} onDayClick={handleDayClick} />} />
            </Routes>
        </div>
    );
};

export default Calendar;