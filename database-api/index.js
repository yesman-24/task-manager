const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection
const dbServer = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

// Connect to MySQL
dbServer.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');

    // Create database
    dbServer.query('CREATE DATABASE IF NOT EXISTS task_manager_db', (err) => {
        if(err) {
            throw err;
        }
        console.log('Database created or already exists')
    })

    // Create table
    dbServer.query('USE task_manager_db',(err) => {
        if(err) {
            throw err;
        }
        console.log('Using task_manager_db');

        // Create tasks table
        const createTable = `CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            title VARCHAR(255) DEFAULT NULL,
            status VARCHAR(50) DEFAULT NULL,
            is_completed BOOLEAN GENERATED ALWAYS AS (status = 'Completed') STORED
            )`;

        dbServer.query(createTable, (err) => {
            if(err) {
                throw err;
            }
            console.log('Table created');
        });
    });
});

// Fetch all tasks
app.get('/tasks', (req, res) => {
    let sql = 'SELECT * FROM tasks';
    dbServer.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new task
app.post('/tasks', (req, res) => {
    let task = { title: req.body.title, status: req.body.status };
    let sql = 'INSERT INTO tasks SET ?';
    dbServer.query(sql, task, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Update a task's status to any
app.put('/tasks/:id', (req, res) => {
    const newStatus = req.body.status;
    let sql = `UPDATE tasks SET status = ? WHERE id = ?`;
    dbServer.query(sql,[newStatus,req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    let sql = `DELETE FROM tasks WHERE id = ${req.params.id}`;
    dbServer.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});