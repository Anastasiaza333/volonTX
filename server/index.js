const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Налаштування (Middleware)
app.use(cors()); // Дозволяє вашому React-додатку звертатися до сервера
app.use(express.json()); // Дозволяє серверу читати JSON-дані (email, пароль тощо)

// 2. Підключення маршрутів
// Переконайтеся, що ці файли існують у папці server/routes/
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

// Використання маршрутів
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes); 
app.use('/initiatives', projectRoutes);

// 3. Тестовий маршрут для перевірки в браузері
app.get('/', (req, res) => {
    res.send('Сервер волонтерської системи успішно працює на порту 5001!');
});

// 4. Запуск сервера
const PORT = 5001; // Змінили на 5001, щоб уникнути конфліктів системних портів
app.listen(PORT, () => {
    console.log('====================================');
    console.log('🚀 СЕРВЕР ЗАПУЩЕНО!');
    console.log('🔗 Адреса: http://localhost:' + PORT);
    console.log('------------------------------------');
});