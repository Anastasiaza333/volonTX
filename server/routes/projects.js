const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

// СТВОРЕННЯ НОВОЇ ІНІЦІАТИВИ (/initiatives)
router.post('/', async (req, res) => {
    // Приймаємо дані, включаючи organizer_id та image_url, які шле фронтенд
    const { title, description, location, category, deadline, organizer_id, image_url } = req.body;

    const finalTitle = title || 'Нова ініціатива';
    const finalDescription = description || 'Опис відсутній';
    const finalLocation = location || 'Україна';
    const finalCategory = category || 'Загальне';const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

// 1. СТВОРЕННЯ НОВОЇ ІНІЦІАТИВИ (/initiatives)
router.post('/', async (req, res) => {
    // Приймаємо дані, включаючи organizer_id та image_url, які шле фронтенд
    const { title, description, location, category, deadline, organizer_id, image_url } = req.body;

    const finalTitle = title || 'Нова ініціатива';
    const finalDescription = description || 'Опис відсутній';
    const finalLocation = location || 'Україна';
    const finalCategory = category || 'Загальне';
    const finalDeadline = deadline || '2026-12-31';
    // Якщо користувач не увійшов, запишемо NULL або за замовчуванням (підстраховка)
    const finalOrganizer = organizer_id || null; 
    
    // Дефолтна картинка волонтерства, якщо інпут пустий
    const finalImage = image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600';

    try {
        // Головний запит: вставляємо дані разом з organizer_id та image_url
        const result = await db.query(
            "INSERT INTO initiatives (title, description, location, category, deadline, organizer_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [finalTitle, finalDescription, finalLocation, finalCategory, finalDeadline, finalOrganizer, finalImage]
        );

        res.status(201).json({
            message: "Проєкт успішно створено",
            project: result.rows[0]
        });
    } catch (err) {
        console.error("Помилка бази даних при створенні проєкту:", err.message);
        
       
        try {
            const fallbackResult = await db.query(
                "INSERT INTO initiatives (title, description, location, category, deadline, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [finalTitle, finalDescription, finalLocation, finalCategory, finalDeadline, finalImage]
            );
            return res.status(201).json({
                message: "Проєкт успішно створено (без організатора)",
                project: fallbackResult.rows[0]
            });
        } catch (fallbackErr) {
            res.status(500).json({ message: `Помилка сервера: ${fallbackErr.message}` });
        }
    }
}); 

// 2. ОТРИМАННЯ ВСІХ ІНІЦІАТИВ ДЛЯ ГОЛОВНОЇ СТОРІНКИ
router.get('/', async (req, res) => {
    try {
        // Беремо всі ініціативи та сортуємо їх: нові будуть зверху
        const result = await db.query("SELECT * FROM initiatives ORDER BY id DESC");
        
        // Повертаємо масив проєктів фронтенду
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Помилка при отриманні ініціатив:", err.message);
        res.status(500).json({ message: "Помилка сервера при завантаженні проєктів" });
    }
}); 

module.exports = router;
    const finalDeadline = deadline || '2026-12-31';
    // Якщо користувач не увійшов, запишемо NULL або за замовчуванням (підстраховка)
    const finalOrganizer = organizer_id || null; 
    

    const finalImage = image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600';

    try {
        // Головний запит: вставляємо дані разом з organizer_id та image_url
        const result = await db.query(
            "INSERT INTO initiatives (title, description, location, category, deadline, organizer_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [finalTitle, finalDescription, finalLocation, finalCategory, finalDeadline, finalOrganizer, finalImage]
        );

        res.status(201).json({
            message: "Проєкт успішно створено",
            project: result.rows[0]
        });
    } catch (err) {
        console.error("Помилка бази даних при створенні проєкту:", err.message);
        
        
        try {
            const fallbackResult = await db.query(
                "INSERT INTO initiatives (title, description, location, category, deadline, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [finalTitle, finalDescription, finalLocation, finalCategory, finalDeadline, finalImage]
            );
            return res.status(201).json({
                message: "Проєкт успішно створено (без організатора)",
                project: fallbackResult.rows[0]
            });
        } catch (fallbackErr) {
            res.status(500).json({ message: `Помилка сервера: ${fallbackErr.message}` });
        }
    }
    // ОТРИМАННЯ ВСІХ ІНІЦІАТИВ ДЛЯ ГОЛОВНОЇ СТОРІНКИ
router.get('/', async (req, res) => {
    try {
        // Беремо всі ініціативи та сортуємо їх: нові будуть зверху
        const result = await db.query("SELECT * FROM initiatives ORDER BY id DESC");
        
        // Повертаємо масив проєктів фронтенду
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Помилка при отриманні ініціатив:", err.message);
        res.status(500).json({ message: "Помилка сервера при завантаженні проєктів" });
    }
});
});

module.exports = router;