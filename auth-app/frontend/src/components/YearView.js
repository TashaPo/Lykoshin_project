import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для навигации
import axios from 'axios';

const YearView = ({ userId, setSelectedDate }) => {
    const [events, setEvents] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate(); // Хук для навигации

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

    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const getDaysInMonth = (month) => {
        return new Date(currentYear, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month) => {
        return new Date(currentYear, month, 1).getDay();
    };

    const handleNextYear = () => {
        const nextYear = currentYear + 1;
        setCurrentYear(nextYear);
        setSelectedDate(new Date(nextYear, 0, 1));
    };

    const handlePreviousYear = () => {
        const previousYear = currentYear - 1;
        setCurrentYear(previousYear);
        setSelectedDate(new Date(previousYear, 0, 1));
    };

    const handleDayClick = (date) => {
        setSelectedDate(date); // Устанавливаем выбранную дату
        navigate('/day', { state: { selectedDate: date } }); // Переходим на представление дня с передачей выбранной даты
    };

    const today = new Date(); // Получаем сегодняшнюю дату

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={handlePreviousYear} style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }}>
                    ←
                </button>
                <h2 style={{ marginBottom: '20px', fontSize: '2em' }}>{currentYear}</h2>
                <button onClick={handleNextYear} style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }}>
                    →
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '90%', margin: '0 auto' }}>
                {months.map((month, index) => (
                    <div key={index} style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '30px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <h4>{month}</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {(() => {
                                    const daysInMonth = getDaysInMonth(index);
                                    const firstDay = getFirstDayOfMonth(index);
                                    const rows = [];
                                    let cells = [];

                                    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

                                    for (let i = 0; i < adjustedFirstDay; i++) {
                                        cells.push(<td key={`empty-${i}`}></td>);
                                    }

                                    for (let day = 1; day <= daysInMonth; day++) {
                                        const date = new Date(currentYear, index, day);
                                        const isToday = date.toDateString() === today.toDateString();

                                        cells.push(
                                            <td
                                                key={day}
                                                style={{
                                                    backgroundColor: isToday ? '#165882' : 'transparent',
                                                    color: isToday ? '#ffffff' : 'black',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                }}
                                                onClick={() => handleDayClick(date)} // Обработчик клика
                                            >
                                                {day}
                                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                    {events
                                                        .filter(event => new Date(event.date).getDate() === day && new Date(event.date).getMonth() === index && new Date(event.date).getFullYear() === currentYear)
                                                        .map(event => (
                                                            <li key={event.id}>{event.title}</li>
                                                        ))}
                                                </ul>
                                            </td>
                                        );

                                        if ((day + adjustedFirstDay) % 7 === 0) {
                                            rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
                                            cells = [];
                                        }
                                    }

                                    if (cells.length > 0) {
                                        rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
                                    }

                                    return rows;
                                })()}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YearView;