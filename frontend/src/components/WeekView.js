import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeekView = ({ userId }) => {
    const [events, setEvents] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());

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

    const getWeekDays = (date) => {
        const start = date.getDate() - date.getDay(); // Начало недели
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(date);
            day.setDate(start + i);
            weekDays.push(day);
        }
        return weekDays;
    };

    const weekDays = getWeekDays(currentWeek);

    const handleNextWeek = () => {
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(currentWeek.getDate() + 7);
        setCurrentWeek(nextWeek);
    };

    const handlePreviousWeek = () => {
        const previousWeek = new Date(currentWeek);
        previousWeek.setDate(currentWeek.getDate() - 7);
        setCurrentWeek(previousWeek);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{ width: '80%', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button 
                        onClick={handlePreviousWeek} 
                        style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }}
                    >
                        ←
                    </button>
                    <h2>{currentWeek.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button 
                        onClick={handleNextWeek} 
                        style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }}
                    >
                        →
                    </button>
                </div>
                {weekDays.map((day) => (
                    <div key={day.toDateString()} style={{ marginBottom: '20px' }}>
                        <h3>
                            {day.toLocaleDateString()} ({day.toLocaleString('default', { weekday: 'long' }).charAt(0).toUpperCase() + day.toLocaleString('default', { weekday: 'long' }).slice(1)})
                        </h3>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {events
                                    .filter(event => new Date(event.date).toDateString() === day.toDateString())
                                    .map(event => (
                                        <li key={event.id} style={{ marginBottom: '10px' }}>
                                            <strong>{new Date(event.date).toLocaleTimeString()} - {event.title}</strong>
                                            {event.description && <p style={{ margin: '5px 0 0 0' }}>{event.description}</p>}
                                        </li>
                                    ))}
                                {events.filter(event => new Date(event.date).toDateString() === day.toDateString()).length === 0 && (
                                    <li>События отсутствуют</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;