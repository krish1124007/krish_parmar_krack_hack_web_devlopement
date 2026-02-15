import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Search, Filter, Plus, FileText, Trash2, Phone, Mail, Tag } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/Marketplace.css';

const Marketplace = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const [items, setItems] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'selling', 'create'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: 'good',
    phone: '',
    email: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filters, setFilters] = useState({ category: '', condition: '', priceMax: '' });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchItems();
    fetchMyListings();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchItems = async () => {
    try {
      let url = '/api/v1/student/marketplace?status=available';
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.condition) url += `&condition=${filters.condition}`;
      if (filters.priceMax) url += `&priceMax=${filters.priceMax}`;

      const response = await axios.get(url);
      setItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
  };

  const fetchMyListings = async () => {
    try {
      const response = await axios.get('/api/v1/student/marketplace/my-items');
      setMyListings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching my listings:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
      data.append('price', formData.price);
      data.append('condition', formData.condition);
      data.append('contact', JSON.stringify({ phone: formData.phone, email: formData.email }));
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      await axios.post('/api/v1/student/marketplace', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        condition: 'good',
        phone: '',
        email: ''
      });
      setSelectedFile(null);
      fetchItems();
      fetchMyListings();
      setActiveTab('browse');
    } catch (error) {
      console.error('Error posting item:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      try {
        await axios.delete(`/api/v1/student/marketplace/${itemId}`);
        fetchItems();
        fetchMyListings();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <Layout
      role="student"
      title="Marketplace"
      subtitle="Buy, sell, and trade with fellow students"
      user={user}
      activeTab="marketplace"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            className={`header-btn ${activeTab === 'browse' ? 'primary' : ''}`}
            onClick={() => setActiveTab('browse')}
            style={{ background: activeTab === 'browse' ? 'var(--primary)' : 'var(--card-bg)', color: activeTab === 'browse' ? 'white' : 'var(--text-primary)' }}
          >
            Browse Items
          </button>
          <button
            className={`header-btn ${activeTab === 'selling' ? 'primary' : ''}`}
            onClick={() => setActiveTab('selling')}
            style={{ background: activeTab === 'selling' ? 'var(--primary)' : 'var(--card-bg)', color: activeTab === 'selling' ? 'white' : 'var(--text-primary)' }}
          >
            My Listings
          </button>
          <button
            className={`header-btn ${activeTab === 'create' ? 'primary' : ''}`}
            onClick={() => setActiveTab('create')}
            style={{ background: activeTab === 'create' ? 'var(--primary)' : 'var(--card-bg)', color: activeTab === 'create' ? 'white' : 'var(--text-primary)' }}
          >
            <Plus size={16} style={{ marginRight: '0.5rem' }} /> Sell Item
          </button>
        </div>

        {activeTab === 'browse' && (
          <>
            <div className="action-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="category"
                    placeholder="Search category..."
                    value={filters.category}
                    onChange={handleFilterChange}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
                <select name="condition" value={filters.condition} onChange={handleFilterChange}>
                  <option value="">All Conditions</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-repair">Needs Repair</option>
                </select>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    name="priceMax"
                    placeholder="Max Price (₹)"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Filter size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                </div>
                <button onClick={fetchItems} className="submit-btn" style={{ margin: 0, height: '48px' }}>Apply Filters</button>
              </div>
            </div>

            <div className="dashboard-grid">
              {items.map(item => (
                <div key={item._id} className="action-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '200px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Tag size={48} color="var(--text-secondary)" />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{item.title}</h3>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        ₹{item.price}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{item.description}</p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {item.condition}
                      </span>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {item.category}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Seller: {item.seller?.name || 'Unknown'}</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={14} /> {item.contact?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length === 0 && (
              <div className="action-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>No items found matching your filters.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'selling' && (
          <div className="dashboard-grid">
            {myListings.length === 0 ? (
              <div className="action-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>You haven't listed any items yet.</p>
              </div>
            ) : (
              myListings.map(item => (
                <div key={item._id} className="action-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.price}</p>
                    </div>
                    <div style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: item.status === 'sold' ? 'var(--success)' : 'var(--bg-secondary)', color: item.status === 'sold' ? 'white' : 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {item.status.toUpperCase()}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '1rem 0' }}>{item.description}</p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="submit-btn"
                    style={{ background: 'var(--danger)', marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Trash2 size={16} /> Remove Listing
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card-header">
              <div className="card-title">
                <h2>List an Item</h2>
                <p>Fill in the details to sell your item</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="glass-form">
              <div className="form-group">
                <label>Item Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Engineering Physics Textbook"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="e.g., Books"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleFormChange}>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-repair">Needs Repair</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe your item..."
                  style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <label className="file-label">
                  <span>{selectedFile ? selectedFile.name : "Click to upload image"}</span>
                  <FileText size={20} />
                  <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={isPosting} className="submit-btn">
                {isPosting ? 'Posting...' : 'List Item'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
