import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronRight, School, GraduationCap, Building2, UserCog, Moon, Sun } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.config.js';
import '../styles/Login.css';

const Login = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [theme, setTheme] = useState('light'); // 'light' or 'dark'
    const navigate = useNavigate();

    const roles = [
        { id: 'admin', label: 'Admin', icon: UserCog },
        { id: 'student', label: 'Student', icon: GraduationCap },
        { id: 'authority', label: 'Authority', icon: Building2 },
        { id: 'faculty', label: 'Faculty', icon: School }
    ];

    // Toggle Theme
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN(role), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // API responses use the shape: { status, message, data: { success, data: { ...payload } } }
            const payload = data.data?.data || {};
            const userData = payload[role] || payload.admin || payload.student || payload.user || {};
            const accessToken = payload.accessToken || payload.token || data.data?.accessToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', role);

            navigate(`/${role}/dashboard`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper" data-theme={theme}>
            {/* Left Side - Graphic Section (Swapped) */}
            <div className="graphic-section">
                <div className="sky-elements">
                    <div className="sun-moon"></div>
                    <div className="stars"></div>
                    <div className="clouds"></div>
                </div>
                <div className="mountain-scene">
                    <div className="mountain m-back"></div>
                    <div className="mountain m-mid"></div>
                    <div className="mountain m-fore"></div>
                    <div className="snow-overlay"></div>
                </div>
                <div className="graphic-text">
                    <h2>Aegis System</h2>
                    <p>Elevating Academic Excellence</p>
                </div>
            </div>

            {/* Right Side - Login Form (Swapped) */}
            <div className="login-section">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="login-content-box">
                    <div className="logo-area">

                        <h1>Welcome Back</h1>
                        <p>Sign in to your dashboard</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="role-selector">
                        {roles.map((r) => {
                            const Icon = r.icon;
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => setRole(r.id)}
                                    className={`role-item ${role === r.id ? 'active' : ''}`}
                                    type="button"
                                >
                                    <Icon size={18} />
                                    <span>{r.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-field">
                                <User className="field-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>


                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-field">
                                <Lock className="field-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <a href="#" className="forgot-pass">Forgot Password?</a>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <button type="submit" disabled={loading} className="signin-btn">
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </form>

                    <div className="footer-links">
                        <a href="#">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
