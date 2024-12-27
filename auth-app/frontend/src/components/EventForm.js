import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import './styles/EventForm.css';

const EventForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      console.error('Дата обязательна');
      return;
    }

    const eventDate = new Date(date);
    eventDate.setDate(eventDate.getDate() + 1);

    if (isNaN(eventDate.getTime())) {
      console.error('Некорректное значение даты');
      return;
    }

    const startDateTime = new Date(`${eventDate.toISOString().split('T')[0]}T${startTime}:00`);
    const endDateTime = new Date(`${eventDate.toISOString().split('T')[0]}T${endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error('Некорректное значение времени');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/save',
        {
          title,
          description,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      console.log('Данные сохранены:', response.data);
      navigate('/month');
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  return (
    <div className="event-form-container">
      <h2>Добавление события/задачи</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label htmlFor="description">Описание задачи:</label>
          <textarea
            id="description"
            placeholder="Введите описание задачи"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date">Укажите дату:</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            className="calendar-icon"
          />
        </div>
        <div>
          <label htmlFor="start-time">Время начала:</label>
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="end-time">Время конца:</label>
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Добавить событие/задачу</button>
      </form>
    </div>
  );
};

export default EventForm;