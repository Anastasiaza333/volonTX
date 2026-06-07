const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

яяяяя
// 1. РЕЄСТРАЦІЯ КОРИСТУВАЧІВ (/auth/register)

router.post('/register', async (req, res) => {
    const { full_name, name, username, email, password, password_hash, role } = req.body;

  
    const finalName = full_name || name || username || 'Користувач';
    const finalPassword = password || password_hash || '123456';

    try {
        // Перевіряємо, чи немає вже такого email в системі
        const userExist = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Користувач з такою поштою вже існує" });
        }

        // Записуємо ТІЛЬКИ в ті стовпці, які точно є в базі (full_name, email, password_hash, role)
        const newUser = await db.query(
            "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role",
            [finalName, email, finalPassword, role || 'volunteer'] 
        );

        res.status(201).json({
            message: "Реєстрація успішна",
            user: {
                id: newUser.rows[0].id,
                full_name: newUser.rows[0].full_name,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role
            }
        });
    } catch (err) {
        console.error("Помилка реєстрації в роутері:", err.message);
        res.status(500).json({ error: `Помилка сервера при реєстрації: ${err.message}` });
    }
});


// 2. ЛОГІН (ВХІД) КОРИСТУВАЧІВ (/auth/login)

router.post('/login', async (req, res) => {
    const { email, password, password_hash } = req.body;
    const finalPassword = password || password_hash;

    try {
        // Шукаємо користувача в базі за поштою
        const result = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Користувача не знайдено" });
        }

        const user = result.rows[0];


        const dbPassword = user.password_hash;
        if (dbPassword !== finalPassword) {
            return res.status(401).json({ error: "Невірний пароль" });
        }

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
        console.error("Помилка входу в роутері:", err.message);
        res.status(500).json({ error: "Помилка сервера при вході" });
    }
});

module.exports = router;