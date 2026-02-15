
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import FacultyClassDetails from './FacultyClassDetails';
import { apiFetch } from '../../utils/api';
import { School, Users, BookOpen } from 'lucide-react';
import '../../styles/Dashboard.css';

const FacultyDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return `Welcome, ${user.name || 'Faculty'}`;
            case 'classes': return 'My Classes';
            case 'profile': return 'Profile';
            default: return 'Faculty Portal';
        }
    };

    return (
        <Layout
            role="faculty"
            title={getTitle()}
            subtitle="Faculty Portal"
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            theme={theme}
            toggleTheme={toggleTheme}
        >
            {activeTab === 'dashboard' && (
                <div className="content-section fade-in">
                    <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <h2>My Dashboard</h2>
                                <p>Welcome to your faculty portal</p>
                            </div>
                        </div>
                        <div className="glass-form" style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <Users size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Name</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{user.name || 'Not set'}</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <BookOpen size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Email</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{user.email || 'Not set'}</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <School size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Role</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Faculty Member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'classes' && <FacultyClassDetails />}

            {activeTab === 'profile' && (
                <div className="content-section fade-in">
                    <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <h2>My Profile</h2>
                                <p>View your information</p>
                            </div>
                        </div>
                        <div className="glass-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={user.name || ''} readOnly style={{ background: 'var(--bg-secondary)' }} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={user.email || ''} readOnly style={{ background: 'var(--bg-secondary)' }} />
                            </div>
                            <div className="info-box">
                                Contact your administrator to update your profile information.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default FacultyDashboard;
