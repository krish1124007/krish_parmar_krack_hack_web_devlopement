
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../utils/api';
import { API_ENDPOINTS } from '../../config/api.config';
import '../../styles/Dashboard.css';

const AuthorityProblems = () => {
    const [problems, setProblems] = useState([]);
    const [colleagues, setColleagues] = useState([]);
    const [message, setMessage] = useState('');

    // Modals state
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const [selectedProblem, setSelectedProblem] = useState(null);
    const [transferTargetId, setTransferTargetId] = useState('');
    const [statusComment, setStatusComment] = useState('');
    const [targetStatus, setTargetStatus] = useState('');

    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchProblems();
        fetchColleagues();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await apiFetch(API_ENDPOINTS.AUTHORITY.COMPLAINTS);
            const data = await response.json();
            console.log(data)
            if (data.data.success) {
                setProblems(data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch problems", error);
        }
    };

    const fetchColleagues = async () => {
        try {
            const response = await apiFetch(API_ENDPOINTS.AUTHORITY.COLLEAGUES);
            const data = await response.json();
            if (data.data.success) {
                setColleagues(data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch colleagues", error);
        }
    };

    const handleAccept = async (id) => {
        try {
            const response = await apiFetch(API_ENDPOINTS.AUTHORITY.ACCEPT_COMPLAINT(id), {
                method: 'POST'
            });
            const data = await response.json();
            if (data.data.success) {
                setMessage('Job Accepted Successfully');
                fetchProblems();
            } else {
                setMessage(data.message || 'Failed to accept job');
            }
        } catch (error) {
            setMessage('Error accepting job');
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const openStatusModal = (problem, status) => {
        setSelectedProblem(problem);
        setTargetStatus(status);
        setStatusComment('');
        setShowStatusModal(true);
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            const response = await apiFetch(API_ENDPOINTS.AUTHORITY.UPDATE_STATUS(selectedProblem._id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: targetStatus, comment: statusComment })
            });

            const data = await response.json();
            if (data.data.success) {
                setMessage(`Problem status updated to ${targetStatus}`);
                setShowStatusModal(false);
                setStatusComment('');
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

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            const response = await apiFetch(API_ENDPOINTS.AUTHORITY.TRANSFER_COMPLAINT(selectedProblem._id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetAuthorityId: transferTargetId })
            });
            const data = await response.json();
            if (data.data.success) {
                setMessage('Job Transferred Successfully');
                setShowTransferModal(false);
                setTransferTargetId('');
                fetchProblems();
            } else {
                setMessage(data.message || 'Failed to transfer job');
            }
        } catch (error) {
            setMessage('Error transferring job');
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const openDetails = (problem) => {
        setSelectedProblem(problem);
        setShowDetailsModal(true);
    };

    return (
        <Layout
            role="authority"
            title="Department Issues"
            subtitle={`Manage problems reported in ${user.department || 'your domain'}`}
            user={user}
            activeTab="problems"
        >
            <div className="content-body">
                {message && <div className={`status-toast ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

                {/* Transfer Modal */}
                {showTransferModal && selectedProblem && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="action-card" style={{ width: '400px', padding: '2rem', background: 'var(--card-bg)' }}>
                            <h3 style={{ color: 'var(--text-primary)' }}>Transfer Job: {selectedProblem.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Select a colleague to transfer this job to.</p>
                            <form onSubmit={handleTransfer}>
                                <div className="form-group">
                                    <select
                                        value={transferTargetId}
                                        onChange={e => setTransferTargetId(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                    >
                                        <option value="">Select Colleague</option>
                                        {colleagues.map(col => (
                                            <option key={col._id} value={col._id}>{col.name} ({col.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button type="button" className="header-btn" onClick={() => setShowTransferModal(false)}>Cancel</button>
                                    <button type="submit" className="submit-btn" disabled={!transferTargetId}>Transfer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Status Update Modal (with Comment) */}
                {showStatusModal && selectedProblem && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="action-card" style={{ width: '500px', padding: '2rem', background: 'var(--card-bg)' }}>
                            <h3 style={{ color: 'var(--text-primary)' }}>Update Status to: {targetStatus.toUpperCase()}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Please provide a comment for this status change.</p>
                            <form onSubmit={handleUpdateStatus}>
                                <div className="form-group">
                                    <label style={{ color: 'var(--text-secondary)' }}>Comment / Remarks (Required)</label>
                                    <textarea
                                        value={statusComment}
                                        onChange={e => setStatusComment(e.target.value)}
                                        required
                                        style={{ width: '100%', minHeight: '100px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                        placeholder="Explain why you are changing the status..."
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button type="button" className="header-btn" onClick={() => setShowStatusModal(false)}>Cancel</button>
                                    <button type="submit" className="submit-btn" disabled={!statusComment.trim()}>Update Status</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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


                <div className="content-section">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Reported By</th>
                                    <th>Date</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Accepted By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((prob) => {
                                    const isAcceptedByMe = prob.acceptedBy && prob.acceptedBy._id === user._id;
                                    const isUnassigned = !prob.acceptedBy;

                                    return (
                                        <tr key={prob._id}>
                                            <td>
                                                <strong>{prob.title}</strong>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{prob.description.substring(0, 50)}...</div>
                                            </td>
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
                                                {isUnassigned ? <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Unassigned</span> :
                                                    isAcceptedByMe ? <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Me</span> :
                                                        prob.acceptedBy.name}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="view-all-btn"
                                                        onClick={() => openDetails(prob)}
                                                        title="View Details"
                                                    >
                                                        View
                                                    </button>

                                                    {isUnassigned && (
                                                        <button
                                                            className="view-all-btn"
                                                            onClick={() => handleAccept(prob._id)}
                                                            title="Accept Job"
                                                            style={{ background: 'var(--primary)', color: 'white', border: 'none' }}
                                                        >
                                                            Accept
                                                        </button>
                                                    )}

                                                    {isAcceptedByMe && (
                                                        <>
                                                            {prob.status === 'new' && (
                                                                <button
                                                                    className="view-all-btn"
                                                                    onClick={() => openStatusModal(prob, 'progress')}
                                                                >
                                                                    Start
                                                                </button>
                                                            )}
                                                            {prob.status === 'progress' && (
                                                                <button
                                                                    className="view-all-btn"
                                                                    style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                                                                    onClick={() => openStatusModal(prob, 'resolved')}
                                                                >
                                                                    Resolve
                                                                </button>
                                                            )}
                                                            <button
                                                                className="view-all-btn"
                                                                style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}
                                                                onClick={() => { setSelectedProblem(prob); setShowTransferModal(true); }}
                                                            >
                                                                Transfer
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {problems.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No active issues found in your domain.
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

export default AuthorityProblems;
