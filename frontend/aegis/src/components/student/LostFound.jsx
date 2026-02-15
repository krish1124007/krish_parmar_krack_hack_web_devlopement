import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Search, MapPin, Tag, Plus, MessageCircle, CheckCircle, Trash2, Image } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/LostFound.css';

const LostFound = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'mine', 'post'
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'lost',
    itemType: '',
    location: '',
    phone: '',
    email: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchItems();
    fetchMyItems();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchItems = async (categoryFilter = filter) => {
    try {
      const params = categoryFilter && categoryFilter !== 'all' ? `?category=${categoryFilter}` : '';
      const response = await axios.get(`/api/v1/student/lost-found${params}`);
      setItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
  };

  const fetchMyItems = async () => {
    try {
      const response = await axios.get('/api/v1/student/lost-found/my-items');
      setMyItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching my items:', error);
      setMyItems([]);
    }
  };

  const handleFilterChange = (startFilter) => {
    setFilter(startFilter);
    fetchItems(startFilter);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('itemType', formData.itemType);
      data.append('location', formData.location);
      data.append('contact', JSON.stringify({ phone: formData.phone, email: formData.email }));
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      await axios.post('/api/v1/student/lost-found', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData({
        title: '',
        description: '',
        category: 'lost',
        itemType: '',
        location: '',
        phone: '',
        email: ''
      });
      setSelectedFile(null);
      fetchItems();
      fetchMyItems();
      setActiveTab('browse');
    } catch (error) {
      console.error('Error posting item:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleClaim = async (itemId) => {
    try {
      await axios.put(`/api/v1/student/lost-found/${itemId}/claim`);
      fetchItems();
      fetchMyItems();
    } catch (error) {
      console.error('Error claiming item:', error);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/v1/student/lost-found/${itemId}`);
        fetchItems();
        fetchMyItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const getStatusColor = (category) => {
    switch (category) {
      case 'lost': return 'var(--danger)';
      case 'found': return 'var(--success)';
      case 'forgot': return 'var(--primary)'; // assuming forgot means left somewhere
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Layout
      role="student"
      title="Lost & Found"
      subtitle="Report or find lost items"
      user={user}
      activeTab="lost-found"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            className="header-btn"
            onClick={() => setActiveTab('browse')}
            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: activeTab === 'browse' ? 'var(--primary)' : 'var(--card-bg)', color: activeTab === 'browse' ? 'white' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Browse Items
          </button>
          <button
            className="header-btn"
            onClick={() => setActiveTab('mine')}
            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: activeTab === 'mine' ? 'var(--primary)' : 'var(--card-bg)', color: activeTab === 'mine' ? 'white' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            My Posts
          </button>
          <button
            className="header-btn"
            onClick={() => setActiveTab('post')}
            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: activeTab === 'post' ? 'var(--primary)' : 'var(--card-bg)', color: activeTab === 'post' ? 'white' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Report Item
          </button>
        </div>

        {activeTab === 'browse' && (
          <>
            <div className="action-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <FilterSelect value={filter} onChange={(e) => handleFilterChange(e.target.value)} />
            </div>

            <div className="dashboard-grid">
              {(Array.isArray(items) ? items : []).map(item => (
                <div key={item._id} className="action-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '200px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={48} color="var(--text-secondary)" />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{item.title}</h3>
                      <span style={{
                        background: getStatusColor(item.category),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {item.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <MapPin size={16} /> {item.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <Tag size={16} /> {item.itemType}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{item.description}</p>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>By: {item.student?.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(item.dateReported).toLocaleDateString()}</span>
                      </div>

                      {item.status === 'open' ? (
                        <button
                          onClick={() => handleClaim(item._id)}
                          className="submit-btn"
                          style={{ width: '100%', margin: 0, background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        >
                          I Found This / It's Mine
                        </button>
                      ) : (
                        <button disabled className="submit-btn" style={{ width: '100%', margin: 0, background: 'var(--success)', opacity: 0.8, cursor: 'default' }}>
                          <CheckCircle size={16} style={{ marginRight: '0.5rem', display: 'inline' }} /> Claimed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length === 0 && (
              <div className="action-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>No items found.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'mine' && (
          <div className="dashboard-grid">
            {myItems.map(item => (
              <div key={item._id} className="action-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                  <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.description}</p>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="submit-btn"
                  style={{ background: 'var(--danger)', marginTop: '1rem', width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <Trash2 size={16} style={{ marginRight: '0.5rem', display: 'inline' }} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'post' && (
          <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card-header">
              <div className="card-title">
                <h2>Report Lost/Found Item</h2>
                <p>Help the community by reporting items</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="glass-form">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" value={formData.title} onChange={handleFormChange} required placeholder="e.g., Blue Backpack" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleFormChange}>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                    <option value="forgot">Forgot</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Item Type *</label>
                  <input name="itemType" value={formData.itemType} onChange={handleFormChange} required placeholder="e.g., Electronics" />
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input name="location" value={formData.location} onChange={handleFormChange} required placeholder="Where was it lost/found?" />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} required rows={4} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
              </div>

              <div className="form-group">
                <label>Image</label>
                <label className="file-label">
                  <span>{selectedFile ? selectedFile.name : "Upload Image"}</span>
                  <Image size={20} />
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                </div>
              </div>

              <button type="submit" disabled={isPosting} className="submit-btn">{isPosting ? 'Posting...' : 'Submit Report'}</button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

const FilterSelect = ({ value, onChange }) => (
  <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
    <select value={value} onChange={onChange}>
      <option value="all">All Items</option>
      <option value="lost">Lost Items</option>
      <option value="found">Found Items</option>
      <option value="forgot">Forgot Items</option>
    </select>
  </div>
);

export default LostFound;
