
import React, { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import { Search, Plus, Upload, Users } from 'lucide-react';

const StudentManagement = ({ students, classes, onRefresh }) => {
    const [showForm, setShowForm] = useState(false);
    const [showBulkForm, setShowBulkForm] = useState(false);
    const [studentData, setStudentData] = useState({ name: '', email: '', classId: '' });
    const [bulkFile, setBulkFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('http://localhost:8000/api/v1/admin/create-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Student Created Successfully');
                setStudentData({ name: '', email: '', classId: '' });
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

    const handleBulkCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('file', bulkFile);

        try {
            const res = await apiFetch('http://localhost:8000/api/v1/admin/bulk-create-students', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Bulk Upload Success: ${data.data?.data?.createdCount || 0} students created`);
                setBulkFile(null);
                setShowBulkForm(false);
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
            const res = await apiFetch(`http://localhost:8000/api/v1/admin/delete-student/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setMessage('Student Deleted');
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
                <h2>Student Management</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="header-btn" onClick={() => { setShowBulkForm(!showBulkForm); setShowForm(false); }}>
                        {showBulkForm ? <><Search size={18} /> View List</> : <><Users size={18} /> Bulk Create</>}
                    </button>
                    <button className="header-btn" onClick={() => { setShowForm(!showForm); setShowBulkForm(false); }}>
                        {showForm ? <><Search size={18} /> View List</> : <><Plus size={18} /> Create New</>}
                    </button>
                </div>
            </div>

            {showBulkForm ? (
                <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Bulk Create Students</h2>
                            <p>Upload Excel file with student data</p>
                        </div>
                    </div>
                    <form onSubmit={handleBulkCreate} className="glass-form">
                        <div className="form-group file-group">
                            <label>Student List (Excel)</label>
                            <label className="file-label" style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '1.5rem', border: '2px dashed var(--primary)', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <Upload size={32} className="text-primary" />
                                <span className="file-text" style={{ fontWeight: 500 }}>
                                    {bulkFile ? bulkFile.name : "Click to Upload Excel File"}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {bulkFile ? `${(bulkFile.size / 1024).toFixed(1)} KB` : "Drag and drop or browse"}
                                </span>
                                <input
                                    type="file"
                                    onChange={e => setBulkFile(e.target.files[0])}
                                    accept=".xlsx,.xls"
                                    hidden
                                />
                            </label>
                            <div className="info-box" style={{ marginTop: '0.5rem' }}>
                                Excel format: <code>name</code> and <code>emailid</code> columns required.
                            </div>
                        </div>
                        <button type="submit" className="submit-btn" disabled={!bulkFile || loading}>
                            {loading ? 'Uploading...' : 'Create Students'}
                        </button>
                    </form>
                </div>
            ) : showForm ? (
                <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Create New Student</h2>
                            <p>Fill in the details below</p>
                        </div>
                    </div>
                    <form onSubmit={handleCreateStudent} className="glass-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={studentData.name}
                                onChange={e => setStudentData({ ...studentData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={studentData.email}
                                onChange={e => setStudentData({ ...studentData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Assign Class (Optional)</label>
                            <select
                                value={studentData.classId}
                                onChange={e => setStudentData({ ...studentData, classId: e.target.value })}
                                className="select-input"
                                style={{ padding: '0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '100%' }}
                            >
                                <option value="">Select a Class</option>
                                {classes.map(cls => (
                                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Student'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email/ID</th>
                                <th>Class</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((row) => (
                                <tr key={row._id}>
                                    <td><span style={{ fontWeight: 500 }}>{row.name}</span></td>
                                    <td>{row.email || row.id}</td>
                                    <td>{classes.find(c => c._id === row.myclass)?.name || row.className || '-'}</td>
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
                            {students.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No records found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
