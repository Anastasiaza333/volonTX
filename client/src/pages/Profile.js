import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, ClipboardCheck, Clock, Settings, Briefcase, Check, X, Mail } from 'lucide-react';
import CreateProjectForm from '../components/CreateProjectForm';

const Profile = ({ user }) => {
    const [myApplications, setMyApplications] = useState([]); // Для волонтера
    const [incomingRequests, setIncomingRequests] = useState([]); // Для організатора
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user.role === 'volunteer') {
                    // Волонтер бачить свої відгуки
                    const res = await axios.get(`http://localhost:5001/applications?user_id=${user.id}`);
                    setMyApplications(res.data);
                } else if (user.role === 'organizer') {
                    // Організатор бачить заявки на свої проєкти
                    // Спочатку отримуємо всі проєкти, а потім заявки (або через спеціальний ендпоінт)
                    const res = await axios.get(`http://localhost:5001/applications/organizer/${user.id}`);
                    setIncomingRequests(res.data);
                }
            } catch (err) {
                console.error("Помилка завантаження даних профілю:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [user.id, user.role]);

    // Функція для зміни статусу заявки організатором
    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5001/applications/${appId}`, { status: newStatus });
            // Оновлюємо локальний список після зміни на сервері
            setIncomingRequests(prev => prev.map(app => 
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error("Помилка оновлення статусу:", err);
        }
    };

    return (
        <div className="profile-container">
            {/* Хедер профілю */}
            <header className="profile-header modern-card">
                <div className="user-avatar-large">
                    <User size={40} />
                </div>
                <div className="user-details">
                    <h1>{user.full_name}</h1>
                    <span className="role-tag">{user.role === 'organizer' ? 'Організатор' : 'Волонтер'}</span>
                    <p className="user-email-subtext"><Mail size={14} /> {user.email || 'user@example.com'}</p>
                </div>
                <button className="settings-btn"><Settings size={20} /></button>
            </header>

            <div className="profile-grid">
                {/* Секція для ВОЛОНТЕРА */}
                {user.role === 'volunteer' && (
                    <div className="profile-section">
                        <div className="section-title">
                            <ClipboardCheck size={22} />
                            <h2>Мої відгуки на проєкти</h2>
                        </div>
                        
                        <div className="applications-list">
                            {myApplications.length > 0 ? (
                                myApplications.map(app => (
                                    <div key={app.id} className="app-card modern-card">
                                        <div className="app-info">
                                            <h4>Проєкт: {app.initiative_title || `ID: ${app.initiative_id}`}</h4>
                                            <p><Clock size={14} /> Статус оновлено: {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <span className={`status-pill ${app.status || 'pending'}`}>
                                            {app.status === 'accepted' ? 'Прийнято' : app.status === 'rejected' ? 'Відхилено' : 'В очікуванні'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state modern-card">
                                    <p>Ви ще не подали жодної заявки. Час знайти крутий проєкт!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Секція для ОРГАНІЗАТОРА */}
                {user.role === 'organizer' && (
                    <div className="profile-section admin-panel">
                        <div className="section-title">
                            <Briefcase size={22} />
                            <h2>Панель управління організатора</h2>
                        </div>
                        
                        <div className="management-tools">
                            <CreateProjectForm user_id={user.id} />
                            
                            <div className="admin-inbox modern-card">
                                <h3>Нові запити на участь</h3>
                                {incomingRequests.length > 0 ? (
                                    <div className="requests-table">
                                        {incomingRequests.filter(a => a.status === 'pending').map(request => (
                                            <div key={request.id} className="request-item">
                                                <div className="request-user-info">
                                                    <strong>{request.volunteer_name}</strong>
                                                    <span>хоче долучитися до: <i>{request.initiative_title}</i></span>
                                                </div>
                                                <div className="request-actions">
                                                    <button 
                                                        className="action-btn accept" 
                                                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                                                        title="Прийняти"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button 
                                                        className="action-btn reject" 
                                                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                        title="Відхилити"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="hint">Наразі нових запитів немає.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;