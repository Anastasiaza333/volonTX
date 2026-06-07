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
      const res = await axios.get('http://localhost:5001/initiatives'); // Переконайся, що тут правильний роут
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

  const getPlaceholderImage = (category, id) => {
    const cat = category ? category.toLowerCase().trim() : 'community';
    
    const images = {
      'військова допомога': 'https://cdn.pixabay.com/photo/2016/02/05/15/34/soldier-1181064_600.jpg',
      'гуманітарна допомога': 'https://cdn.pixabay.com/photo/2017/08/07/19/43/charity-2607141_600.jpg',
      'тварини': 'https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_600.jpg',
      'медицина': 'https://cdn.pixabay.com/photo/2017/10/04/18/27/doctor-2817035_600.jpg',
      'екологія': 'https://cdn.pixabay.com/photo/2015/12/04/14/05/tree-1076532_600.jpg',
      'освіта': 'https://cdn.pixabay.com/photo/2016/09/10/17/18/book-1659717_600.jpg',
      'допомога старшим': 'https://cdn.pixabay.com/photo/2017/08/07/22/57/people-2608823_600.jpg',
      'default': 'https://cdn.pixabay.com/photo/2016/11/08/05/11/hands-1807503_600.jpg'
    };

    return images[cat] || images['default'];
  };

  const filteredInitiatives = initiatives.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const itemCat = item.category ? item.category.toLowerCase().trim() : '';
    const selectedCat = selectedCategory.toLowerCase().trim();

    const matchesCategory = selectedCategory === 'Всі' || 
                            itemCat === selectedCat || 
                            (selectedCat.includes('гуманітарна') && itemCat === 'допомога');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-view">
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
                <div className="card-image-wrapper">
                  {}
                  <img 
                    src={item.image_url || getPlaceholderImage(item.category, item.id)} 
                    alt={item.title}
                    className="card-img"
                    referrerPolicy="no-referrer" 
                  />
                </div>
                
                <div className="card-body">
                  <div className="card-top">
                    <h3>{item.title}</h3>
                    <span className={`category-tag ${item.category === 'Військова допомога' ? 'military' : ''}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="card-desc">{item.description}</p>
                  <div className="card-meta">
                    <div className="meta-item"><MapPin size={14} /> <span>{item.location}</span></div>
                    <div className="meta-item"><Users size={14}/> {item.volunteer_count || 0} волонтерів</div>
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