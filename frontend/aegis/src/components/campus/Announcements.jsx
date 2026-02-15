import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Search, Megaphone, Calendar, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/Announcements.css';

const Announcements = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchAnnouncements();
  }, [categoryFilter, priorityFilter]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchAnnouncements = async () => {
    try {
      let url = '/api/v1/campus/announcements?';
      const params = [];
      if (categoryFilter !== 'all') params.push(`category=${categoryFilter}`);
      if (priorityFilter !== 'all') params.push(`priority=${priorityFilter}`);

      const response = await axios.get(url + params.join('&'));
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAnnouncements();
      return;
    }

    try {
      const response = await axios.get(`/api/v1/campus/announcements/search?query=${searchQuery}`);
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error('Error searching announcements:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'var(--danger)';
      case 'high': return 'var(--primary)'; // Orange/Amber in dark mode
      case 'medium': return 'var(--info)'; // Blue?
      case 'low': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Layout
      role="student"
      title="Announcements"
      subtitle="Campus news and updates"
      user={user}
      activeTab="announcements"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in">
        {selectedAnnouncement ? (
          <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="header-btn"
              style={{ background: 'transparent', color: 'var(--text-primary)', marginBottom: '1rem', padding: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
            >
              <ArrowLeft size={20} /> Back to List
            </button>

            {selectedAnnouncement.image && (
              <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
            )}

            <div className="card-header" style={{ justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{selectedAnnouncement.title}</h2>
                <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> {new Date(selectedAnnouncement.publishedAt).toLocaleDateString()}
                  {selectedAnnouncement.expiresAt && (
                    <span style={{ marginLeft: '1rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} /> Expires: {new Date(selectedAnnouncement.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
              <span style={{
                background: getPriorityColor(selectedAnnouncement.priority),
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {selectedAnnouncement.priority}
              </span>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', lineHeight: '1.6', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {selectedAnnouncement.content}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Posted by: {selectedAnnouncement.author?.name || 'Admin'}
            </div>
          </div>
        ) : (
          <>
            <div className="action-card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ width: '100%', height: '48px', padding: '0 1rem 0 2.5rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                >
                  <option value="all">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  style={{ height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="dashboard-grid">
              {(Array.isArray(announcements) ? announcements : []).map(announcement => (
                <div
                  key={announcement._id}
                  className="action-card"
                  onClick={() => setSelectedAnnouncement(announcement)}
                  style={{ cursor: 'pointer', borderLeft: `4px solid ${getPriorityColor(announcement.priority)}`, padding: '1.5rem', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Megaphone size={14} /> {announcement.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(announcement.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 600 }}>{announcement.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
            {announcements.length === 0 && (
              <div className="action-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>No announcements found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
