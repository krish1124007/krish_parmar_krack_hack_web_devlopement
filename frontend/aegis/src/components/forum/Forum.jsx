import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Search, MessageCircle, ThumbsUp, ThumbsDown, Send, ArrowLeft, User, PlusCircle, Filter } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/Forum.css';
import { API_BASE_URL } from '../../config/api.config';

const Forum = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const userId = user._id || localStorage.getItem('userId');
  const API_URL = API_BASE_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'create'
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [newComment, setNewComment] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchPosts = async () => {
    try {
      let url = `${API_URL}/api/v1/forum?`;
      if (categoryFilter !== 'all') url += `category=${categoryFilter}`;
      if (searchQuery) url += `${url.includes('?') ? '&' : '?'}search=${searchQuery}`;

      const response = await axios.get(url, { headers: getAuthHeaders() });
      // The API returns { status, message, data: { success, data: [...] } }
      // So we need response.data.data.data
      const postsData = response.data.data?.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // setPosts([]); // Keep existing if error? Maybe better to clear if critical error.
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    setIsCreating(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/forum`, newPost, { headers: getAuthHeaders() });
      const createdPost = response.data.data?.data;
      if (createdPost) {
        setPosts([createdPost, ...posts]);
        setNewPost({ title: '', content: '', category: 'General' });
        setActiveTab('browse');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/forum/${postId}/upvote`, {}, { headers: getAuthHeaders() });
      const updatedPost = response.data.data?.data;
      if (updatedPost) {
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        if (selectedPost?._id === postId) setSelectedPost(updatedPost);
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/forum/${postId}/downvote`, {}, { headers: getAuthHeaders() });
      const updatedPost = response.data.data?.data;
      if (updatedPost) {
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        if (selectedPost?._id === postId) setSelectedPost(updatedPost);
      }
    } catch (error) {
      console.error('Error downvoting:', error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/api/v1/forum/${postId}/comment`, { content: newComment }, { headers: getAuthHeaders() });
      const updatedPost = response.data.data?.data;
      if (updatedPost) {
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        setSelectedPost(updatedPost);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSearch = () => {
    fetchPosts();
  };

  return (
    <Layout
      role="student"
      title="Discussion Forum"
      subtitle="Connect, discuss, and share knowledge"
      user={user}
      activeTab="forum"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in">
        {selectedPost ? (
          <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
              onClick={() => setSelectedPost(null)}
              className="header-btn"
              style={{ background: 'transparent', color: 'var(--text-secondary)', marginBottom: '1rem', padding: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
            >
              <ArrowLeft size={18} /> Back to Forum
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0' }}>{selectedPost.title}</h2>
                <span style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  {selectedPost.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={16} />
                  <span style={{ fontWeight: 500 }}>{selectedPost.author?.name || 'Unknown'}</span>
                </div>
                <span>•</span>
                <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
              </div>

              <div style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                {selectedPost.content}
              </div>

              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <button
                  onClick={() => handleUpvote(selectedPost._id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: selectedPost.upvotes.includes(userId) ? 'var(--primary-light)' : 'transparent',
                    color: selectedPost.upvotes.includes(userId) ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s'
                  }}
                >
                  <ThumbsUp size={18} /> {selectedPost.upvotes.length}
                </button>
                <button
                  onClick={() => handleDownvote(selectedPost._id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: selectedPost.downvotes.includes(userId) ? 'var(--danger)' : 'transparent', // mild red background ideally, but specific variable not always available
                    background: selectedPost.downvotes.includes(userId) ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    color: selectedPost.downvotes.includes(userId) ? 'var(--danger)' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s'
                  }}
                >
                  <ThumbsDown size={18} /> {selectedPost.downvotes.length}
                </button>
              </div>
            </div>

            <div className="comments-section">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={20} /> Comments ({selectedPost.comments.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {selectedPost.comments.map((comment, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.author?.name || 'Anonymous'}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{comment.content}</p>
                  </div>
                ))}
                {selectedPost.comments.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>

              <div className="glass-form" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    style={{ flex: 1, padding: '1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', resize: 'none' }}
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost._id)}
                    className="submit-btn"
                    style={{ marginTop: 0, width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                className="header-btn"
                onClick={() => setActiveTab('browse')}
                style={{
                  background: activeTab === 'browse' ? 'var(--primary)' : 'var(--card-bg)',
                  color: activeTab === 'browse' ? 'white' : 'var(--text-primary)',
                  border: 'none'
                }}
              >
                Browse Topics
              </button>
              <button
                className="header-btn"
                onClick={() => setActiveTab('create')}
                style={{
                  background: activeTab === 'create' ? 'var(--primary)' : 'var(--card-bg)',
                  color: activeTab === 'create' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <PlusCircle size={18} /> New Discussion
              </button>
            </div>

            {activeTab === 'browse' && (
              <>
                <div className="action-card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      style={{ width: '100%', height: '48px', padding: '0 1rem 0 2.5rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  </div>
                  <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} color="var(--text-secondary)" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      style={{ height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    >
                      <option value="all">All Topics</option>
                      <option value="Academics">Academics</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Events">Events</option>
                      <option value="Tech Support">Tech Support</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
                  {(Array.isArray(posts) ? posts : []).map(post => (
                    <div
                      key={post._id}
                      className="action-card"
                      onClick={() => setSelectedPost(post)}
                      style={{ cursor: 'pointer', padding: '1.5rem', transition: 'all 0.2s', borderLeft: '4px solid var(--primary)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                          {post.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 600 }}>{post.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1rem 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {post.content}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={14} /> {post.author?.name || 'Unknown'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ThumbsUp size={14} /> {post.upvotes.length}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MessageCircle size={14} /> {post.comments.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {posts.length === 0 && (
                  <div className="action-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <p>No posts found. Start a new discussion!</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'create' && (
              <div className="action-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card-header">
                  <div className="card-title">
                    <h2>Start a Discussion</h2>
                    <p>Share your ideas or ask questions</p>
                  </div>
                </div>
                <form onSubmit={handleCreatePost} className="glass-form">
                  <div className="form-group">
                    <label>Topic Title *</label>
                    <input
                      type="text"
                      placeholder="What's this about?"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Academics">Academics</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Events">Events</option>
                      <option value="Tech Support">Tech Support</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Content *</label>
                    <textarea
                      placeholder="Elaborate on your topic..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows={6}
                      style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                      required
                    />
                  </div>

                  <button type="submit" disabled={isCreating} className="submit-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isCreating ? 'Posting...' : <><Send size={18} /> Post Discussion</>}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Forum;
