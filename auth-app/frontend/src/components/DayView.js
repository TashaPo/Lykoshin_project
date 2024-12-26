import React, { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
 
const DayView = ({ userId }) => { 
    const location = useLocation(); 
    const initialDate = location.state?.selectedDate || new Date(); // Получаем дату из состояния маршрута или используем текущую дату 
    const [events, setEvents] = useState([]); 
    const [currentDate, setCurrentDate] = useState(initialDate); 
 
    useEffect(() => { 
        const fetchEvents = async () => { 
            if (currentDate) { 
                try { 
                    const response = await axios.get(`http://localhost:5000/api/events?userId=${userId}`); 
                    const filteredEvents = response.data.filter(event =>  
                        new Date(event.date).toDateString() === currentDate.toDateString() 
                    ); 
                    setEvents(filteredEvents); 
                } catch (error) { 
                    console.error('Ошибка при получении событий:', error); 
                } 
            } 
        }; 
 
        fetchEvents(); 
    }, [userId, currentDate]); 
 
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
 
    // Обработка нажатий клавиш 
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
                <h2>{currentDate.toLocaleDateString()} ({currentDate.toLocaleString('default', { weekday: 'long' }).charAt(0).toUpperCase() + currentDate.toLocaleString('default', { weekday: 'long' }).slice(1)})</h2> 
                <button  
                    onClick={handleNextDay}  
                    style={{ cursor: 'pointer', padding: '10px', fontSize: '16px', color: '#ffffff', backgroundColor: '#166582', border: 'none', borderRadius: '5px' }} 
                > 
                    → 
                </button> 
            </div> 
            <ul style={{ listStyleType: 'none', padding: 0 }}> 
                {events.length > 0 ? ( 
                    events.map(event => ( 
                        <li key={event.id} style={{ marginBottom: '10px', textAlign: 'left' }}> 
                            <strong>{new Date(event.date).toLocaleTimeString()} — {event.title}</strong> 
                            {event.description && <div>{event.description}</div>} 
                        </li> 
                    )) 
                ) : ( 
                    <li>Нет событий на этот день.</li> 
                )} 
            </ul> 
        </div> 
    ); 
}; 
 
export default DayView;
