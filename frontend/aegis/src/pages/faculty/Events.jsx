import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import '../../styles/Dashboard.css';
import { getFacultyEvents, createEvent, updateEvent, deleteEvent } from '../../utils/eventService';
import { Plus, Edit, Trash2, X, Calendar, MapPin, Users, Eye } from 'lucide-react';
import '../../styles/FacultyEvents.css';

const FacultyEvents = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'workshop',
        domain: 'AI/ML',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
        image: null
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getFacultyEvents();
            if (response.success) {
                setEvents(response.data);
            }
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'workshop',
            domain: 'AI/ML',
            startDate: '',
            endDate: '',
            location: '',
            maxParticipants: '',
            image: null
        });
        setShowCreateForm(false);
        setShowEditForm(false);
        setSelectedEvent(null);
        setSuccessMessage(false);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await createEvent(formData);
            if (response.success) {
                setEvents([...events, response.data]);
                setSuccessMessage(true);
                // Don't reset form immediately so user sees success state
            }
        } catch (err) {
            setError(err.message || 'Failed to create event');
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await updateEvent(selectedEvent._id, formData);
            if (response.success) {
                setEvents(events.map(ev => ev._id === selectedEvent._id ? response.data : ev));
                resetForm();
            }
        } catch (err) {
            setError(err.message || 'Failed to update event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(eventId);
                setEvents(events.filter(ev => ev._id !== eventId));
            } catch (err) {
                setError(err.message || 'Failed to delete event');
            }
        }
    };

    const handleEditClick = (event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            type: event.type,
            domain: event.domain,
            startDate: new Date(event.startDate).toISOString().slice(0, 16),
            endDate: new Date(event.endDate).toISOString().slice(0, 16),
            location: event.location,
            maxParticipants: event.maxParticipants || '',
            image: null
        });
        setShowEditForm(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedViewEvent, setSelectedViewEvent] = useState(null);

    const handleViewClick = (event) => {
        setSelectedViewEvent(event);
        setShowViewModal(true);
    };

    const handleSendEmail = () => {
        alert(`Sending email to all registered students of ${selectedViewEvent.title}`);
        // Logic to send email would go here
    };

    return (
        <Layout
            role="faculty"
            title="Events"
            subtitle="Create and manage your events"
            user={user}
            activeTab="events"
        >
            <div className="content-body">
                {error && <div className="error-message">{error}</div>}

                <div className="page-header">
                    <h2>My Events</h2>
                    <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
                        <Plus size={20} /> Create Event
                    </button>
                </div>

                {/* Create Event Form Modal */}
                {showCreateForm && (
                    <div className="modal-overlay" onClick={() => !successMessage && setShowCreateForm(false)}>
                        <div className={`modal-content form-modal ${successMessage ? 'success-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
                            {!successMessage && (
                                <button className="modal-close" onClick={() => setShowCreateForm(false)}>
                                    <X size={24} />
                                </button>
                            )}

                            {successMessage ? (
                                <div className="success-view">
                                    <div className="success-icon">
                                        <svg viewBox="0 0 24 24" className="checkmark">
                                            <circle cx="12" cy="12" r="11" fill="none" stroke="#28a745" strokeWidth="2" />
                                            <path d="M6 12l4 4 8-8" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check" />
                                        </svg>
                                    </div>
                                    <h3>Event Created Successfully!</h3>
                                    <p>Your event has been published and is now visible to students.</p>
                                    <button className="btn-primary" onClick={resetForm}>
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="modal-header">
                                        <h3>Create New Event</h3>
                                        <p>Fill in the details to publish a new event</p>
                                    </div>
                                    <form onSubmit={handleCreateEvent} className="event-form">
                                        <div className="form-group">
                                            <label>Event Icon</label>
                                            <div className="file-upload-wrapper">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                                    required
                                                    id="event-image"
                                                    className="file-input"
                                                />
                                                <label htmlFor="event-image" className="file-label">
                                                    {formData.image ? (
                                                        <span className="file-name">{formData.image.name}</span>
                                                    ) : (
                                                        <>
                                                            <Calendar size={20} />
                                                            <span>Upload Event Banner</span>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., AI Workshop 2024"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Type</label>
                                                <select
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    required
                                                >
                                                    <option value="workshop">Workshop</option>
                                                    <option value="hackathon">Hackathon</option>
                                                    <option value="internship">Internship</option>
                                                    <option value="seminar">Seminar</option>
                                                    <option value="competition">Competition</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Domain</label>
                                                <select
                                                    value={formData.domain}
                                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                                    required
                                                >
                                                    <option value="AI/ML">AI/ML</option>
                                                    <option value="Web Development">Web Development</option>
                                                    <option value="Mobile Development">Mobile Development</option>
                                                    <option value="Data Science">Data Science</option>
                                                    <option value="Cloud Computing">Cloud Computing</option>
                                                    <option value="Cybersecurity">Cybersecurity</option>
                                                    <option value="Blockchain">Blockchain</option>
                                                    <option value="IoT">IoT</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Location</label>
                                                <div className="input-with-icon">
                                                    <MapPin size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Auditorium A"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Start Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>End Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group half">
                                                <label>Max Participants</label>
                                                <div className="input-with-icon">
                                                    <Users size={18} />
                                                    <input
                                                        type="number"
                                                        placeholder="No limit"
                                                        value={formData.maxParticipants}
                                                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                placeholder="Describe the event, prerequisites, and what students will learn..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                                rows="4"
                                            ></textarea>
                                        </div>

                                        <div className="form-actions">
                                            <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                            <button type="submit" className="btn-submit">Create Event</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Event Form Modal */}
                {showEditForm && selectedEvent && (
                    <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
                        <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setShowEditForm(false)}>
                                <X size={24} />
                            </button>

                            <div className="modal-header">
                                <h3>Edit Event</h3>
                                <p>Update event details</p>
                            </div>

                            <form onSubmit={handleUpdateEvent} className="event-form">
                                <div className="form-group">
                                    <label>Event Icon</label>
                                    <div className="file-upload-wrapper">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            id="edit-event-image"
                                            className="file-input"
                                        />
                                        <label htmlFor="edit-event-image" className="file-label">
                                            {formData.image ? (
                                                <span className="file-name">{formData.image.name}</span>
                                            ) : (
                                                <>
                                                    <Calendar size={20} />
                                                    <span>Change Event Banner (Optional)</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            placeholder="Event Title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            required
                                        >
                                            <option value="workshop">Workshop</option>
                                            <option value="hackathon">Hackathon</option>
                                            <option value="internship">Internship</option>
                                            <option value="seminar">Seminar</option>
                                            <option value="competition">Competition</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Domain</label>
                                        <select
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                            required
                                        >
                                            <option value="AI/ML">AI/ML</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Mobile Development">Mobile Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Cloud Computing">Cloud Computing</option>
                                            <option value="Cybersecurity">Cybersecurity</option>
                                            <option value="Blockchain">Blockchain</option>
                                            <option value="IoT">IoT</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Location</label>
                                        <div className="input-with-icon">
                                            <MapPin size={18} />
                                            <input
                                                type="text"
                                                placeholder="Location"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Max Participants</label>
                                        <div className="input-with-icon">
                                            <Users size={18} />
                                            <input
                                                type="number"
                                                placeholder="No limit"
                                                value={formData.maxParticipants}
                                                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Event Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows="4"
                                    ></textarea>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowEditForm(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit">Update Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Event Details Modal */}
                {showViewModal && selectedViewEvent && (
                    <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                        <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setShowViewModal(false)}>
                                <X size={24} />
                            </button>

                            <div className="modal-header">
                                <h3>Event Details</h3>
                                <p>View event information and registered students</p>
                            </div>

                            <div className="event-view-content" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                                <div className="view-section">
                                    <span className={`type-badge ${selectedViewEvent.type}`}>{selectedViewEvent.type}</span>
                                    <h2 style={{ margin: '0.5rem 0', color: '#333' }}>{selectedViewEvent.title}</h2>
                                    <p style={{ color: '#666', marginBottom: '1rem' }}>{selectedViewEvent.domain}</p>

                                    <div className="view-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                                        <p><strong><Calendar size={14} /> Start:</strong> {formatDate(selectedViewEvent.startDate)}</p>
                                        <p><strong><Calendar size={14} /> End:</strong> {formatDate(selectedViewEvent.endDate)}</p>
                                        <p><strong><MapPin size={14} /> Location:</strong> {selectedViewEvent.location}</p>
                                        <p><strong><Users size={14} /> Participants:</strong> {selectedViewEvent.registeredStudents?.length || 0}/{selectedViewEvent.maxParticipants || '∞'}</p>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ borderBottom: '2px solid #007bff', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Registered Students</h4>
                                        {selectedViewEvent.registeredStudents && selectedViewEvent.registeredStudents.length > 0 ? (
                                            <div className="students-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {selectedViewEvent.registeredStudents.map(student => (
                                                    <div key={student._id} className="student-item" style={{ background: '#fff', border: '1px solid #ddd', padding: '0.75rem', borderRadius: '6px' }}>
                                                        <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0' }}>{student.name}</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{student.email}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: '#666', fontStyle: 'italic' }}>No students registered yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions" style={{ padding: '1.5rem', borderTop: '1px solid #eee' }}>
                                <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                                <button className="btn-primary" onClick={handleSendEmail}>
                                    Send Message to All
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="no-data">No events created yet. Create your first event!</div>
                ) : (
                    <div className="events-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Domain</th>
                                    <th>Start Date</th>
                                    <th>Participants</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td className="title-cell">{event.title}</td>
                                        <td><span className={`type-badge ${event.type}`}>{event.type}</span></td>
                                        <td>{event.domain}</td>
                                        <td>{formatDate(event.startDate)}</td>
                                        <td>{event.registeredStudents?.length || 0}/{event.maxParticipants || '∞'}</td>
                                        <td>
                                            <button
                                                className="btn-action view"
                                                onClick={() => handleViewClick(event)}
                                                title="View Details"
                                                style={{ color: '#28a745', marginRight: '0.5rem' }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="btn-action edit"
                                                onClick={() => handleEditClick(event)}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn-action delete"
                                                onClick={() => handleDeleteEvent(event._id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FacultyEvents;
