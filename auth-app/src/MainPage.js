// главная страница

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './MainPage.css'; // Импортируем стили

const MainPage = () => {
    const [view, setView] = useState('month'); // Начальный режим отображения
    const [currentDate, setCurrentDate] = useState(moment());
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(moment()); // Обновляем текущую дату каждую секунду
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const handleProfileClick = () => {
        navigate('/login'); // Переход на страницу входа
    };

    return (
        <div className="main-page">
            <div className="sidebar">
                <h2>Календарь</h2>
                <form><button onClick={() => handleViewChange('day')}>День</button></form>
                <form><button onClick={() => handleViewChange('week')}>Неделя</button></form>
                <form><button onClick={() => handleViewChange('month')}>Месяц</button></form>
                <form><button onClick={() => handleViewChange('year')}>Год</button></form>
            </div>
            <div className="calendar">
                <h1>{currentDate.format('MMMM YYYY')}</h1>
                {view === 'month' && <MonthView date={currentDate} />}
                {view === 'week' && <WeekView date={currentDate} />}
                {view === 'day' && <DayView date={currentDate} />}
                {view === 'year' && <YearView date={currentDate} />}
            </div>
            <div className="profile-icon" onClick={handleProfileClick}>
                <img src="/path/to/profile-icon.png" alt="Profile" />
            </div>
        </div>
    );
};

// Компонент для отображения месяца
const MonthView = ({ date }) => {
    const startOfMonth = date.clone().startOf('month');
    const endOfMonth = date.clone().endOf('month');
    const days = [];

    for (let day = startOfMonth; day.isBefore(endOfMonth, 'day'); day.add(1, 'day')) {
        days.push(day.clone());
    }

    return (
        <div className="month-view">
            {days.map((day) => (
                <div key={day.format('DD-MM-YYYY')} className="day">
                    {day.format('D')}
                </div>
            ))}
        </div>
    );
};

// Компонент для отображения недели
const WeekView = ({ date }) => {
    const startOfWeek = date.clone().startOf('week');
    const days = [];

    for (let day = startOfWeek; day.isBefore(startOfWeek.clone().endOf('week'), 'day'); day.add(1, 'day')) {
        days.push(day.clone());
    }

    return (
        <div className="week-view">
            {days.map((day) => (
                <div key={day.format('DD-MM-YYYY')} className="day">
                    {day.format('dddd, D')}
                </div>
            ))}
        </div>
    );
};

// Компонент для отображения дня
const DayView = ({ date }) => {
    return (
        <div className="day-view">
            <h2>{date.format('dddd, D MMMM YYYY')}</h2>
            {/* Здесь можно добавить события на этот день */}
        </div>
    );
};

// Компонент для отображения года
const YearView = ({ date }) => {
    const startOfYear = date.clone().startOf('year');
    const months = [];

    for (let month = startOfYear; month.isBefore(startOfYear.clone().endOf('year'), 'month'); month.add(1, 'month')) {
        months.push(month.clone());
    }

    return (
        <div className="year-view">
            {months.map((month) => (
                <div key={month.format('MM-YYYY')} className="month">
                    {month.format('MMMM YYYY')}
                </div>
            ))}
        </div>
    );
};

export default MainPage;