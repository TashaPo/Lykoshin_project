import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YearView = ({ userId }) => {
    const [events, setEvents] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
        return new Date(currentYear, month + 1, 0).getDate(); // Получаем количество дней в месяце
    };

    const getFirstDayOfMonth = (month) => {
        return new Date(currentYear, month, 1).getDay(); // Получаем первый день месяца
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '2em' }}>{currentYear}</h2>
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
                                    

                                    // Приводим первый день к понедельнику (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
                                    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

                                    // Добавляем пустые ячейки перед первым днем месяца
                                    for (let i = 0; i < adjustedFirstDay; i++) {
                                        cells.push(<td key={`empty-${i}`}></td>);
                                    }

                                    // Заполняем ячейки с числами месяца
                                    for (let day = 1; day <= daysInMonth; day++) {
                                        const date = new Date(currentYear, index, day);
                                        cells.push(
                                            <td key={day}>
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

                                        // Если достигли конца недели, добавляем строку
                                        if ((day + adjustedFirstDay) % 7 === 0) {
                                            rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
                                            cells = []; // Сбрасываем ячейки для следующей строки
                                        }
                                    }

                                    // Добавляем оставшиеся ячейки, если они есть
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