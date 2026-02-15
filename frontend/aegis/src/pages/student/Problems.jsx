
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import '../../styles/Dashboard.css';

const StudentProblems = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // User Data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('accessToken');


    const [domains, setDomains] = useState([]);
    const [newProblem, setNewProblem] = useState({
        title: '',
        description: '',
        department: '',
        domainId: '',
        priority: 'medium',
        image: null
    });

    // Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    useEffect(() => {
        fetchProblems();
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/student/get-domains', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.data.success) {
                console.log(data.data.data)
                setDomains(data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch domains", error);
        }
    };

    const fetchProblems = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/problem/student/problems', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.data.success) {
                setProblems(data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch problems", error);
        }
    };

    const handleCreateProblem = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', newProblem.title);
            formData.append('description', newProblem.description);
            formData.append('department', newProblem.department);
            formData.append('domainId', newProblem.domainId);
            formData.append('priority', newProblem.priority);
            if (newProblem.image) {
                formData.append('image', newProblem.image);
            }

            const response = await fetch('http://localhost:8000/api/v1/problem/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.data.success) {
                setMessage('Problem report submitted successfully!');
                setShowForm(false);
                setNewProblem({ title: '', description: '', department: '', domainId: '', priority: 'medium', image: null });
                fetchProblems();
            } else {
                setMessage(data.message || 'Failed to submit problem');
            }
        } catch (error) {
            setMessage('Error submitting problem');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <Layout
            role="student"
            title="Problem Center"
            subtitle="Report and track your issues"
            user={user}
            activeTab="problems"
        >
            <div className="content-body">
                {message && <div className={`status-toast ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

                <div className="content-section">
                    <div className="section-header">
                        <h2>My Reports</h2>
                        <button className="header-btn" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'View List' : <><Plus size={18} /> New Report</>}
                        </button>
                    </div>

                    {showForm ? (
                        <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <div className="card-header">
                                <div className="card-title">
                                    <h2>Report an Issue</h2>
                                    <p>Please provide details about the problem</p>
                                </div>
                            </div>
                            <form onSubmit={handleCreateProblem} className="glass-form">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={newProblem.title}
                                        onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                                        required
                                        placeholder="Brief summary of the issue"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={newProblem.description}
                                        onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                                        required
                                        placeholder="Detailed description..."
                                        style={{
                                            width: '100%',
                                            minHeight: '100px',
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--input-border)',
                                            background: 'var(--input-bg)',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department / Domain</label>
                                    <select
                                        value={newProblem.domainId}
                                        onChange={(e) => {
                                            const selectedDomain = domains.find(d => d._id === e.target.value);
                                            setNewProblem({
                                                ...newProblem,
                                                domainId: e.target.value,
                                                department: selectedDomain ? selectedDomain.name : ''
                                            });
                                        }}
                                        required
                                        style={{
                                            width: '100%',
                                            height: '48px',
                                            padding: '0 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--input-border)',
                                            background: 'var(--input-bg)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <option value="">Select Domain</option>
                                        {domains.map(domain => (
                                            <option key={domain._id} value={domain._id}>{domain.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        value={newProblem.priority}
                                        onChange={(e) => setNewProblem({ ...newProblem, priority: e.target.value })}
                                        style={{
                                            width: '100%',
                                            height: '48px',
                                            padding: '0 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--input-border)',
                                            background: 'var(--input-bg)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="form-group file-group">
                                    <label className="file-label" htmlFor="problem-image-input">
                                        <span className="file-text">{newProblem.image ? newProblem.image.name : "Upload Image/Proof"}</span>
                                        <Plus size={16} />
                                    </label>
                                    <input
                                        id="problem-image-input"
                                        type="file"
                                        onChange={(e) => setNewProblem({ ...newProblem, image: e.target.files[0] })}
                                        accept="image/*"
                                        hidden
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </form>
                        </div>

                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Department</th>
                                        <th>Priority</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Accepted By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.map((prob) => (
                                        <tr key={prob._id}>
                                            <td>{prob.title}</td>
                                            <td>{prob.department}</td>
                                            <td>
                                                <span className={`status-text ${prob.priority}`}>
                                                    {prob.priority.charAt(0).toUpperCase() + prob.priority.slice(1)}
                                                </span>
                                            </td>
                                            <td>{new Date(prob.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${prob.status === 'resolved' ? 'active' : prob.status === 'progress' ? 'pending' : 'new'}`}>
                                                    {prob.status.charAt(0).toUpperCase() + prob.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>{prob.acceptedBy ? prob.acceptedBy.name : '-'}</td>
                                            <td>
                                                <button
                                                    className="view-all-btn"
                                                    onClick={() => { setSelectedProblem(prob); setShowDetailsModal(true); }}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {problems.length === 0 && (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                                No problems reported yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedProblem && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="action-card" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>{selectedProblem.title}</h2>
                            <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ margin: '1.5rem 0' }}>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</h4>
                            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{selectedProblem.description}</p>
                        </div>

                        {selectedProblem.image && (
                            <div style={{ margin: '1.5rem 0' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Attachment</h4>
                                <img src={selectedProblem.image} alt="Problem Proof" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                            </div>
                        )}

                        <div style={{ margin: '1.5rem 0' }}>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>History & Comments</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedProblem.comments && selectedProblem.comments.length > 0 ? (
                                    selectedProblem.comments.map((comment, idx) => (
                                        <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong style={{ color: 'var(--primary)' }}>{comment.by?.name || 'Authority'}</strong>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p style={{ color: 'var(--text-primary)', margin: 0 }}>{comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet.</p>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button className="header-btn" onClick={() => setShowDetailsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default StudentProblems;
