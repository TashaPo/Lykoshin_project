import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedPage from './ProtectedPage'; // Импортируем защищенную страницу
import { Navigate } from 'react-router-dom'; // Импортируем Navigate

// Компонент для защиты маршрутов
const PrivateRoute = ({ component: Component }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Проверяем наличие токена

    return isAuthenticated ? <Component /> : <Navigate to="/login" />; // Используем Navigate для перенаправления
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/protected" element={<PrivateRoute component={ProtectedPage} />} /> {/* Защищенный маршрут */}
                <Route path="/" element={<Navigate to="/login" />} /> {/* Перенаправление на страницу входа по умолчанию */}
            </Routes>
        </Router>
    );
};

export default App;