
import React from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ title, subtitle, user, onSearch, theme, toggleTheme }) => {
    const name = (user && user.name) ? user.name : 'User';
    const initial = name.charAt(0).toUpperCase();

    return (
        <header className="top-bar">
            <div className="header-titles">
                <h1>{title}</h1>
                <p className="subtitle">{subtitle}</p>
            </div>

            <div className="header-actions">
                <div className="search-wrapper">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>

                <button className="nav-icon-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>

                {toggleTheme && (
                    <button className="nav-icon-btn" title="Toggle Theme" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                )}

                <div className="profile-container" title={name}>
                    <div className="profile-pic">{initial}</div>
                    <div className="profile-text">
                        <div className="profile-name">{name}</div>
                        {user && user.email && <div className="profile-role">{user.email}</div>}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
