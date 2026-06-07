const express = require('express');
const app = express();
const db = require('./db/db'); // Шлях до файлу БД
const cors = require('cors');

app.use(cors());
app.use(express.json());
// 1. МАРШРУТИ ДЛЯ ПРОЄКТІВ (ІНІЦІАТИВ)
// СТВОРЕННЯ ПРОЄКТУ (Додано image_url та підтримку полів вашої БД)
app.post('/initiatives', async (req, res) => {
    const { title, description, location, category, organizer_id, image_url } = req.body;
    
    const finalTitle = title || 'Нова ініціатива';
    const finalDescription = description || 'Опис відсутній';
    const finalLocation = location || 'Україна';
    const finalCategory = category || 'Загальне';
    const finalOrganizer = organizer_id || null; 
    const finalImage = image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600';

    try {
        // Спробуємо записати за вашою структурою, використовуючи organizer_id
        const newProject = await db.query(
            `INSERT INTO initiatives (title, description, location, category, organizer_id, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [finalTitle, finalDescription, finalLocation, finalCategory, finalOrganizer, finalImage]
        );
        res.status(201).json(newProject.rows[0]);
    } catch (err) {
        console.error("Помилка БД при створенні, пробуємо fallback варіант:", err.message);
        try {
            //  якщо в базі стовбець називається created_by
            const fallbackProject = await db.query(
                `INSERT INTO initiatives (title, description, location, category, created_by, image_url) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [finalTitle, finalDescription, finalLocation, finalCategory, finalOrganizer, finalImage]
            );
            res.status(201).json(fallbackProject.rows[0]);
        } catch (fallbackErr) {
            res.status(500).json({ error: fallbackErr.message });
        }
    }
});

// ОТРИМАННЯ ВСІХ ПРОЄКТІВ ДЛЯ ГОЛОВНОЇ СТОРІНКИ
app.get('/initiatives', async (req, res) => {
    try {
        const allProjects = await db.query("SELECT * FROM initiatives ORDER BY id DESC");
        res.json(allProjects.rows);
    } catch (err) {
        console.error("Помилка при отриманні ініціатив:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. МАРШРУТИ ДЛЯ ЗАЯВОК ВОЛОНТЕРІВ
// ОТРИМАННЯ ВСІХ ЗАЯВОК (для статистики)
app.get('/applications', async (req, res) => {
    try {
        const allApps = await db.query("SELECT * FROM applications");
        res.json(allApps.rows);
    } catch (err) {
        console.error("Помилка при отриманні заявок:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// СТВОРЕННЯ НОВОЇ ЗАЯВКИ
app.post('/applications', async (req, res) => {
    const { user_id, initiative_id } = req.body;
    try {
        const newApp = await db.query(
            "INSERT INTO applications (user_id, initiative_id) VALUES ($1, $2) RETURNING *",
            [user_id, initiative_id]
        );
        res.status(201).json(newApp.rows[0]);
    } catch (err) {
        console.error("Помилка при створенні заявки:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 3. ПІД КЛЮЧЕННЯ ЗОВНІШНІХ МАРШРУТІВ (РОУТЕРІВ)
// Всі запити, які починаються на /auth (наприклад, /auth/register та /auth/login),
// тепер автоматично йтимуть у твій виправлений файл routes/auth.js
app.use('/auth', require('./routes/auth'));

// ЗАПУСК СЕРВЕРА
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Сервер успішно запущено на порту ${PORT}`);
});