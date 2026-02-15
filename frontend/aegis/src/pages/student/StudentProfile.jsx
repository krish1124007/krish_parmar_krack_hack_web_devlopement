
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../utils/api';
import '../../styles/Dashboard.css';

const StudentProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        enrollmentNo: '',
        className: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch latest profile data
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiFetch('http://localhost:8000/api/v1/student/profile');
            const data = await response.json();
            if (data.data.success) {
                const student = data.data.data;
                setFormData({
                    name: student.name || '',
                    email: student.email || '',
                    enrollmentNo: student.enrollmentNo || '',
                    className: student.myclass ? student.myclass.name : ''
                });
                // Update local storage user if needed
                const updatedUser = { ...user, ...student };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiFetch('http://localhost:8000/api/v1/student/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    enrollmentNo: formData.enrollmentNo
                })
            });

            const data = await response.json();
            if (data.data.success) {
                setMessage('Profile updated successfully');
                fetchProfile();
            } else {
                setMessage(data.message || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <Layout
            role="student"
            title="My Profile"
            subtitle="Manage your personal information"
            user={user}
            activeTab="settings" // Using settings as specific tab wasn't requested but implies profile
        >
            <div className="content-body" style={{ maxWidth: '800px' }}>
                {message && <div className={`status-toast ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

                <div className="action-card" style={{ padding: '2rem', background: 'var(--card-bg)' }}>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ color: 'var(--text-secondary)' }}>Email Address (Read-only)</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ color: 'var(--text-secondary)' }}>Enrollment Number</label>
                            <input
                                type="text"
                                value={formData.enrollmentNo}
                                onChange={e => setFormData({ ...formData, enrollmentNo: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                placeholder="Enter enrollment number"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ color: 'var(--text-secondary)' }}>Class (Read-only)</label>
                            <input
                                type="text"
                                value={formData.className}
                                disabled
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}
                                placeholder="Class not assigned"
                            />
                            <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                                * Class is assigned during login/registration. Contact admin to change.
                            </small>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default StudentProfile;
