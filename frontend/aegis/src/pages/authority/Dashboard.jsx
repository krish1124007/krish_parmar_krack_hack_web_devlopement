
import React, { useState, useEffect } from 'react';
import {
    FileText, CheckCircle, Clock, AlertTriangle, ChevronRight, Users, Briefcase
} from 'lucide-react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../utils/api';
import '../../styles/Dashboard.css';

const AuthorityDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [problems, setProblems] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [problemsRes, statsRes] = await Promise.all([
                apiFetch('http://localhost:8000/api/v1/authority/complaints'),
                apiFetch('http://localhost:8000/api/v1/authority/stats')
            ]);

            const problemsJson = await problemsRes.json();
            const statsJson = await statsRes.json();

            if (problemsJson.data?.success) {
                setProblems(problemsJson.data.data);
            }
            if (statsJson.data?.success) {
                setStatsData(statsJson.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: 'Domain Requests',
            value: statsData?.domain?.total || 0,
            icon: FileText,
            color: 'blue'
        },
        {
            title: 'Pending Acceptance',
            value: statsData?.domain?.pending || 0,
            icon: Clock,
            color: 'orange'
        },
        {
            title: 'Total In Progress',
            value: statsData?.domain?.inProgress || 0,
            icon: Briefcase,
            color: 'purple'
        },
        {
            title: 'Resolved Total',
            value: statsData?.domain?.resolved || 0,
            icon: CheckCircle,
            color: 'green'
        },
    ];

    const getRecentActivity = () => {
        return problems.slice(0, 5).map(prob => ({
            id: prob._id,
            user: prob.student?.name || 'Unknown Student',
            action: `reported: ${prob.title}`,
            time: new Date(prob.createdAt).toLocaleDateString(),
            status: prob.status === 'resolved' ? 'completed' : prob.status === 'progress' ? 'pending' : 'system'
        }));
    };

    const activities = getRecentActivity();

    return (
        <Layout
            role="authority"
            title={`Welcome back, ${user.name || 'Authority'}`}
            subtitle={`Authority Dashboard - ${user.department || 'Department Administration'}`}
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {/* Stats Grid */}
            <div className="dashboard-grid">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="action-card stat-card">
                            <div className={`icon-bg bg-${stat.color}-100 text-${stat.color}-600`}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{loading ? '...' : stat.value}</h3>
                                <p>{stat.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Content Split */}
            <div className="dashboard-grid split-grid">

                {/* Recent Complaints */}
                <div className="action-card wide-card">
                    <div className="card-header">
                        <h2>Recent Complaints</h2>
                        <button className="view-all-btn" onClick={() => window.location.href = '/authority/problems'}>View All</button>
                    </div>
                    <div className="activity-list">
                        {loading ? (
                            <p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading activities...</p>
                        ) : activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`status-indicator ${activity.status}`}></div>
                                    <div className="activity-details">
                                        <p className="activity-text">
                                            <strong>{activity.user}</strong> {activity.action}
                                        </p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-secondary" />
                                </div>
                            ))
                        ) : (
                            <p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No recent activity.</p>
                        )}
                    </div>
                </div>

                {/* Personal Load */}
                <div className="action-card">
                    <div className="card-header">
                        <h2>Your Workload</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Assigned to Me</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{statsData?.personal?.total || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>My In-Progress</span>
                            <span style={{ fontWeight: 600, color: 'var(--success)' }}>{statsData?.personal?.inProgress || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>High Priority Alert</span>
                            <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{statsData?.domain?.highPriority || 0}</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <button
                            className="submit-btn"
                            style={{ width: '100%' }}
                            onClick={() => window.location.href = '/authority/problems'}
                        >
                            Open Task List
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="action-card">
                    <div className="card-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <button className="quick-btn" onClick={() => window.location.href = '/authority/problems'}>
                            <Briefcase size={20} />
                            <span>Manage Problems</span>
                        </button>
                        <button className="quick-btn">
                            <FileText size={20} />
                            <span>Generate Report</span>
                        </button>
                        <button className="quick-btn">
                            <Users size={20} />
                            <span>My Department</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AuthorityDashboard;
