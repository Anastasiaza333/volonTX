import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, MapPin, Tag, AlignLeft } from 'lucide-react';

const CreateProjectForm = ({ user_id, onProjectCreated }) => {
  // Стан називаємо project, як у твоїх інпутах
  const [project, setProject] = useState({ 
    title: '', 
    description: '', 
    location: '', 
    category: 'Військова допомога' 
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Використовуємо порт 5001 та шлях /initiatives
      // Передаємо дані саме зі стану 'project'
      const res = await axios.post('http://localhost:5001/initiatives', { 
        title: project.title,
        description: project.description,
        location: project.location,
        category: project.category,
        organizer_id: user_id 
      });

      if (res.status === 201 || res.status === 200) {
        alert("Проєкт успішно опубліковано!");
        
        // Очищуємо форму
        setProject({ 
          title: '', 
          description: '', 
          location: '', 
          category: 'Військова допомога' 
        });
        
        // Оновлюємо список проєктів на сторінці, якщо функція передана
        if (onProjectCreated) onProjectCreated(); 
      }
    } catch (err) {
      console.error("Помилка створення проєкту:", err);
      const errorMessage = err.response?.data?.message || "Не вдалося створити проєкт. Перевірте з'єднання з сервером.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-card modern-card">
      <h3><PlusCircle size={20} /> Створити нову ініціативу</h3>
      <form onSubmit={handleSubmit} className="modern-form">
        <div className="input-row">
          <div className="input-field">
            <Tag size={16} />
            <input 
              type="text"
              placeholder="Назва проєкту" 
              value={project.title} 
              onChange={e => setProject({...project, title: e.target.value})} 
              required 
            />
          </div>
          <div className="input-field">
            <MapPin size={16} />
            <input 
              type="text"
              placeholder="Місто/Локація" 
              value={project.location} 
              onChange={e => setProject({...project, location: e.target.value})} 
              required 
            />
          </div>
        </div>
        
        <div className="input-field">
          <select 
            value={project.category} 
            onChange={e => setProject({...project, category: e.target.value})}
            className="modern-select"
          >
            <option value="Військова допомога">Військова допомога</option>
            <option value="Гуманітарна допомога">Гуманітарна допомога</option>
            <option value="Медицина">Медицина</option>
            <option value="Тварини">Тварини</option>
            <option value="Освіта">Освіта</option>
          </select>
        </div>

        <div className="input-field textarea-field">
          <AlignLeft size={16} style={{ alignSelf: 'flex-start', marginTop: '10px' }} />
          <textarea 
            placeholder="Детальний опис: мета, що потрібно, як долучитися..." 
            value={project.description} 
            onChange={e => setProject({...project, description: e.target.value})} 
            required 
          />
        </div>

        <button type="submit" className="btn-modern-help" disabled={loading}>
          {loading ? "Публікація..." : "Опублікувати проєкт"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;