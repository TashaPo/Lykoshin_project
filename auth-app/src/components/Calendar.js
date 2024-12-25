// src/components/Calendar.js
import React, { useState, useContext } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import Login from './Login';
import Register from './Register';
import EventForm from './EventForm';
import { AuthContext } from './AuthContext';
import './styles/Calendar.css'; // Убедитесь, что файл существует

const Calendar = () => {
    const { user, logout } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const location = useLocation();
    const navigate = useNavigate();

    const handleDayClick = (date) => {
        setSelectedDate(date);
        navigate('/day', { state: { selectedDate: date } });
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
                        {user ? (
                            <>
                                <Link to="/add-event" style={linkStyle}>Добавить событие</Link>
                                <button onClick={logout} style={buttonStyle}>Выйти</button>
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
                <Route path="/day" element={<DayView />} />
                <Route path="/week" element={<WeekView />} />
                <Route path="/month" element={<MonthView />} />
                <Route path="/year" element={<YearView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add-event" element={<EventForm />} />
                <Route path="/" element={<MonthView />} />
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
    textDecoration: 'none',
};

// Стили для кнопок
const buttonStyle = {
    backgroundColor: '#ffffff',
    color: '#166582',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
};

// Стили для блока авторизации
const authStyle = {
    display: 'flex',
    alignItems: 'center',
};

export default Calendar;
