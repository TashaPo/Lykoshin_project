import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login'; // Импортируйте ваш компонент входа
import Register from './Register'; // Импортируйте ваш компонент регистрации
import MainPage from './MainPage'; // Импортируйте ваш компонент календаря

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<MainPage />} /> {/* Новый маршрут для календаря */}
                <Route path="/" element={<MainPage />} /> {/* Главная страница по умолчанию */}
            </Routes>
        </Router>
    );
};

export default App;