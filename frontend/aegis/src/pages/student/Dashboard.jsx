import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { School, BookOpen, Calendar, Trophy, UserCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api.config';
import Layout from '../../components/Layout';
import MyClasses from './MyClasses';
import '../../styles/Dashboard.css';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (activeTab === 'classes') {
            fetchClasses();
        }
    }, [activeTab]);

    const fetchClasses = async () => {
        try {
            const res = await apiFetch(API_ENDPOINTS.STUDENT.EXPLORE_CLASSES);
            const data = await res.json();
            if (data.data.success) {
                setClasses(data.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch classes', err);
        }
    };

    const handleEnroll = async (classId) => {
        setLoading(true);
        try {
            const res = await apiFetch(API_ENDPOINTS.STUDENT.ENROLL_CLASS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Enrolled successfully!');
                fetchClasses(); // Refresh list
            } else {
                setMessage(data.message || 'Enrollment failed');
            }
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return `Welcome, ${user.name || 'Student'}`;
            case 'my-classes': return 'My Classes';
            case 'classes': return 'Explore Classes';
            case 'profile': return 'Profile';
            default: return 'Student Portal';
        }
    };

    return (
        <Layout
            role="student"
            title={getTitle()}
            subtitle="Student Portal"
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            theme={theme}
            toggleTheme={toggleTheme}
        >
            {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            {activeTab === 'dashboard' && (
                <div className="content-section fade-in">
                    <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <h2>My Dashboard</h2>
                                <p>Welcome to your student portal</p>
                            </div>
                        </div>
                        <div className="glass-form" style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <UserCircle size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Name</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{user.name || 'Not set'}</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <BookOpen size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Enrollment No</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{user.enrollmentNo || 'Not set'}</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <School size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>My Class</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{user.myclass?.name || 'Not enrolled'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'my-classes' && <MyClasses />}

            {activeTab === 'classes' && (
                <div className="content-section fade-in">
                    <div className="section-header">
                        <h2>Available Classes</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Browse and enroll in classes</p>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Class Name</th>
                                    <th>Teacher</th>
                                    <th>Enrolled Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((cls) => (
                                    <tr key={cls._id}>
                                        <td><span style={{ fontWeight: 500 }}>{cls.name}</span></td>
                                        <td>{cls.teacher?.name || '-'}</td>
                                        <td>{cls.enrolledStudents?.length || 0}</td>
                                        <td>
                                            <button
                                                className="header-btn"
                                                style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                                                onClick={() => handleEnroll(cls._id)}
                                                disabled={loading || cls.enrolledStudents?.some(s => s._id === user._id)}
                                            >
                                                {cls.enrolledStudents?.some(s => s._id === user._id) ? 'Enrolled' : 'Enroll'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {classes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                            No classes available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="content-section fade-in">
                    <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <h2>My Profile</h2>
                                <p>View and update your information</p>
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
                            <div className="form-group">
                                <label>Enrollment Number</label>
                                <input type="text" value={user.enrollmentNo || 'Not set'} readOnly style={{ background: 'var(--bg-secondary)' }} />
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

export default StudentDashboard;
