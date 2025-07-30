// Step 1: Import packages
const express = require('express');
const mysql = require('mysql');
const path = require('path');

// Step 2: Create express app
const app = express();

// Step 3: Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Step 4: Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Root@1234',
  database: process.env.DB_NAME || 'hospital'
});

// Step 5: Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Step 6: Add API route
app.get('/api/doctors', (req, res) => {
  const { speciality, city } = req.query;

  const query = `
    SELECT name, position, speciality, experience, fees, city 
    FROM doctors 
    WHERE speciality = ? AND city = ?
  `;

  db.query(query, [speciality, city], (err, results) => {
    if (err) {
      console.error('Error fetching doctors:\n', JSON.stringify(err, null, 2));
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Step 7: Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
