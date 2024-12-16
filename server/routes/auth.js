const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(email, hashedPassword);
    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;