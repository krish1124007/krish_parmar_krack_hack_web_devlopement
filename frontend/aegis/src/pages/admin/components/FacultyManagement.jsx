
import React, { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import { API_ENDPOINTS } from '../../../config/api.config';
import { Search, Plus } from 'lucide-react';

const FacultyManagement = ({ faculties, onRefresh }) => {
    const [showForm, setShowForm] = useState(false);
    const [facultyData, setFacultyData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch(API_ENDPOINTS.ADMIN.CREATE_FACULTY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(facultyData)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Faculty Created Successfully');
                setFacultyData({ name: '', email: '' });
                setShowForm(false);
                onRefresh();
            } else throw new Error(data.message);
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            const res = await apiFetch(API_ENDPOINTS.ADMIN.DELETE_FACULTY(id), { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setMessage('Faculty Deleted');
                onRefresh();
            } else {
                setMessage(data.message || 'Delete failed');
            }
        } catch (err) {
            setMessage('Error deleting item: ' + err.message);
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="content-section fade-in">
            {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            <div className="section-header">
                <h2>Faculty Management</h2>
                <button className="header-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><Search size={18} /> View List</> : <><Plus size={18} /> Create New</>}
                </button>
            </div>

            {showForm ? (
                <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Create New Faculty</h2>
                            <p>Fill in the details below</p>
                        </div>
                    </div>
                    <form onSubmit={handleCreateFaculty} className="glass-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={facultyData.name}
                                onChange={e => setFacultyData({ ...facultyData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={facultyData.email}
                                onChange={e => setFacultyData({ ...facultyData, email: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Faculty'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculties.map((row) => (
                                <tr key={row._id}>
                                    <td><span style={{ fontWeight: 500 }}>{row.name}</span></td>
                                    <td>{row.email}</td>
                                    <td>{row.department || '-'}</td>
                                    <td>
                                        <div className="badge active">
                                            Active
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button className="header-btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                                            <button className="header-btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-op, rgba(255,0,0,0.2))' }} onClick={() => handleDelete(row._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {faculties.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No records found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FacultyManagement;
