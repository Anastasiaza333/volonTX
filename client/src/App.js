import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Імпорт сторінок (їх треба буде створити або винести код у них)
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './pages/Auth'; // Сторінка логіну/реєстрації
import Navbar from './components/Navbar';

import './App.css';

function App() {
  // Стан користувача (після логіну сюди прийде {id, full_name, role})
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Перевіряємо, чи є збережений користувач у браузері (LocalStorage)
    const savedUser = localStorage.getItem('volontx_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('volontx_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('volontx_user');
  };

  if (loading) return <div className="loader">Завантаження...</div>;

  return (
    <Router>
      <div className="App">
        {/* Передаємо користувача в Navbar для відображення сповіщень та аватарки */}
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="container">
          <Routes>
            {/* Головна сторінка доступна всім */}
            <Route path="/" element={<Home user={user} />} />
            
            {/* Сторінка авторизації */}
            <Route path="/auth" element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/profile" />} />
            
            {/* Кабінет доступний тільки авторизованим */}
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} /> : <Navigate to="/auth" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;