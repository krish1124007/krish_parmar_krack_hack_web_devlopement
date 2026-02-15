
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../utils/api';
import { API_ENDPOINTS } from '../../config/api.config';
import '../../styles/Dashboard.css';

const AdminProblems = () => {
    const [problems, setProblems] = useState([]);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await apiFetch(API_ENDPOINTS.PROBLEM.ALL);
            const data = await response.json();
            if (data.success) {
                setProblems(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch problems", error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await apiFetch(API_ENDPOINTS.PROBLEM.UPDATE(id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                setMessage(`Problem status updated to ${newStatus}`);
                fetchProblems();
            } else {
                setMessage(data.message || 'Failed to update status');
            }
        } catch (error) {
            setMessage('Error updating status');
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <Layout
            role="admin"
            title="Problem Hub"
            subtitle="Overview of all reported issues"
            user={user}
            activeTab="problems" // This aligns with Sidebar logic
        >
            <div className="content-body">
                {message && <div className="status-toast success">{message}</div>}

                <div className="content-section">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Department</th>
                                    <th>Reported By</th>
                                    <th>Date</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((prob) => (
                                    <tr key={prob._id}>
                                        <td>
                                            <strong>{prob.title}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{prob.description.substring(0, 50)}...</div>
                                        </td>
                                        <td>{prob.department}</td>
                                        <td>{prob.student?.name || 'Unknown'}</td>
                                        <td>{new Date(prob.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-text ${prob.priority}`}>
                                                {prob.priority.charAt(0).toUpperCase() + prob.priority.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${prob.status === 'resolved' ? 'active' : prob.status === 'progress' ? 'pending' : 'new'}`}>
                                                {prob.status.charAt(0).toUpperCase() + prob.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {prob.status !== 'progress' && prob.status !== 'resolved' && (
                                                    <button
                                                        className="view-all-btn"
                                                        onClick={() => handleUpdateStatus(prob._id, 'progress')}
                                                    >
                                                        Start
                                                    </button>
                                                )}
                                                {prob.status !== 'resolved' && (
                                                    <button
                                                        className="view-all-btn"
                                                        style={{ color: 'var(--success)' }}
                                                        onClick={() => handleUpdateStatus(prob._id, 'resolved')}
                                                    >
                                                        Resolve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {problems.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No issues reported system-wide.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminProblems;
