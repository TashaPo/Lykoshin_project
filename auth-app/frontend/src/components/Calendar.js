// Этот компонент будет основным и будет 
// содержать навигацию между различными видами 
// календаря

import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import Login from './Login';
import Register from './Register';
import './styles/Calendar.css';

const Calendar = ({ userId }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    const handleDayClick = (date) => {
        setSelectedDate(date);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div>
            {!isAuthPage && (
                <nav style={navStyle}>
                    <div style={navLinksStyle}>
                        <Link to="/day" onClick={() => handleDayClick(selectedDate)} style={linkStyle}>День</Link>
                        <Link to="/week" style={linkStyle}>Неделя</Link>
                        <Link to="/month" style={linkStyle}>Месяц</Link>
                        <Link to="/year" style={linkStyle}>Год</Link>
                    </div>
                    <div style={{ flexGrow: 1 }}></div>
                    <div style={authStyle}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/add-event" style={linkStyle}>Добавить событие</Link>
                                <button onClick={handleLogout} style={buttonStyle}>Выйти</button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button style={buttonStyle}>Войти</button>
                            </Link>
                        )}
                    </div>
                </nav>
            )}
            <Routes>
                <Route path="/day" element={<DayView userId={userId} date={selectedDate} />} />
                <Route path="/week" element={<WeekView />} />
                <Route path="/month" element={<MonthView userId={userId} onDayClick={handleDayClick} />} />
                <Route path="/year" element={<YearView userId={userId} setSelectedDate={setSelectedDate} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<MonthView userId={userId} onDayClick={handleDayClick} />} />
            </Routes>
        </div>
    );
};

// Стили для навигации
const navStyle = {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#166582',
    padding: '0 20px',
};

// Стили для ссылок в навигации
const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
};

// Стили для ссылок
const linkStyle = {
    color: '#ffffff',
    marginRight: '20px',
};

// Стили для кнопок
const buttonStyle = {
    backgroundColor: '#ffffff',
    color: '#166582',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
};

// Стили для блока авторизации
const authStyle = {
    display: 'flex',
    alignItems: 'center',
};

export default Calendar;