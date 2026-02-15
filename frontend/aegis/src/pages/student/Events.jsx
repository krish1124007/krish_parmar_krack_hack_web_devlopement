import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import '../../styles/Dashboard.css';
import { getStudentEvents, registerForEvent, unregisterFromEvent } from '../../utils/eventService';
import { Calendar, MapPin, Users, X, Check } from 'lucide-react';
import '../../styles/StudentEvents.css';

const StudentEvents = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterDomain, setFilterDomain] = useState('');
    const [filterType, setFilterType] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

    useEffect(() => {
        fetchEvents();
    }, [filterDomain, filterType]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getStudentEvents({ domain: filterDomain, type: filterType });
            if (response.success) {
                setEvents(response.data);
                // Track registered events
                const registered = new Set(
                    response.data
                        .filter(event =>
                            event.registeredStudents?.some(s => s._id === user._id)
                        )
                        .map(e => e._id)
                );
                setRegisteredEventIds(registered);
            }
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            const response = await registerForEvent(eventId);
            if (response.success) {
                setRegisteredEventIds(prev => new Set([...prev, eventId]));
                setEvents(events.map(e =>
                    e._id === eventId
                        ? { ...e, registeredStudents: [...(e.registeredStudents || []), user] }
                        : e
                ));
            }
        } catch (err) {
            setError(err.message || 'Failed to register for event');
        }
    };

    const handleUnregister = async (eventId) => {
        try {
            const response = await unregisterFromEvent(eventId);
            if (response.success) {
                setRegisteredEventIds(prev => {
                    const updated = new Set(prev);
                    updated.delete(eventId);
                    return updated;
                });
                setEvents(events.map(e =>
                    e._id === eventId
                        ? { ...e, registeredStudents: (e.registeredStudents || []).filter(s => s._id !== user._id) }
                        : e
                ));
            }
        } catch (err) {
            setError(err.message || 'Failed to unregister from event');
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

    return (
        <Layout
            role="student"
            title="Events"
            subtitle="Discover and register for upcoming events"
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
                </div>

                {loading ? (
                    <div className="loading">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="no-data">No events available</div>
                ) : (
                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event._id} className="event-card">
                                <div className="event-image-container">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="event-image"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Event'}
                                    />
                                    <span className={`event-type-badge ${event.type}`}>{event.type}</span>
                                </div>

                                <div className="event-content">
                                    <h3>{event.title}</h3>
                                    <p className="event-domain">{event.domain}</p>

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

                                        {registeredEventIds.has(event._id) ? (
                                            <button
                                                className="btn-unregister"
                                                onClick={() => handleUnregister(event._id)}
                                            >
                                                <X size={16} /> Unregister
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-register"
                                                onClick={() => handleRegister(event._id)}
                                            >
                                                <Check size={16} /> Register
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Event Details Modal */}
                {selectedEvent && (
                    <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

                                <div className="details-section">
                                    <h4>Event Details</h4>
                                    <p><strong>Description:</strong> {selectedEvent.description}</p>
                                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                                    <p><strong>Start Date:</strong> {formatDate(selectedEvent.startDate)}</p>
                                    <p><strong>End Date:</strong> {formatDate(selectedEvent.endDate)}</p>
                                    <p><strong>Organized By:</strong> {selectedEvent.faculty?.name}</p>
                                    {selectedEvent.maxParticipants && (
                                        <p><strong>Max Participants:</strong> {selectedEvent.maxParticipants}</p>
                                    )}
                                    <p><strong>Registered Students:</strong> {selectedEvent.registeredStudents?.length || 0}</p>
                                </div>

                                <div className="modal-actions">
                                    {registeredEventIds.has(selectedEvent._id) ? (
                                        <button
                                            className="btn-unregister-full"
                                            onClick={() => {
                                                handleUnregister(selectedEvent._id);
                                                setSelectedEvent(null);
                                            }}
                                        >
                                            <X size={16} /> Unregister
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-register-full"
                                            onClick={() => {
                                                handleRegister(selectedEvent._id);
                                                setSelectedEvent(null);
                                            }}
                                        >
                                            <Check size={16} /> Register
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default StudentEvents;
