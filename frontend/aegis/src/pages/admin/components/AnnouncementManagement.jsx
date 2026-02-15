import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../utils/api';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
    Megaphone,
    Plus,
    Edit2,
    Trash2,
    Search,
    AlertCircle,
    Calendar,
    User,
    X
} from 'lucide-react';
import '../../../styles/Dashboard.css';
import '../../../styles/Announcements.css';

const AnnouncementManagement = ({ onRefresh }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Academic',
        priority: 'medium',
        expiresAt: '',
        sendEmail: false,
        sendPush: false
    });

    const categories = ['Academic', 'Events', 'Administrative', 'Emergency'];
    const priorities = ['low', 'medium', 'high'];

    useEffect(() => {
        fetchAnnouncements();
    }, [filterCategory]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const url = filterCategory === 'all'
                ? API_ENDPOINTS.ANNOUNCEMENT.ALL
                : API_ENDPOINTS.ANNOUNCEMENT.BY_CATEGORY(filterCategory);

            const response = await apiFetch(url);
            const data = await response.json();

            if (data.data && data.data.success) {
                setAnnouncements(data.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            showMessage('Failed to fetch announcements', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, type = 'success') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editing
                ? API_ENDPOINTS.ANNOUNCEMENT.UPDATE(editing._id)
                : API_ENDPOINTS.ANNOUNCEMENT.CREATE;

            const method = editing ? 'PUT' : 'POST';

            const response = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.data && data.data.success) {
                showMessage(
                    editing ? 'Announcement updated successfully' : 'Announcement created successfully'
                );
                setShowModal(false);
                resetForm();
                fetchAnnouncements();
                if (onRefresh) onRefresh();
            } else {
                throw new Error(data.message || 'Failed to save announcement');
            }
        } catch (error) {
            console.error('Error saving announcement:', error);
            showMessage(error.message || 'Failed to save announcement', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        setLoading(true);
        try {
            const response = await apiFetch(API_ENDPOINTS.ANNOUNCEMENT.DELETE(id), {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.data && data.data.success) {
                showMessage('Announcement deleted successfully');
                fetchAnnouncements();
                if (onRefresh) onRefresh();
            } else {
                throw new Error(data.message || 'Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            showMessage(error.message || 'Failed to delete announcement', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (announcement) => {
        setEditing(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            category: announcement.category,
            priority: announcement.priority || 'medium',
            expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : '',
            sendEmail: announcement.sendEmail || false,
            sendPush: announcement.sendPush || false
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            category: 'Academic',
            priority: 'medium',
            expiresAt: '',
            sendEmail: false,
            sendPush: false
        });
        setEditing(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--info)';
            default: return 'var(--text-secondary)';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Academic': return 'var(--primary)';
            case 'Events': return 'var(--success)';
            case 'Administrative': return 'var(--info)';
            case 'Emergency': return 'var(--danger)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="management-container">
            {message && (
                <div className={`status-toast ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="management-header">
                <div className="header-left">
                    <Megaphone size={32} />
                    <div>
                        <h2>Announcements Management</h2>
                        <p>Create and manage campus announcements</p>
                    </div>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    New Announcement
                </button>
            </div>

            <div className="management-filters">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Category:</label>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && <div className="loading-spinner">Loading...</div>}

            <div className="announcements-grid">
                {filteredAnnouncements.length === 0 ? (
                    <div className="empty-state">
                        <AlertCircle size={48} />
                        <p>No announcements found</p>
                    </div>
                ) : (
                    filteredAnnouncements.map(announcement => (
                        <div key={announcement._id} className="announcement-card">
                            <div className="announcement-header">
                                <div className="announcement-badges">
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: getCategoryColor(announcement.category) }}
                                    >
                                        {announcement.category}
                                    </span>
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: getPriorityColor(announcement.priority) }}
                                    >
                                        {announcement.priority}
                                    </span>
                                </div>
                                <div className="announcement-actions">
                                    <button
                                        className="icon-btn"
                                        onClick={() => handleEdit(announcement)}
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="icon-btn danger"
                                        onClick={() => handleDelete(announcement._id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3>{announcement.title}</h3>
                            <p className="announcement-content">{announcement.content}</p>

                            <div className="announcement-footer">
                                <div className="announcement-meta">
                                    {announcement.author && (
                                        <span>
                                            <User size={14} />
                                            {announcement.author.name || announcement.author.email}
                                        </span>
                                    )}
                                    <span>
                                        <Calendar size={14} />
                                        {new Date(announcement.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editing ? 'Edit Announcement' : 'Create New Announcement'}</h3>
                            <button className="icon-btn" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Announcement title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Content *</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Announcement details..."
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Priority *</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        required
                                    >
                                        {priorities.map(pri => (
                                            <option key={pri} value={pri}>
                                                {pri.charAt(0).toUpperCase() + pri.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Expires At (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-checkboxes">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.sendEmail}
                                        onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                                    />
                                    <span>Send Email Notifications</span>
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.sendPush}
                                        onChange={(e) => setFormData({ ...formData, sendPush: e.target.checked })}
                                    />
                                    <span>Send Push Notifications</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManagement;
