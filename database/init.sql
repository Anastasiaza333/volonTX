-- Створення таблиці користувачів (адміни та волонтери)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'volunteer', -- ролі: volunteer, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці волонтерських проєктів/ініціатив
CREATE TABLE initiatives (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    category VARCHAR(50), -- наприклад: екологія, допомога армії, тварини
    deadline DATE,
    created_by INTEGER REFERENCES users(id), -- зв'язок з адміном, що створив
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці заявок на участь
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    initiative_id INTEGER REFERENCES initiatives(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- статуси: pending, approved, rejected
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);