const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

// РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
    const { full_name, email, password, role } = req.body;

    try {
        // 1. Перевірка, чи існує користувач (email в нижній регістр для надійності)
        const userExist = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "Користувач з такою поштою вже існує" });
        }

        // 2. Додавання нового користувача
        // Переконайся, що в БД колонка називається password_hash
        const newUser = await db.query(
            "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role",
            [full_name, email, password, role || 'volunteer'] 
        );

        // Повертаємо дані для автоматичного входу після реєстрації
        res.status(201).json({
            message: "Реєстрація успішна",
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error("Помилка реєстрації:", err.message);
        res.status(500).json({ message: "Помилка сервера при реєстрації" });
    }
});

// ЛОГІН (вхід)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Шукаємо користувача
        const result = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Користувача не знайдено" });
        }

        const user = result.rows[0];

        // 2. Перевірка пароля
        // Важливо: переконайся, що звертаєшся до тієї ж колонки (password_hash)
        if (user.password_hash !== password) {
            return res.status(401).json({ message: "Невірний пароль" });
        }

        // 3. Відповідь фронтенду
        // Огортаємо в об'єкт { user: ... }, бо твій Auth.js чекає саме таку структуру (onLogin(res.data.user))
        res.json({
            message: "Вхід успішний",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Помилка входу:", err.message);
        res.status(500).json({ message: "Помилка сервера при вході" });
    }
});

module.exports = router;