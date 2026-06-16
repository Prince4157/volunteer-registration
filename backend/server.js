const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const { json2csv } = require('json-2-csv');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.post('/api/volunteers', (req, res) => {
    const { name, email, phone, interests } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const query = `INSERT INTO volunteers (name, email, phone, interests) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, phone, interests], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already registered.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Registration successful!' });
    });
});

app.get('/api/volunteers', (req, res) => {
    const query = `SELECT * FROM volunteers ORDER BY created_at DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/api/reports/volunteers', (req, res) => {
    const query = `SELECT * FROM volunteers ORDER BY created_at DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        try {
            const csv = json2csv(rows);
            res.header('Content-Type', 'text/csv');
            res.attachment('volunteers_report.csv');
            res.send(csv);
        } catch (csvErr) {
            res.status(500).json({ error: 'Failed to generate CSV.' });
        }
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
