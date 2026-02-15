import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import {
    BookOpen, Calendar, FileText, MessageSquare,
    UserCheck, Award, ExternalLink, Plus, Send,
    Clock, Users, ChevronDown, ChevronUp, X
} from 'lucide-react';
import '../../styles/Dashboard.css';
import Modal from '../../components/Modal';

const MyClasses = () => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeSection, setActiveSection] = useState('lectures');

    // Form states
    const [noteForm, setNoteForm] = useState({ title: '', description: '', driveLink: '' });
    const [paperForm, setPaperForm] = useState({ title: '', year: '', semester: '', driveLink: '' });
    const [discussionText, setDiscussionText] = useState('');
    const [replyText, setReplyText] = useState({});
    const [expandedDiscussions, setExpandedDiscussions] = useState({});
    // const [expandedDiscussions, setExpandedDiscussions] = useState({});

    useEffect(() => {
        fetchEnrolledClasses();
    }, []);

    const fetchEnrolledClasses = async () => {
        try {
            const res = await apiFetch('http://localhost:8000/api/v1/student/explore-classes');
            const data = await res.json();
            if (data.data?.success) {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const enrolled = (data.data.data || []).filter(cls =>
                    cls.enrolledStudents?.some(s => s._id === user._id)
                );
                setEnrolledClasses(enrolled);
            }
        } catch (err) {
            console.error('Failed to fetch classes', err);
        }
    };

    const fetchClassDetails = async (classId) => {
        setLoading(true);
        try {
            const res = await apiFetch(`http://localhost:8000/api/v1/student/class/${classId}`);
            const data = await res.json();
            if (data.data?.success) {
                setClassDetails(data.data.data);
                setSelectedClass(classId);
            }
        } catch (err) {
            setMessage('Error loading class details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch(`http://localhost:8000/api/v1/student/class/${selectedClass}/note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteForm)
            });
            if (res.ok) {
                setMessage('Note added successfully!');
                setNoteForm({ title: '', description: '', driveLink: '' });
                setShowNoteModal(false);
                fetchClassDetails(selectedClass);
            }
        } catch (err) {
            setMessage('Error adding note');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddPaper = async (e) => {
        {
            showPaperModal && (
                <Modal onClose={() => setShowPaperModal(false)}>
                    <div className="action-card" style={{ maxWidth: '500px', width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Upload Past Paper</h3>
                            <button onClick={() => setShowPaperModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPaper} className="glass-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={paperForm.title}
                                    onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                                    required
                                    placeholder="e.g. Mid-term Exam 2024"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={paperForm.year}
                                        onChange={(e) => setPaperForm({ ...paperForm, year: e.target.value })}
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Semester</label>
                                    <input
                                        type="text"
                                        value={paperForm.semester}
                                        onChange={(e) => setPaperForm({ ...paperForm, semester: e.target.value })}
                                        placeholder="e.g. Semester"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Google Drive Link</label>
                                <input
                                    type="url"
                                    value={paperForm.driveLink}
                                    onChange={(e) => setPaperForm({ ...paperForm, driveLink: e.target.value })}
                                    required
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <button type="submit" className="submit-btn" style={{ width: '100%' }}>
                                Upload Paper
                            </button>
                        </form>
                    </div>
                </Modal>
            )
        }
        return (
            <div className="content-section fade-in">
                {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                <div className="section-header">
                    <h2>My Classes</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Classes you're enrolled in</p>
                </div>

                {enrolledClasses.length === 0 ? (
                    <div className="action-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <BookOpen size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                        <h3>No Classes Enrolled</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Go to Explore Classes to enroll in a class</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {enrolledClasses.map((cls) => (
                            <div
                                key={cls._id}
                                className="action-card"
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease', border: '1px solid var(--border)' }}
                                onClick={() => fetchClassDetails(cls._id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <div className="card-header" style={{ borderBottom: '1px solid var(--border)', padding: '1.25rem' }}>
                                    <div className="card-title">
                                        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{cls.name}</h2>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={14} />
                                            {cls.teacher?.name || 'No teacher assigned'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        {cls.enrolledStudents?.length || 0} students enrolled
                                    </p>
                                    <button className="submit-btn" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        View Details
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Render section content
    const renderSection = () => {
        if (!classDetails) return <div>Loading...</div>;

        switch (activeSection) {
            case 'lectures':
                return (
                    <div className="table-container">
                        <h3 style={{ marginBottom: '1rem' }}>Upcoming Lectures</h3>
                        {classDetails.lectures?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No lectures scheduled</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Date & Time</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classDetails.lectures?.map((lecture) => (
                                        <tr key={lecture._id}>
                                            <td>
                                                <strong>{lecture.title}</strong>
                                                {lecture.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{lecture.description}</p>}
                                            </td>
                                            <td>
                                                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                {new Date(lecture.scheduledDate).toLocaleString()}
                                            </td>
                                            <td>{lecture.duration} min</td>
                                            <td><span className={`badge ${lecture.status === 'completed' ? 'active' : ''}`}>{lecture.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case 'notes':
                return (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <button
                                className="submit-btn"
                                onClick={() => setShowNoteModal(true)}
                                style={{ padding: '0.8rem 1.5rem' }}
                            >
                                <Plus size={18} /> Upload Note
                            </button>
                        </div>

                        {/* Note Upload Modal */}
                        {showNoteModal && (
                            <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
                                <div className="modal-content action-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px', width: '90%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.3rem' }}>Upload Note</h3>
                                        <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleAddNote} className="glass-form">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={noteForm.title}
                                                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                                required
                                                placeholder="e.g. Chapter 5 Notes"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description (Optional)</label>
                                            <input
                                                type="text"
                                                value={noteForm.description}
                                                onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                                                placeholder="Brief description"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Google Drive Link</label>
                                            <input
                                                type="url"
                                                value={noteForm.driveLink}
                                                onChange={(e) => setNoteForm({ ...noteForm, driveLink: e.target.value })}
                                                required
                                                placeholder="https://drive.google.com/..."
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn" style={{ width: '100%' }}>
                                            Upload Note
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <h3 style={{ marginBottom: '1rem' }}>All Notes</h3>
                            {classDetails.notes?.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No notes uploaded yet</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {classDetails.notes?.map((note) => (
                                        <div key={note._id} className="action-card" style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ marginBottom: '0.5rem' }}>{note.title}</h4>
                                                    {note.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{note.description}</p>}
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        Uploaded by: {note.uploadedBy?.name} • {new Date(note.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <a href={note.driveLink} target="_blank" rel="noopener noreferrer" className="header-btn" style={{ padding: '0.5rem 1rem' }}>
                                                    <ExternalLink size={16} /> Open
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'papers':
                return (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <button
                                className="submit-btn"
                                onClick={() => setShowPaperModal(true)}
                                style={{ padding: '0.8rem 1.5rem' }}
                            >
                                <Plus size={18} /> Upload Past Paper
                            </button>
                        </div>

                        {/* Paper Upload Modal */}
                        {showPaperModal && (
                            <div className="modal-overlay" onClick={() => setShowPaperModal(false)}>
                                <div className="modal-content action-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3>Upload Past Paper</h3>
                                        <button onClick={() => setShowPaperModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleAddPaper} className="glass-form">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={paperForm.title}
                                                onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                                                required
                                                placeholder="e.g. Mid-term Exam 2024"
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group">
                                                <label>Year</label>
                                                <input
                                                    type="number"
                                                    value={paperForm.year}
                                                    onChange={(e) => setPaperForm({ ...paperForm, year: e.target.value })}
                                                    placeholder="2024"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Semester</label>
                                                <input
                                                    type="text"
                                                    value={paperForm.semester}
                                                    onChange={(e) => setPaperForm({ ...paperForm, semester: e.target.value })}
                                                    placeholder="Fall"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Google Drive Link</label>
                                            <input
                                                type="url"
                                                value={paperForm.driveLink}
                                                onChange={(e) => setPaperForm({ ...paperForm, driveLink: e.target.value })}
                                                required
                                                placeholder="https://drive.google.com/..."
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn" style={{ width: '100%' }}>
                                            Upload Paper
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <h3 style={{ marginBottom: '1rem' }}>Past Papers</h3>
                            {classDetails.pastPapers?.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No past papers uploaded yet</p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Year</th>
                                            <th>Semester</th>
                                            <th>Uploaded By</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classDetails.pastPapers?.map((paper) => (
                                            <tr key={paper._id}>
                                                <td><strong>{paper.title}</strong></td>
                                                <td>{paper.year || '-'}</td>
                                                <td>{paper.semester || '-'}</td>
                                                <td>{paper.uploadedBy?.name}</td>
                                                <td>
                                                    <a href={paper.driveLink} target="_blank" rel="noopener noreferrer" className="header-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                                                        <ExternalLink size={14} /> Open
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                );

            case 'discussions':
                return (
                    <div>
                        <div className="action-card" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Start a Discussion</h3>
                            <form onSubmit={handleAddDiscussion} style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    value={discussionText}
                                    onChange={(e) => setDiscussionText(e.target.value)}
                                    placeholder="Ask a question or start a discussion..."
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
                                    required
                                />
                                <button type="submit" className="submit-btn" style={{ padding: '0.8rem 1.5rem' }}>
                                    <Send size={18} /> Post
                                </button>
                            </form>
                        </div>

                        {classDetails.discussions?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No discussions yet. Start one above!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {classDetails.discussions?.map((discussion) => (
                                    <div key={discussion._id} className="action-card">
                                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong>{discussion.author?.name}</strong>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(discussion.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p style={{ marginBottom: '0.5rem' }}>{discussion.message}</p>
                                            <button
                                                className="header-btn"
                                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', marginTop: '0.5rem' }}
                                                onClick={() => setExpandedDiscussions({ ...expandedDiscussions, [discussion._id]: !expandedDiscussions[discussion._id] })}
                                            >
                                                {expandedDiscussions[discussion._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                {discussion.replies?.length || 0} Replies
                                            </button>
                                        </div>

                                        {expandedDiscussions[discussion._id] && (
                                            <div style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
                                                {discussion.replies?.map((reply) => (
                                                    <div key={reply._id} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--primary)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                            <strong style={{ fontSize: '0.875rem' }}>{reply.author?.name}</strong>
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                                                {new Date(reply.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.875rem' }}>{reply.message}</p>
                                                    </div>
                                                ))}
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                    <input
                                                        type="text"
                                                        value={replyText[discussion._id] || ''}
                                                        onChange={(e) => setReplyText({ ...replyText, [discussion._id]: e.target.value })}
                                                        placeholder="Write a reply..."
                                                        style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-primary)' }}
                                                    />
                                                    <button
                                                        className="submit-btn"
                                                        style={{ padding: '0.6rem 1rem' }}
                                                        onClick={() => handleAddReply(discussion._id)}
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'attendance':
                return (
                    <div className="table-container">
                        <h3 style={{ marginBottom: '1rem' }}>My Attendance</h3>
                        {classDetails.attendance?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No attendance records yet</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Marked By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classDetails.attendance?.map((record) => {
                                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                                        const isPresent = record.presentStudents?.some(s => s._id === user._id);
                                        return (
                                            <tr key={record._id}>
                                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge ${isPresent ? 'active' : ''}`} style={{ background: isPresent ? 'var(--success)' : 'var(--danger)' }}>
                                                        {isPresent ? 'Present' : 'Absent'}
                                                    </span>
                                                </td>
                                                <td>{record.markedBy?.name}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case 'grades':
                return (
                    <div className="table-container">
                        <h3 style={{ marginBottom: '1rem' }}>My Grades</h3>
                        {classDetails.grades?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No grades recorded yet</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Assessment</th>
                                        <th>Type</th>
                                        <th>Marks</th>
                                        <th>Percentage</th>
                                        <th>Date</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classDetails.grades?.map((grade) => {
                                        const percentage = ((grade.marks / grade.maxMarks) * 100).toFixed(1);
                                        return (
                                            <tr key={grade._id}>
                                                <td><strong>{grade.title}</strong></td>
                                                <td><span className="badge">{grade.type}</span></td>
                                                <td>{grade.marks}/{grade.maxMarks}</td>
                                                <td>
                                                    <span style={{ color: percentage >= 60 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                                                        {percentage}%
                                                    </span>
                                                </td>
                                                <td>{new Date(grade.date).toLocaleDateString()}</td>
                                                <td>{grade.remarks || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="content-section fade-in">
            {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <button
                        className="header-btn"
                        onClick={() => { setSelectedClass(null); setClassDetails(null); }}
                        style={{ marginBottom: '0.5rem' }}
                    >
                        ← Back to My Classes
                    </button>
                    <h2>{classDetails?.class?.name}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Teacher: {classDetails?.class?.teacher?.name}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { id: 'lectures', label: 'Lectures', icon: Calendar },
                    { id: 'notes', label: 'Notes', icon: FileText },
                    { id: 'papers', label: 'Past Papers', icon: BookOpen },
                    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
                    { id: 'attendance', label: 'Attendance', icon: UserCheck },
                    { id: 'grades', label: 'Grades', icon: Award }
                ].map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`header-btn ${activeSection === id ? 'active' : ''}`}
                        onClick={() => setActiveSection(id)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: activeSection === id ? 'var(--primary)' : 'transparent',
                            color: activeSection === id ? 'white' : 'var(--text-primary)'
                        }}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Loading class details...</p>
                </div>
            ) : (
                renderSection()
            )}
        </div>
    );
}

export default MyClasses;
