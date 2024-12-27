import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const DayView = ({ userId }) => {
    const location = useLocation();
    const initialDate = location.state?.selectedDate || new Date();
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date(initialDate));

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/schedule?date=${currentDate.toISOString()}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Ошибка при получении расписания:', error);
            }
        };

        fetchSchedule();
    }, [currentDate]);

    const handleNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDay);
    };

    const handlePreviousDay = () => {
        const previousDay = new Date(currentDate);
        previousDay.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDay);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                handleNextDay();
            } else if (event.key === 'ArrowLeft') {
                handlePreviousDay();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentDate]);

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            width: '80%',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button
                    onClick={handlePreviousDay}
                    style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }}
                >
                    ←
                </button>
                <h2>{currentDate.toLocaleDateString()} ({currentDate.toLocaleString('default', { weekday: 'long' })})</h2>
                <button
                    onClick={handleNextDay}
                    style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }}
                >
                    →
                </button>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {events.length > 0 ? (
                    events.map((item, index) => (
                        <li key={index} style={{ marginBottom: '10px', textAlign: 'left' }}>
                            {item.type === 'task' ? (
                                <>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {formatTime(item.start_time)} — {formatTime(item.end_time)}
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                    {item.description && <div>{item.description}</div>}
                                </>
                            ) : (
                                <>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {formatTime(item.start_time)} — {item.title}
                                    </div>
                                    {item.description && <div>{item.description}</div>}
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <li>События отсутствуют</li>
                )}
            </ul>
        </div>
    );
};

export default DayView;