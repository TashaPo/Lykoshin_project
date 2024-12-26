import React, { useState } from 'react';
import { Link, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import Login from './Login';
import Register from './Register';
import EventForm from './EventForm'; // Импорт компонента EventForm
import './styles/Calendar.css';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userToken, setUserToken] = useState(localStorage.getItem('token')); // Хранение токена
  const location = useLocation();
  const navigate = useNavigate(); // Хук для навигации

  // Обработчик клика по дню
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  // Обработчик входа
  const handleLogin = (token) => {
    setIsAuthenticated(true);
    setUserToken(token);
    localStorage.setItem('token', token); // Сохраняем токен в localStorage
    navigate('/month'); // Перенаправление на страницу календаря (MonthView)
  };

  // Обработчик выхода
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserToken(null);
    localStorage.removeItem('token'); // Удаляем токен из localStorage
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
  {!isAuthPage && (
    <nav style={navStyle}>
      <div style={sectionStyle}>
        <div style={navLinksStyle}>
          {isAuthenticated && (
            <>
              <Link to="/day" onClick={() => handleDayClick(selectedDate)} style={linkStyle}>День</Link>
              <Link to="/week" style={linkStyle}>Неделя</Link>
            </>
          )}
          <Link to="/month" style={linkStyle}>Месяц</Link>
          <Link to="/year" style={linkStyle}>Год</Link>
        </div>
      </div>

      <div style={{ ...sectionStyle, flexGrow: 1 }}></div>

      <div style={sectionStyle}>
        {isAuthenticated ? (
          <>
            <Link to="/add-event" style={linkStyle}>Добавить событие/задачу</Link>
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
    <Route path="/day" element={isAuthenticated ? <DayView date={selectedDate} /> : <Navigate to="/month" />} />
    <Route path="/week" element={isAuthenticated ? <WeekView /> : <Navigate to="/month" />} />
    <Route path="/month" element={<MonthView isAuthenticated={isAuthenticated} onDayClick={handleDayClick} />} />
    <Route path="/year" element={<YearView setSelectedDate={setSelectedDate} />} />
    <Route path="/add-event" element={<EventForm />} /> {/* Добавлен маршрут для EventForm */}
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<MonthView isAuthenticated={isAuthenticated} onDayClick={handleDayClick} />} />
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