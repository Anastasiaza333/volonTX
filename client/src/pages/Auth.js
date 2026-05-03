import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import './Auth.css'; // Переконайся, що стилі підключені

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // ПОРТ 5001
        const res = await axios.post('http://localhost:5001/auth/login', {
          email: formData.email,
          password: formData.password,
          role: role // Додаємо роль, щоб Анна не заходила всюди
        });
        
        if (res.data.user) {
          onLogin(res.data.user);
        }
      } else {
        // ТУТ БУВ ПОРТ 5000, Я ВИПРАВИВ НА 5001
        const res = await axios.post('http://localhost:5001/auth/register', {
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role
        });
        
        alert('Реєстрація успішна! Тепер увійдіть.');
        setIsLogin(true);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      setError(serverMessage || 'Помилка доступу до сервера. Перевірте порт 5001.');
      console.error("Auth error details:", err.response);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card modern-card">
        <div className="auth-header">
          <h2>{isLogin ? 'З поверненням!' : 'Реєстрація'}</h2>
          <p>{isLogin ? 'Увійдіть у свій профіль' : 'Створіть новий акаунт'}</p>
        </div>

        {error && <div className="error-badge-modern">{error}</div>}

        <div className="role-selector">
          <button 
            type="button" 
            className={`role-btn ${role === 'volunteer' ? 'active' : ''}`} 
            onClick={() => setRole('volunteer')}
          >
            <User size={18} /> Волонтер
          </button>
          <button 
            type="button" 
            className={`role-btn ${role === 'organizer' ? 'active' : ''}`} 
            onClick={() => setRole('organizer')}
          >
            <ShieldCheck size={18} /> Організатор
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input 
                name="fullName" 
                type="text" 
                placeholder="Повне ім'я" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              name="password" 
              type="password" 
              placeholder="Пароль" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="submit-btn-modern">
            {isLogin ? <><LogIn size={18} /> Увійти</> : <><UserPlus size={18} /> Створити акаунт</>}
          </button>
        </form>

        <div className="auth-footer-modern">
          <span>{isLogin ? 'Ще немає акаунта?' : 'Вже є акаунт?'}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="link-btn-modern">
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;