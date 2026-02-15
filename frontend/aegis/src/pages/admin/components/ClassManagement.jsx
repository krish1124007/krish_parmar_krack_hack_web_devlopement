
import React, { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import { API_ENDPOINTS } from '../../../config/api.config';
import { Search, Plus, Upload } from 'lucide-react';

const ClassManagement = ({ classes, faculties, onRefresh }) => {
    const [showForm, setShowForm] = useState(false);
    const [classData, setClassData] = useState({ name: '', teacherId: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await apiFetch(API_ENDPOINTS.ADMIN.CREATE_CLASS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: classData.name,
                    teacherId: classData.teacherId
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Class Created Successfully');
                setClassData({ name: '', teacherId: '' });
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
            const res = await apiFetch(API_ENDPOINTS.ADMIN.DELETE_CLASS(id), { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setMessage('Class Deleted');
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
                <h2>Class Management</h2>
                <button className="header-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><Search size={18} /> View List</> : <><Plus size={18} /> Create New</>}
                </button>
            </div>

            {showForm ? (
                <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Create New Class</h2>
                            <p>Fill in the details below</p>
                        </div>
                    </div>
                    <form onSubmit={handleCreateClass} className="glass-form">
                        <div className="form-group">
                            <label>Class Name</label>
                            <input
                                type="text"
                                value={classData.name}
                                onChange={e => setClassData({ ...classData, name: e.target.value })}
                                required
                                placeholder="e.g. CS-A"
                            />
                        </div>
                        <div className="form-group">
                            <label>Teacher</label>
                            <select
                                value={classData.teacherId}
                                onChange={e => setClassData({ ...classData, teacherId: e.target.value })}
                                required
                                className="select-input"
                                style={{ padding: '0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '100%' }}
                            >
                                <option value="">Select Faculty</option>
                                {faculties.map(fac => (
                                    <option key={fac._id} value={fac._id}>{fac.name} ({fac.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-box" style={{ marginTop: '1rem' }}>
                            Students can enroll in this class from their dashboard after it's created.
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Class'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Teacher</th>
                                <th>Students Count</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((row) => (
                                <tr key={row._id}>
                                    <td><span style={{ fontWeight: 500 }}>{row.name}</span></td>
                                    <td>{
                                        /* Find teacher name if ref populated or available in faculties list, otherwise show ID */
                                        faculties.find(f => f._id === row.teacher)?.name || row.teacher || '-'
                                    }</td>
                                    <td>{row.enrolledStudents ? row.enrolledStudents.length : 0}</td>
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
                            {classes.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No records found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div >
    );
};

export default ClassManagement;
