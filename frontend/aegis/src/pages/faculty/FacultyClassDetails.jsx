import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { API_ENDPOINTS } from '../../config/api.config';
import {
    BookOpen, Calendar, FileText, MessageSquare,
    UserCheck, Award, ExternalLink, Plus, Send,
    Clock, Users, ChevronDown, ChevronUp, X
} from 'lucide-react';
import '../../styles/Dashboard.css';
import Modal from '../../components/Modal';

const FacultyClassDetails = () => {
    const [myClasses, setMyClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeSection, setActiveSection] = useState('lectures');

    // Form states
    const [lectureForm, setLectureForm] = useState({ title: '', description: '', scheduledDate: '', duration: 60 });
    const [noteForm, setNoteForm] = useState({ title: '', description: '', driveLink: '' });
    const [discussionText, setDiscussionText] = useState('');
    const [replyText, setReplyText] = useState({});
    const [expandedDiscussions, setExpandedDiscussions] = useState({});

    // Modals
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [presentStudents, setPresentStudents] = useState([]);

    const [showNoteModal, setShowNoteModal] = useState(false);

    const [showGradeModal, setShowGradeModal] = useState(false);
    const [gradeForm, setGradeForm] = useState({
        studentId: '',
        title: '',
        marks: '',
        maxMarks: '',
        type: 'assignment',
        remarks: ''
    });

    useEffect(() => {
        fetchMyClasses();
    }, []);

    const fetchMyClasses = async () => {
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.MY_CLASSES);
            const data = await res.json();
            if (data.data?.success) {
                setMyClasses(data.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch classes', err);
        }
    };

    const fetchClassDetails = async (classId) => {
        setLoading(true);
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.CLASS(classId));
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

    const handleAddLecture = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.LECTURE(selectedClass), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lectureForm)
            });
            if (res.ok) {
                setMessage('Lecture scheduled successfully!');
                setLectureForm({ title: '', description: '', scheduledDate: '', duration: 60 });
                fetchClassDetails(selectedClass);
            }
        } catch (err) {
            setMessage('Error scheduling lecture');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleMarkAttendance = async () => {
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.ATTENDANCE(selectedClass), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: attendanceDate,
                    presentStudents: presentStudents
                })
            });
            if (res.ok) {
                setMessage('Attendance marked successfully!');
                setShowAttendanceModal(false);
                setPresentStudents([]);
                fetchClassDetails(selectedClass);
            }
        } catch (err) {
            setMessage('Error marking attendance');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddGrade = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.GRADE(selectedClass), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gradeForm)
            });
            if (res.ok) {
                setMessage('Grade added successfully!');
                setShowGradeModal(false);
                setGradeForm({
                    studentId: '',
                    title: '',
                    marks: '',
                    maxMarks: '',
                    type: 'assignment',
                    remarks: ''
                });
                fetchClassDetails(selectedClass);
            }
        } catch (err) {
            setMessage('Error adding grade');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.NOTE(selectedClass), {
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

    const handleAddDiscussion = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.DISCUSSION(selectedClass), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: discussionText })
            });
            if (res.ok) {
                setMessage('Discussion posted!');
                setDiscussionText('');
                fetchClassDetails(selectedClass);
            }
        } catch (err) {
            setMessage('Error posting discussion');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddReply = async (discussionId) => {
        try {
            const res = await apiFetch(API_ENDPOINTS.FACULTY.REPLY(discussionId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyText[discussionId] || '' })
            });
            if (res.ok) {
                setMessage('Reply added!');
                setReplyText({ ...replyText, [discussionId]: '' });
                fetchClassDetails(selectedClass);
            }
        } catch (err) {
            setMessage('Error adding reply');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const toggleStudentAttendance = (studentId) => {
        setPresentStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    if (!selectedClass) {
        return (
            <div className="content-section fade-in">
                {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                <div className="section-header">
                    <h2>My Classes</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Classes you're teaching</p>
                </div>

                {myClasses.length === 0 ? (
                    <div className="action-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <BookOpen size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                        <h3>No Classes Assigned</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Contact administrator to get classes assigned</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {myClasses.map((cls) => (
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
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Users size={16} />
                                        {cls.enrolledStudents?.length || 0} students enrolled
                                    </p>
                                    <button className="submit-btn" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        Manage Class
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
                    <div>
                        <div className="action-card" style={{ marginBottom: '1.5rem', maxWidth: '700px' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Schedule a Lecture</h3>
                            <form onSubmit={handleAddLecture} className="glass-form">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={lectureForm.title}
                                        onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                                        required
                                        placeholder="e.g. Introduction to React"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={lectureForm.description}
                                        onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                                        placeholder="Brief description"
                                        rows="2"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={lectureForm.scheduledDate}
                                            onChange={(e) => setLectureForm({ ...lectureForm, scheduledDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (min)</label>
                                        <input
                                            type="number"
                                            value={lectureForm.duration}
                                            onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                                            min="15"
                                            step="15"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus size={18} /> Schedule Lecture
                                </button>
                            </form>
                        </div>

                        <div className="table-container">
                            <h3 style={{ marginBottom: '1rem' }}>All Lectures</h3>
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
                    </div>
                );

            case 'attendance':
                return (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <button
                                className="submit-btn"
                                onClick={() => setShowAttendanceModal(true)}
                                style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <UserCheck size={18} /> Mark Attendance
                            </button>
                        </div>

                        {showAttendanceModal && (
                            <Modal onClose={() => setShowAttendanceModal(false)}>
                                <div className="action-card" style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.3rem' }}>Mark Attendance</h3>
                                        <button onClick={() => setShowAttendanceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            value={attendanceDate}
                                            onChange={(e) => setAttendanceDate(e.target.value)}
                                        />
                                    </div>
                                    <h4 style={{ marginBottom: '1rem' }}>Select Present Students:</h4>
                                    <div style={{ maxHeight: '300px', overflow: 'auto', marginBottom: '1.5rem' }}>
                                        {classDetails.class?.enrolledStudents?.map((student) => (
                                            <label key={student._id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', cursor: 'pointer', borderRadius: 'var(--radius)', marginBottom: '0.5rem', background: presentStudents.includes(student._id) ? 'var(--primary)' : 'var(--bg-secondary)', color: presentStudents.includes(student._id) ? 'white' : 'var(--text-primary)', transition: 'all 0.2s ease' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={presentStudents.includes(student._id)}
                                                    onChange={() => toggleStudentAttendance(student._id)}
                                                    style={{ marginRight: '0.75rem', width: '18px', height: '18px' }}
                                                />
                                                <span style={{ fontSize: '0.95rem' }}>{student.name} ({student.email})</span>
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        className="submit-btn"
                                        onClick={handleMarkAttendance}
                                        style={{ width: '100%', padding: '0.9rem' }}
                                    >
                                        Submit Attendance
                                    </button>
                                </div>
                            </Modal>
                        )}

                        <div className="table-container">
                            <h3 style={{ marginBottom: '1rem' }}>Attendance Records</h3>
                            {classDetails.attendance?.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No attendance records yet</p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Present</th>
                                            <th>Absent</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classDetails.attendance?.map((record) => (
                                            <tr key={record._id}>
                                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                                <td><span className="badge active">{record.presentStudents?.length || 0}</span></td>
                                                <td><span className="badge" style={{ background: 'var(--danger)' }}>{record.absentStudents?.length || 0}</span></td>
                                                <td>{(record.presentStudents?.length || 0) + (record.absentStudents?.length || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                );

            case 'grades':
                return (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <button
                                className="submit-btn"
                                onClick={() => setShowGradeModal(true)}
                                style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Award size={18} /> Add Grade
                            </button>
                        </div>

                        {showGradeModal && (
                            <Modal onClose={() => setShowGradeModal(false)}>
                                <div className="action-card" style={{ maxWidth: '550px', width: '90%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.3rem' }}>Add Grade</h3>
                                        <button onClick={() => setShowGradeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleAddGrade} className="glass-form">
                                        <div className="form-group">
                                            <label>Student</label>
                                            <select
                                                value={gradeForm.studentId}
                                                onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Student</option>
                                                {classDetails.class?.enrolledStudents?.map((student) => (
                                                    <option key={student._id} value={student._id}>
                                                        {student.name} ({student.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Assessment Title</label>
                                            <input
                                                type="text"
                                                value={gradeForm.title}
                                                onChange={(e) => setGradeForm({ ...gradeForm, title: e.target.value })}
                                                required
                                                placeholder="e.g. Mid-term Exam"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Type</label>
                                            <select
                                                value={gradeForm.type}
                                                onChange={(e) => setGradeForm({ ...gradeForm, type: e.target.value })}
                                            >
                                                <option value="exam">Exam</option>
                                                <option value="assignment">Assignment</option>
                                                <option value="quiz">Quiz</option>
                                                <option value="project">Project</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group">
                                                <label>Marks Obtained</label>
                                                <input
                                                    type="number"
                                                    value={gradeForm.marks}
                                                    onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })}
                                                    required
                                                    min="0"
                                                    step="0.5"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Max Marks</label>
                                                <input
                                                    type="number"
                                                    value={gradeForm.maxMarks}
                                                    onChange={(e) => setGradeForm({ ...gradeForm, maxMarks: e.target.value })}
                                                    required
                                                    min="0"
                                                    step="0.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Remarks (Optional)</label>
                                            <textarea
                                                value={gradeForm.remarks}
                                                onChange={(e) => setGradeForm({ ...gradeForm, remarks: e.target.value })}
                                                placeholder="Any additional comments"
                                                rows="2"
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn" style={{ width: '100%', padding: '0.9rem' }}>
                                            Add Grade
                                        </button>
                                    </form>
                                </div>
                            </Modal>
                        )}

                        <div className="table-container">
                            <h3 style={{ marginBottom: '1rem' }}>All Grades</h3>
                            {classDetails.grades?.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No grades recorded yet</p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Assessment</th>
                                            <th>Type</th>
                                            <th>Marks</th>
                                            <th>Percentage</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classDetails.grades?.map((grade) => {
                                            const percentage = ((grade.marks / grade.maxMarks) * 100).toFixed(1);
                                            return (
                                                <tr key={grade._id}>
                                                    <td>{grade.student?.name}</td>
                                                    <td><strong>{grade.title}</strong></td>
                                                    <td><span className="badge">{grade.type}</span></td>
                                                    <td>{grade.marks}/{grade.maxMarks}</td>
                                                    <td>
                                                        <span style={{ color: percentage >= 60 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                    <td>{new Date(grade.date).toLocaleDateString()}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                );

            case 'notes':
                return (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <button
                                className="submit-btn"
                                onClick={() => setShowNoteModal(true)}
                                style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Plus size={18} /> Upload Note
                            </button>
                        </div>

                        {/* Note Upload Modal */}
                        {showNoteModal && (
                            <Modal onClose={() => setShowNoteModal(false)}>
                                <div className="action-card" style={{ maxWidth: '550px', width: '90%' }}>
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
                                            <textarea
                                                value={noteForm.description}
                                                onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                                                placeholder="Brief description"
                                                rows="2"
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
                                        <button type="submit" className="submit-btn" style={{ width: '100%', padding: '0.9rem' }}>
                                            Upload Note
                                        </button>
                                    </form>
                                </div>
                            </Modal>
                        )}

                        <div className="table-container">
                            <h3 style={{ marginBottom: '1rem' }}>All Notes</h3>
                            {classDetails.notes?.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No notes uploaded yet</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {classDetails.notes?.map((note) => (
                                        <div key={note._id} className="action-card" style={{ padding: '1.25rem', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{note.title}</h4>
                                                    {note.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{note.description}</p>}
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span>Uploaded by: {note.uploadedBy?.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                                    </p>
                                                </div>
                                                <a href={note.driveLink} target="_blank" rel="noopener noreferrer" className="header-btn" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
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

            case 'discussions':
                return (
                    <div>
                        <div className="action-card" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Post Announcement / Discussion</h3>
                            <form onSubmit={handleAddDiscussion} style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    value={discussionText}
                                    onChange={(e) => setDiscussionText(e.target.value)}
                                    placeholder="Post an announcement or start a discussion..."
                                    style={{ flex: 1, padding: '0.9rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
                                    required
                                />
                                <button type="submit" className="submit-btn" style={{ padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Send size={18} /> Post
                                </button>
                            </form>
                        </div>

                        {classDetails.discussions?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No discussions yet</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {classDetails.discussions?.map((discussion) => (
                                    <div key={discussion._id} className="action-card" style={{ border: '1px solid var(--border)' }}>
                                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <strong style={{ fontSize: '1rem' }}>{discussion.author?.name}</strong>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(discussion.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>{discussion.message}</p>
                                            <button
                                                className="header-btn"
                                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginTop: '0.5rem' }}
                                                onClick={() => setExpandedDiscussions({ ...expandedDiscussions, [discussion._id]: !expandedDiscussions[discussion._id] })}
                                            >
                                                {expandedDiscussions[discussion._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                {discussion.replies?.length || 0} Replies
                                            </button>
                                        </div>

                                        {expandedDiscussions[discussion._id] && (
                                            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                                                {discussion.replies?.map((reply) => (
                                                    <div key={reply._id} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '3px solid var(--primary)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <strong style={{ fontSize: '0.9rem' }}>{reply.author?.name}</strong>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                {new Date(reply.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.9rem' }}>{reply.message}</p>
                                                    </div>
                                                ))}
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                                    <input
                                                        type="text"
                                                        value={replyText[discussion._id] || ''}
                                                        onChange={(e) => setReplyText({ ...replyText, [discussion._id]: e.target.value })}
                                                        placeholder="Write a reply..."
                                                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-primary)' }}
                                                    />
                                                    <button
                                                        className="submit-btn"
                                                        style={{ padding: '0.75rem 1.25rem' }}
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
                        style={{ marginBottom: '0.75rem' }}
                    >
                        ← Back to My Classes
                    </button>
                    <h2>{classDetails?.class?.name}</h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        {classDetails?.class?.enrolledStudents?.length || 0} Students Enrolled
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { id: 'lectures', label: 'Lectures', icon: Calendar },
                    { id: 'attendance', label: 'Attendance', icon: UserCheck },
                    { id: 'grades', label: 'Grades', icon: Award },
                    { id: 'notes', label: 'Notes', icon: FileText },
                    { id: 'discussions', label: 'Discussions', icon: MessageSquare }
                ].map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`header-btn ${activeSection === id ? 'active' : ''}`}
                        onClick={() => setActiveSection(id)}
                        style={{
                            padding: '0.7rem 1.3rem',
                            background: activeSection === id ? 'var(--primary)' : 'transparent',
                            color: activeSection === id ? 'white' : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
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
};

export default FacultyClassDetails;
