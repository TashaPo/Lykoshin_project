const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

// Define routes for authentication
app.post('/api/register', async (req, res) => {
  // Handle user registration
});

app.post('/api/login', async (req, res) => {
  // Handle user login
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});