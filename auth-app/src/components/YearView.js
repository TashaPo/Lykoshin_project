// src/components/YearView.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const YearView = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.userId;
    const [events, setEvents] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!userId) {
                console.error("Ошибка: userId не определен");
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvents(Array.isArray(response.data.events) ? response.data.events : []);
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
        setCurrentYear(currentYear + 1);
    };

    const handlePreviousYear = () => {
        setCurrentYear(currentYear - 1);
    };

    const handleDayClick = (date) => {
        navigate('/day', { state: { selectedDate: date } });
    };

    const today = new Date();

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={handlePreviousYear} style={buttonStyle}>
                    ←
                </button>
                <h2 style={{ margin: '0 20px', fontSize: '2em' }}>{currentYear}</h2>
                <button onClick={handleNextYear} style={buttonStyle}>
                    →
                </button>
            </div>
            <div style={monthsGridStyle}>
                {months.map((month, index) => (
                    <div key={index} style={monthContainerStyle}>
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
                                        const isTodayFlag = date.toDateString() === today.toDateString();

                                        cells.push(
                                            <td
                                                key={day}
                                                style={{
                                                    backgroundColor: isTodayFlag ? '#165882' : 'transparent',
                                                    color: isTodayFlag ? '#ffffff' : 'black',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                    height: '30px',
                                                }}
                                                onClick={() => handleDayClick(date)}
                                            >
                                                {day}
                                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.75em' }}>
                                                    {events
                                                        .filter(event => 
                                                            new Date(event.date).getDate() === day &&
                                                            new Date(event.date).getMonth() === index &&
                                                            new Date(event.date).getFullYear() === currentYear
                                                        )
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

const buttonStyle = {
    cursor: 'pointer',
    padding: '10px',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#166582',
    border: 'none',
    borderRadius: '5px',
};

const monthsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    width: '90%',
    margin: '0 auto',
};

const monthContainerStyle = {
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

export default YearView;
