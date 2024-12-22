import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/MonthView.css'; // Импортируем стили

const MonthView = ({ userId, onDayClick }) => {
    const [events, setEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events?userId=${userId}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Ошибка при получении событий:', error);
            }
        };

        fetchEvents();
    }, [userId]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
        const totalCells = 42; // Максимальное количество ячеек (6 строк по 7 дней)
        
        const calendarDays = [];
        const emptyCellsBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Добавляем пустые ячейки для дней предыдущего месяца
        for (let i = 0; i < emptyCellsBefore; i++) {
            const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate() - emptyCellsBefore + i + 1;
            calendarDays.push(
                <div key={`prev-${day}`} className="day-cell prev-month">
                    <span>{day}</span>
                </div>
            );
        }

        // Добавляем дни текущего месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            calendarDays.push(
                <div 
                    key={date.toDateString()} 
                    className={`day-cell ${isToday(date) ? 'today' : ''}`}
                    onClick={() => onDayClick(date)} // Обработчик клика по ячейке
                >
                    <span>{day}</span>
                    <ul>
                        {events
                            .filter(event => new Date(event.date).toDateString() === date.toDateString())
                            .map(event => (
                                <li key={event.id}>{event.title}</li>
                            ))}
                    </ul>
                </div>
            );
        }

        // Рассчитываем количество пустых ячеек для следующего месяца
        const totalDays = calendarDays.length;
        const emptyCellsAfter = totalCells - totalDays; // Количество пустых ячеек после последнего числа месяца
        for (let i = 1; i <= emptyCellsAfter; i++) {
            calendarDays.push(
                <div key={`next-${i}`} className="day-cell next-month">
                    <span>{i}</span>
                </div>
            );
        }

        return calendarDays;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="month-view">
            <div className="header">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>&lt;</button>
                <h2>{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</h2>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default MonthView;