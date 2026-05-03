import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Send, Search, Users, Check, TrendingUp, Heart, ShieldCheck } from 'lucide-react';

const Home = ({ user }) => {
  const [initiatives, setInitiatives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');

  const categories = ['Всі', 'Військова допомога', 'Гуманітарна допомога', 'Екологія', 'Медицина', 'Тварини', 'Освіта'];

  useEffect(() => {
    fetchInitiatives();
    fetchApplications();
  }, []);

  const fetchInitiatives = async () => {
    try {
      const res = await axios.get('http://localhost:5001/projects'); 
      setInitiatives(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5001/applications');
      setApplications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleApply = async (id) => {
    if (!user) return alert("Будь ласка, увійдіть в систему");
    try {
      await axios.post('http://localhost:5001/applications', { user_id: user.id, initiative_id: id });
      fetchApplications();
    } catch (err) { console.error(err); }
  };

  const filteredInitiatives = initiatives.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Всі' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPlaceholderImage = (category) => {
    const images = {
      'Військова допомога': 'https://images.unsplash.com/photo-1590231338245-08282f2dbb3d?q=80&w=500',
      'Тварини': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?q=80&w=500',
      'Медицина': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
      'DEFAULT': 'https://images.unsplash.com/photo-1559027615-cd26735550b0?q=80&w=500'
    };
    return images[category] || images['DEFAULT'];
  };

  return (
    <div className="home-view">
      {/* --- ОСЬ ВІН, БЛОК СТАТИСТИКИ --- */}
      <section className="stats-header">
        <div className="stat-item">
          <div className="stat-icon"><TrendingUp size={24} color="#4f46e5" /></div>
          <div className="stat-info">
            <h4>{initiatives.length || 0}</h4>
            <p>Активних зборів</p>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon"><Heart size={24} color="#ef4444" /></div>
          <div className="stat-info">
            <h4>{applications.length || 0}</h4>
            <p>Відгуків волонтерів</p>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon"><ShieldCheck size={24} color="#10b981" /></div>
          <div className="stat-info">
            <h4>100%</h4>
            <p>Перевірені фонди</p>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            placeholder="Пошук ініціатив (Херсон, ЗСУ...)" 
            className="search-input" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="categories-filter">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`} 
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="initiatives-grid">
          {filteredInitiatives.map(item => {
            const hasApplied = applications.some(app => app.initiative_id === item.id && app.user_id === user?.id);
            return (
              <div key={item.id} className="modern-card">
                <div className="card-image">
                  <img src={getPlaceholderImage(item.category)} alt={item.title} />
                </div>
                
                <div className="card-body">
                  <div className="card-top">
                    <h3>{item.title}</h3>
                    <span className={`category-tag ${item.category === 'Військова допомога' ? 'military' : ''}`}>
                      {item.category}
                    </span>
                  </div>
                  <p>{item.description}</p>
                  <div className="card-meta">
                    <MapPin size={14} /> <span>{item.location}</span>
                    <div className="v-count"><Users size={14}/> {item.volunteer_count || 0} волонтерів</div>
                  </div>
                </div>
                <button 
                  className={hasApplied ? "btn-modern-applied" : "btn-modern-help"} 
                  onClick={() => !hasApplied && handleApply(item.id)}
                  disabled={hasApplied}
                >
                  {hasApplied ? <><Check size={16}/> Подано</> : <><Send size={16}/> Допомогти</>}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;