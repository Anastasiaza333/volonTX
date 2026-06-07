import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, MapPin, Tag, AlignLeft } from 'lucide-react';

const CreateProjectForm = ({ user_id, onProjectCreated }) => {

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
  
      const res = await axios.post('http://localhost:5001/initiatives', { 
        title: project.title,
        description: project.description,
        location: project.location,
        category: project.category,
        organizer_id: user_id ,
        image_url: project.image_url
      });

      if (res.status === 201 || res.status === 200) {
        alert("Проєкт успішно опубліковано!");
        
     
        setProject({ 
          title: '', 
          description: '', 
          location: '', 
          category: 'Військова допомога' 
        });
        
      
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
<input 
    type="text" 
    placeholder="Посилання на картинку (URL)" 
    value={project.image_url || ''} 
    onChange={(e) => setProject({...project, image_url: e.target.value})} 
    className="form-control"
/>
        <button type="submit" className="btn-modern-help" disabled={loading}>
          {loading ? "Публікація..." : "Опублікувати проєкт"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;