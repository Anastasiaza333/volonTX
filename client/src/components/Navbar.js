import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Home, ClipboardList, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <ClipboardList className="logo-icon" />
          <span>VolonTX</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-btn"><Home size={18} /> Головна</Link>
          <Link to="/profile" className="nav-btn"><User size={18} /> Кабінет</Link>
          {user && (
            <button onClick={onLogout} className="nav-btn logout-btn">
              <LogOut size={18} /> Вийти
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;