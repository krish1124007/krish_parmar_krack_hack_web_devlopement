import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import '../../styles/Dashboard.css';
import { getAllEvents, deleteEvent } from '../../utils/eventService';
import { Trash2, X, Calendar, MapPin, Users } from 'lucide-react';
import '../../styles/AdminEvents.css';

const AdminEvents = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [filterDomain, setFilterDomain] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getAllEvents();
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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilteredEvents = () => {
        return events.filter(event => {
            if (filterType && event.type !== filterType) return false;
            if (filterDomain && event.domain !== filterDomain) return false;
            if (filterStatus && event.status !== filterStatus) return false;
            return true;
        });
    };

    const filteredEvents = getFilteredEvents();

    return (
        <Layout
            role="admin"
            title="Events"
            subtitle="Monitor all events and manage activity"
            user={user}
            activeTab="events"
        >
            <div className="content-body">
                {error && <div className="error-message">{error}</div>}

                {/* Filters */}
                <div className="filters-section">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Event Types</option>
                        <option value="workshop">Workshop</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="internship">Internship</option>
                        <option value="seminar">Seminar</option>
                        <option value="competition">Competition</option>
                    </select>

                    <select
                        value={filterDomain}
                        onChange={(e) => setFilterDomain(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Domains</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="no-data">No events found</div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <div key={event._id} className="event-card admin">
                                <div className="event-image-container">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="event-image"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Event'}
                                    />
                                    <span className={`event-type-badge ${event.type}`}>{event.type}</span>
                                    <span className={`status-badge ${event.status}`}>{event.status}</span>
                                </div>

                                <div className="event-content">
                                    <h3>{event.title}</h3>
                                    <p className="event-domain">{event.domain}</p>

                                    <div className="event-meta">
                                        <p><strong>Organized By:</strong> {event.faculty?.name}</p>
                                        <p><strong>Email:</strong> {event.faculty?.email}</p>
                                    </div>

                                    <div className="event-details">
                                        <div className="detail">
                                            <Calendar size={16} />
                                            <span>{formatDate(event.startDate)}</span>
                                        </div>
                                        <div className="detail">
                                            <MapPin size={16} />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="detail">
                                            <Users size={16} />
                                            <span>{event.registeredStudents?.length || 0} registered</span>
                                        </div>
                                    </div>

                                    <p className="event-description">{event.description}</p>

                                    <div className="event-actions">
                                        <button
                                            className="btn-details"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            View Details
                                        </button>

                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteEvent(event._id)}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Event Details Modal */}
                {selectedEvent && (
                    <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                        <div className="modal-content admin" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
                                <X size={24} />
                            </button>

                            <img
                                src={selectedEvent.image}
                                alt={selectedEvent.title}
                                className="modal-image"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/600x300?text=Event'}
                            />

                            <div className="modal-body">
                                <h2>{selectedEvent.title}</h2>
                                <p className="domain-badge">{selectedEvent.domain}</p>
                                <p className="type-badge">{selectedEvent.type}</p>
                                <p className={`status-badge-large ${selectedEvent.status}`}>{selectedEvent.status}</p>

                                <div className="details-section">
                                    <h4>Event Details</h4>
                                    <p><strong>Description:</strong> {selectedEvent.description}</p>
                                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                                    <p><strong>Start Date:</strong> {formatDate(selectedEvent.startDate)}</p>
                                    <p><strong>End Date:</strong> {formatDate(selectedEvent.endDate)}</p>
                                    <p><strong>Organized By:</strong> {selectedEvent.faculty?.name}</p>
                                    <p><strong>Faculty Email:</strong> {selectedEvent.faculty?.email}</p>
                                    {selectedEvent.maxParticipants && (
                                        <p><strong>Max Participants:</strong> {selectedEvent.maxParticipants}</p>
                                    )}
                                    <p><strong>Current Registrations:</strong> {selectedEvent.registeredStudents?.length || 0}</p>
                                </div>

                                {selectedEvent.registeredStudents && selectedEvent.registeredStudents.length > 0 && (
                                    <div className="registered-students">
                                        <h4>Registered Students</h4>
                                        <div className="students-list">
                                            {selectedEvent.registeredStudents.map(student => (
                                                <div key={student._id} className="student-item">
                                                    <p><strong>{student.name}</strong></p>
                                                    <p>{student.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button
                                        className="btn-delete-full"
                                        onClick={() => {
                                            handleDeleteEvent(selectedEvent._id);
                                            setSelectedEvent(null);
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminEvents;
