// src/components/EventForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const EventForm = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.userId;
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert('Пользователь не авторизован');
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, {
                title,
                date,
                description,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 201) {
                alert('Событие добавлено');
                navigate('/month');
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message);
                alert(error.response.data.message);
            } else {
                console.error('Ошибка при добавлении события:', error);
                alert('Ошибка при добавлении события');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1>Добавить событие</h1>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Название события:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Дата и время:</label>
                    <input 
                        type="datetime-local" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Описание:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        style={styles.textarea}
                    />
                    <button type="submit" style={styles.button}>Добавить</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#aec6cf',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: '#e9f7fb',
        borderRadius: '15px',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginTop: '10px',
    },
    textarea: {
        width: '80%',
        height: '100px',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginTop: '10px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '20px',
        width: '50%',
        border: 'none',
        backgroundColor: '#19789c',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '20px',
    },
    label: {
        display: 'block',
        textAlign: 'left',
        width: '80%',
        marginLeft: '10%',
        marginTop: '10px',
    },
};

export default EventForm;
