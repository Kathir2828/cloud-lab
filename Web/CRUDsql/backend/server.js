const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '' });

db.query('CREATE DATABASE IF NOT EXISTS test');
db.query('USE test');
db.query('CREATE TABLE IF NOT EXISTS user (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100))');

app.get('/user', (req, res) => {
  db.query('SELECT * FROM user', (err, result) => res.json(result || []));
});

app.post('/user', (req, res) => {
  const { id, name } = req.body;
  db.query('INSERT INTO user (id, name) VALUES (?, ?)', [id, name], () => res.json(req.body));
});

app.put('/user/:id', (req, res) => {
  db.query('UPDATE user SET name = ? WHERE id = ?', [req.body.name, req.params.id], () => res.json({ success: true }));
});

app.delete('/user/:id', (req, res) => {
  db.query('DELETE FROM user WHERE id = ?', [req.params.id], () => res.json({ success: true }));
});

app.listen(5000, () => console.log('Server running on port 5000'));
