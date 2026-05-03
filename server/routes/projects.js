const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/', async (req, res) => {
    const { title, description, location, category, organizer_id } = req.body;
    try {
        const newProject = await db.query(
            // Використовуємо 'created_by' замість 'author_id'
            `INSERT INTO initiatives (title, description, location, category, created_by) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, description, location, category, organizer_id]
        );
        res.status(201).json(newProject.rows[0]);
    } catch (err) {
        console.error("Помилка БД:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;