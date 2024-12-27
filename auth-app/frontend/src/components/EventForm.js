import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import './styles/EventForm.css'; // Путь к стилям

const EventForm = ({ userId }) => {
  const navigate = useNavigate(); // Инициализируем navigate
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if date is valid
    if (!date) {
        console.error('Date is required');
        return;
    }

    // Format the date correctly
    const eventDateParts = date.split('.');
    if (eventDateParts.length !== 3) {
        console.error('Invalid date format. Expected DD.MM.YYYY');
        return;
    }
    const eventDate = new Date(`${eventDateParts[2]}-${eventDateParts[1]}-${eventDateParts[0]}`); // YYYY-MM-DD

    // Validate the date
    if (isNaN(eventDate.getTime())) {
        console.error('Invalid date value');
        return;
    }

    // Ensure start and end times are valid
    const formattedStartTime = startTime.includes(':') ? `${startTime}:00` : `${startTime}:00`;
    const formattedEndTime = endTime.includes(':') ? `${endTime}:00` : `${endTime}:00`;

    // Create Date objects for start and end times
    const startDateTime = new Date(`${eventDate.toISOString().split('T')[0]}T${formattedStartTime}`);
    const endDateTime = new Date(`${eventDate.toISOString().split('T')[0]}T${formattedEndTime}`);

    // Validate start and end times
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.error('Invalid time value');
        return;
    }

    try {
        let response;

        // If start and end times are the same, create an event
        if (startTime === endTime) {
            response = await axios.post('http://localhost:5000/api/events', {
                userId,
                title,
                description,
                event_date: startDateTime.toISOString(),
            });
            console.log('Событие добавлено:', response.data);
        } else {
            response = await axios.post('http://localhost:5000/api/tasks', {
                userId,
                title,
                description,
                due_date: endDateTime.toISOString(),
                is_completed: false,
            });
            console.log('Задача добавлена:', response.data);
        }

        navigate('/calendar');
    } catch (error) {
        console.error('Ошибка при добавлении события/задачи:', error);
    }
};

  return (
    <div className="event-form-container" >
      <h2>Добавление события/задачи</h2>
      <form onSubmit={handleSubmit}>
        {/* Название события */}
        <div>
        <label htmlFor="title">Название события:</label>
        <input
          type="text"
          id="title"
          placeholder="Введите название события"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        </div>

        {/* Описание события */}
        <div>
        <label htmlFor="description">Описание задачи:</label>
        <textarea
          id="description"
          placeholder="Введите описание задачи"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>

        {/* Выбор даты */}
        <div>
        <label htmlFor="date">Укажите дату:
        
        {/* Мини-календарь для выбора даты */}
        <DatePicker
          selected={date ? new Date(date.split('.').reverse().join('-')) : null}
          onChange={(date) => setDate(date.toLocaleDateString())}
          dateFormat="dd.MM.yyyy"
          className="calendar-icon"
        />
        </label>
        </div>

        {/* Выбор времени начала */}
        <div>
          <label htmlFor="start-time">Укажите время начала:
          <input
            type="text"
            id="start-time"
            placeholder="чч:мм"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={{ width: '200px', marginLeft: '50px' }}
          /> </label>
        </div>

        {/* Выбор времени конца */}
        <div>
          <label htmlFor="end-time">Укажите время конца: 
          <input 
            type="text"
            id="end-time"
            placeholder="чч:мм"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={{ width: '200px', marginLeft: '60px' }}
          /> </label>
        </div>

        {/* Кнопка отправки формы */}
        <button type="submit">Добавить событие/задачу</button>
      </form>
    </div>
  );
};

export default EventForm;