import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ userId }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/events', {
                userId,
                title,
                date,
                description,
            });
            console.log('Событие добавлено:', response.data);
        } catch (error) {
            console.error('Ошибка при добавлении события:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Название события"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <textarea
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Добавить событие</button>
        </form>
    );
};

export default EventForm;