// src/components/WeekView.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const WeekView = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.userId;
    const [events, setEvents] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));

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

    const getStartOfWeek = (date) => {
        const day = date.getDay() || 7; // Если воскресенье, считать как 7
        const start = new Date(date);
        start.setDate(date.getDate() - day + 1);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const getEndOfWeek = (start) => {
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return end;
    };

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeek);
        day.setDate(currentWeek.getDate() + i);
        weekDays.push(day);
    }

    const handleNextWeek = () => {
        setCurrentWeek(new Date(currentWeek.getFullYear(), currentWeek.getMonth(), currentWeek.getDate() + 7));
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(new Date(currentWeek.getFullYear(), currentWeek.getMonth(), currentWeek.getDate() - 7));
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{ width: '90%', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <button 
                        onClick={handlePreviousWeek} 
                        style={buttonStyle}
                    >
                        ←
                    </button>
                    <h2 style={{ margin: '0 20px' }}>
                        {currentWeek.toLocaleDateString()} - {getEndOfWeek(currentWeek).toLocaleDateString()}
                    </h2>
                    <button 
                        onClick={handleNextWeek} 
                        style={buttonStyle}
                    >
                        →
                    </button>
                </div>
                {weekDays.map((day) => (
                    <div key={day.toDateString()} style={dayContainerStyle}>
                        <h3>
                            {day.toLocaleDateString()} ({day.toLocaleString('default', { weekday: 'long' }).charAt(0).toUpperCase() + day.toLocaleString('default', { weekday: 'long' }).slice(1)})
                        </h3>
                        <div style={eventsContainerStyle}>
                            <ul style={ulStyle}>
                                {events
                                    .filter(event => new Date(event.date).toDateString() === day.toDateString())
                                    .map(event => (
                                        <li key={event.id} style={liStyle}>
                                            <strong>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.title}</strong>
                                            {event.description && <p>{event.description}</p>}
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

const buttonStyle = {
    cursor: 'pointer',
    padding: '10px',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#166582',
    border: 'none',
    borderRadius: '5px',
};

const dayContainerStyle = {
    marginBottom: '20px',
};

const eventsContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
};

const ulStyle = {
    listStyleType: 'none',
    padding: 0,
};

const liStyle = {
    marginBottom: '10px',
};

export default WeekView;
