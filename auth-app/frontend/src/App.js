import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Calendar from './components/Calendar';

const App = () => {
    
    return (
        <Router>
            <Calendar />
        </Router>
    );
};

export default App;
