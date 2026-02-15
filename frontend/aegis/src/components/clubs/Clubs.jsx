import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Search, Users, Calendar, ArrowLeft, Info, Bell, LogIn, LogOut, Upload } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/Clubs.css';
import { API_BASE_URL } from '../../config/api.config';

const Clubs = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const userId = user._id || localStorage.getItem('userId');
  const role = localStorage.getItem('role') || 'student';
  const API_URL = API_BASE_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchClubs();
  }, []); // Run once on mount

  // We should make sure we are not filtering out anything by default unless search is active
  const fetchClubs = async (query = '') => {
    try {
      const url = query ? `${API_URL}/api/v1/campus/clubs?search=${query}` : `${API_URL}/api/v1/campus/clubs`;
      const response = await axios.get(url, { headers: getAuthHeaders() });
      const clubList = response.data.data?.data;
      if (Array.isArray(clubList)) {
        setClubs(clubList);
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      // Don't clear clubs on error if possible, or show error state
      setClubs([]);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = () => {
    fetchClubs(searchQuery);
  };

  const handleJoinClub = async (clubId) => {
    try {
      await axios.post(`${API_URL}/api/v1/campus/clubs/${clubId}/join`, {}, { headers: getAuthHeaders() });
      setIsMember(true);
      // Refresh club details
      const response = await axios.get(`${API_URL}/api/v1/campus/clubs/${clubId}`, { headers: getAuthHeaders() });
      setSelectedClub(response.data.data?.data);

      // Also refresh list to update member counts
      fetchClubs(searchQuery);
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  const handleLeaveClub = async (clubId) => {
    try {
      await axios.post(`${API_URL}/api/v1/campus/clubs/${clubId}/leave`, {}, { headers: getAuthHeaders() });
      setIsMember(false);
      const response = await axios.get(`${API_URL}/api/v1/campus/clubs/${clubId}`, { headers: getAuthHeaders() });
      setSelectedClub(response.data.data?.data);

      // Also refresh list
      fetchClubs(searchQuery);
    } catch (error) {
      console.error('Error leaving club:', error);
    }
  };

  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchClubRequests = async (clubId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/campus/clubs/${clubId}/requests`, { headers: getAuthHeaders() });
      setPendingRequests(response.data.data?.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleApproveMember = async (clubId, studentId) => {
    try {
      await axios.post(`${API_URL}/api/v1/campus/clubs/${clubId}/approve/${studentId}`, {}, { headers: getAuthHeaders() });
      fetchClubRequests(clubId);
      fetchClubs(); // Refresh member count
    } catch (error) {
      console.error('Error approving member:', error);
    }
  };

  const handleRejectMember = async (clubId, studentId) => {
    try {
      await axios.post(`${API_URL}/api/v1/campus/clubs/${clubId}/reject/${studentId}`, {}, { headers: getAuthHeaders() });
      fetchClubRequests(clubId);
    } catch (error) {
      console.error('Error rejecting member:', error);
    }
  };


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClubData, setNewClubData] = useState({
    name: '',
    description: '',
    advisor: '',
    leader: '',
    logo: null,
    banner: null
  });

  const handleCreateClub = async (e) => {
    e.preventDefault();

    if (!newClubData.name || !newClubData.description || !newClubData.advisor || !newClubData.leader) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newClubData.name);
      formData.append('description', newClubData.description);
      formData.append('advisor', newClubData.advisor);
      formData.append('leader', newClubData.leader);
      if (newClubData.logo) formData.append('logo', newClubData.logo);
      if (newClubData.banner) formData.append('banner', newClubData.banner);

      await axios.post(`${API_URL}/api/v1/campus/clubs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders()
        }
      });
      alert("Club created successfully!");
      setShowCreateModal(false);
      setNewClubData({ name: '', description: '', advisor: '', leader: '', logo: null, banner: null }); // Reset form
      fetchClubs();
    } catch (error) {
      console.error("Error creating club:", error);
      alert("Failed to create club: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const isLeader = selectedClub && (selectedClub.leader?._id === userId || selectedClub.leader === userId);

  useEffect(() => {
    if (isLeader && selectedClub) { // Ensure selectedClub is not null
      fetchClubRequests(selectedClub._id);
    }
  }, [selectedClub, isLeader]); // Added isLeader to dependency array

  return (
    <Layout
      role={role}
      title="Clubs & Societies"
      subtitle="Discover and join vibrant campus communities"
      user={user}
      activeTab="clubs"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in">

        {/* Create Club Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-form">
              <button
                onClick={() => setShowCreateModal(false)}
                className="close-btn"
                title="Close"
              >
                ✕
              </button>

              <h2>Create New Club</h2>
              <p className="modal-subtitle">Establish a new community for students.</p>

              <form onSubmit={handleCreateClub}>
                <div className="form-group">
                  <label>Club Name</label>
                  <input
                    type="text"
                    value={newClubData.name}
                    onChange={(e) => setNewClubData({ ...newClubData, name: e.target.value })}
                    placeholder="e.g., Robotics Club"
                    required
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newClubData.description}
                    onChange={(e) => setNewClubData({ ...newClubData, description: e.target.value })}
                    placeholder="Describe the club's mission and activities..."
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Advisor Email</label>
                    <input
                      type="email"
                      value={newClubData.advisor}
                      onChange={(e) => setNewClubData({ ...newClubData, advisor: e.target.value })}
                      placeholder="Faculty email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Leader Email</label>
                    <input
                      type="email"
                      value={newClubData.leader}
                      onChange={(e) => setNewClubData({ ...newClubData, leader: e.target.value })}
                      placeholder="Student email"
                      required
                    />
                  </div>
                </div>
                <div className="info-box" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  Note: Advisor and Leader must already be registered users.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Club Logo</label>
                    <label className="file-label">
                      <Upload size={20} />
                      <span>{newClubData.logo ? newClubData.logo.name : "Upload Logo"}</span>
                      <input
                        type="file"
                        onChange={(e) => setNewClubData({ ...newClubData, logo: e.target.files[0] })}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Banner Image</label>
                    <label className="file-label">
                      <Upload size={20} />
                      <span>{newClubData.banner ? newClubData.banner.name : "Upload Banner"}</span>
                      <input
                        type="file"
                        onChange={(e) => setNewClubData({ ...newClubData, banner: e.target.files[0] })}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Create Club
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedClub ? (
          <div className="action-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '0', overflow: 'hidden' }}>

            {/* Banner Image */}
            <div style={{
              height: '200px',
              background: selectedClub.banner ? `url(${selectedClub.banner}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--secondary))',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedClub(null)}
                style={{
                  position: 'absolute', top: '1rem', left: '1rem',
                  background: 'rgba(0,0,0,0.5)', color: 'white',
                  border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <ArrowLeft size={20} />
              </button>
              {isLeader && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600 }}>
                  Admin Mode
                </div>
              )}
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginTop: '-4rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'end', gap: '1.5rem' }}>
                  <div style={{
                    width: '100px', height: '100px',
                    borderRadius: '20px', border: '4px solid var(--card-bg)',
                    background: 'white', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    {selectedClub.logo ? (
                      <img src={selectedClub.logo} alt={selectedClub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Users size={48} color="var(--primary)" />
                    )}
                  </div>
                  <div style={{ paddingBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{selectedClub.name}</h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Advisor: {selectedClub.advisor?.name || 'N/A'}</p>
                  </div>
                </div>
                <div style={{ paddingTop: '2.5rem' }}>
                  {isLeader ? (
                    <button className="submit-btn" disabled style={{ opacity: 1, cursor: 'default' }}>
                      You are the Founder/Admin
                    </button>
                  ) : isMember ? (
                    <button
                      onClick={() => handleLeaveClub(selectedClub._id)}
                      className="submit-btn"
                      style={{ background: 'var(--danger)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <LogOut size={18} /> Leave Club
                    </button>
                  ) : (selectedClub.pendingMembers || []).includes(userId) ? (
                    <button
                      className="submit-btn"
                      disabled
                      style={{ marginTop: 0, background: 'var(--warning)', cursor: 'not-allowed', opacity: 0.8 }}
                    >
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClub(selectedClub._id)}
                      className="submit-btn"
                      style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <LogIn size={18} /> Join Request
                    </button>
                  )}
                </div>
              </div>

              {isLeader && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>Manage Membership Requests</h3>
                  {pendingRequests.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No pending requests.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {pendingRequests.map(req => (
                        <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '0.8rem', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 600 }}>{req.name}</span>
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>({req.enrollmentNo})</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleApproveMember(selectedClub._id, req._id)}
                              style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectMember(selectedClub._id, req._id)}
                              style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', margin: 0 }}>
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Info size={20} color="var(--primary)" /> About
                    </h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>{selectedClub.description}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bell size={20} color="var(--warning)" /> Announcements
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(selectedClub.announcements || []).length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No announcements yet.</p>
                      ) : (
                        selectedClub.announcements.map((ann, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--warning)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{ann.title}</h4>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ann.content}</p>
                            <small style={{ color: 'var(--text-secondary)' }}>{new Date(ann.date).toLocaleDateString()}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Club Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Members</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedClub.members?.length || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Events</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedClub.events?.length || 0}</span>
                      </div>
                      {(selectedClub.pendingMembers?.length > 0 && isLeader) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--primary)' }}>
                          <span>Pending</span>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedClub.pendingMembers.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} /> Upcoming Events
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {(selectedClub.events || []).length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No upcoming events.</p>
                      ) : (
                        selectedClub.events.map((event) => (
                          <div key={event._id} style={{ padding: '0.8rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{event.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {new Date(event.date || Date.now()).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                      <button
                        style={{ width: '100%', marginTop: '0.5rem', background: 'var(--card-bg)', border: '1px dashed var(--primary)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
                        onClick={async () => {
                          const title = prompt("Event Title:");
                          if (!title) return;
                          const description = prompt("Event Description:");
                          const venue = prompt("Venue:");
                          const date = prompt("Date (YYYY-MM-DD):");
                          if (!date) return;

                          // Ask for mandatory fields required by the Event model
                          // const type = prompt("Type (internship/workshop/hackathon/seminar/competition):") || "seminar";
                          // const domain = prompt("Domain:") || "General";

                          try {
                            // We need to match the backend expectation. 
                            // The backend controller for club event creation (createEvent) does:
                            /*
                                 const event = await models.Event.create({
                                     title,
                                     description,
                                     date: date || new Date(),
                                     location: venue, 
                                     organizer: clubId,
                                     createdBy: studentId
                                 });
                            */
                            // HOWEVER, the Event model (event.models.ts) has required fields: image, type, domain, faculty, startDate, endDate.
                            // The controller implementation in club.controller.ts seems to try to create an event with missing required fields, 
                            // OR it uses a different event model or simpler schema than what is in event.models.ts.
                            // Looking at club.controller.ts:369, it creates an event with title, description, date, location.
                            // This will likely FAIL validation if the Mongoose model enforces 'required' for image, type, domain, etc.

                            // Let's assume for now we just try to send what the controller expects, but since the user saw issues with "already created", 
                            // ensuring we fetch properly is key. The current request is just to "see all clubs".

                            await axios.post(`${API_URL}/api/v1/campus/clubs/${selectedClub._id}/event`, {
                              title, description, venue, date
                            }, { headers: getAuthHeaders() });
                            alert("Event created successfully!");

                            // Refresh club details to show the new event
                            const response = await axios.get(`${API_URL}/api/v1/campus/clubs/${selectedClub._id}`, { headers: getAuthHeaders() });
                            setSelectedClub(response.data.data?.data);

                            // Also refresh the main list
                            fetchClubs();
                          } catch (error) {
                            console.error("Error creating event:", error);
                            alert("Failed to create event: " + (error.response?.data?.message || error.message));
                          }
                        }}
                      >
                        + Add Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="action-card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search for clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ width: '100%', height: '48px', padding: '0 1rem 0 2.5rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              </div>
              <button
                onClick={handleSearch}
                className="submit-btn"
                style={{ margin: 0, height: '48px', display: 'flex', alignItems: 'center', padding: '0 2rem' }}
              >
                Search
              </button>
              {role === 'admin' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="submit-btn"
                  style={{ margin: 0, height: '48px', display: 'flex', alignItems: 'center', padding: '0 2rem', background: 'var(--success)' }}
                  title="Create New Club"
                >
                  + New
                </button>
              )}
            </div>

            <div className="dashboard-grid">
              {(Array.isArray(clubs) ? clubs : []).map(club => (
                <div
                  key={club._id}
                  className="action-card"
                  onClick={() => {
                    setSelectedClub(club);
                    // Check membership logic safely
                    setIsMember((club.members || []).some(m => m._id === userId));
                  }}
                  style={{ cursor: 'pointer', padding: '0', overflow: 'hidden', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{
                    height: '120px',
                    background: club.banner ? `url(${club.banner}) center/cover` : 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {!club.banner && <Users size={40} color="var(--text-secondary)" opacity={0.5} />}
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{club.name}</h3>
                      {club.logo && <img src={club.logo} alt="logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginTop: '-2.5rem', border: '3px solid var(--card-bg)' }} />}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {club.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={14} /> {club.members?.length || 0} Members
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {club.events?.length || 0} Events
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {clubs.length === 0 && (
              <div className="action-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>No clubs found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Clubs;
