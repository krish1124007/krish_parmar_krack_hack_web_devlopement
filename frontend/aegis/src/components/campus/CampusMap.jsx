import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Search, Map, MapPin, Navigation, Info, X } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/CampusMap.css';

const CampusMap = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const [locations, setLocations] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchLocations();
    initMap();
  }, [categoryFilter]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchLocations = async () => {
    try {
      let url = '/api/v1/campus/locations?';
      if (categoryFilter !== 'all') url += `category=${categoryFilter}`;

      const response = await axios.get(url);
      setLocations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  const initMap = () => {
    // Placeholder for map initialization logic
    setMapReady(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchLocations();
      return;
    }

    try {
      const response = await axios.get(`/api/v1/campus/locations/search?query=${searchQuery}`);
      setLocations(response.data.data || []);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const getMarkerColor = (category) => {
    switch (category) {
      case 'classroom': return 'var(--primary)';
      case 'office': return 'var(--secondary)'; // Gray/Slate?
      case 'lab': return 'var(--info)';
      case 'mess': return 'var(--warning)'; // Orange/Amber
      case 'library': return 'var(--success)';
      case 'atm': return 'var(--success)';
      case 'medical': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Layout
      role="student"
      title="Campus Map"
      subtitle="Navigate the campus with ease"
      user={user}
      activeTab="campus-map"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
        <div className="action-card" style={{ marginBottom: '1rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ width: '100%', height: '48px', padding: '0 1rem 0 2.5rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Locations</option>
              <option value="classroom">Classrooms</option>
              <option value="office">Offices</option>
              <option value="lab">Labs</option>
              <option value="mess">Mess Halls</option>
              <option value="library">Libraries</option>
              <option value="atm">ATMs</option>
              <option value="medical">Medical Center</option>
            </select>
          </div>
        </div>

        <div className="action-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            {/* Map Placeholder */}
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {/* Simple Grid Overlay for demo */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gridTemplateRows: 'repeat(10, 1fr)',
                width: '100%',
                height: '100%',
                opacity: 0.1,
                pointerEvents: 'none',
                backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>

              {/* Markers */}
              {(Array.isArray(locations) ? locations : []).map(location => (
                <div
                  key={location._id}
                  onClick={() => setSelectedPOI(location)}
                  style={{
                    position: 'absolute',
                    left: `${(location.longitude + 90) / 180 * 100}%`, // Very rough mock coordinate logic
                    top: `${(90 - location.latitude) / 180 * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  title={location.name}
                >
                  <MapPin size={32} color={getMarkerColor(location.category)} fill={getMarkerColor(location.category)} />
                </div>
              ))}

              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Map Visualization (Mock)
              </div>
            </div>
          </div>

          {selectedPOI && (
            <div style={{
              width: '350px',
              borderLeft: '1px solid var(--border)',
              background: 'var(--card-bg)',
              padding: '1.5rem',
              overflowY: 'auto',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 20,
              boxShadow: '-4px 0 10px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={() => setSelectedPOI(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>

              <h3 style={{ marginTop: '1rem', fontSize: '1.4rem', fontWeight: 600 }}>{selectedPOI.name}</h3>
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: getMarkerColor(selectedPOI.category),
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {selectedPOI.category}
              </span>

              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedPOI.description}
              </p>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {selectedPOI.building && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <Navigation size={18} color="var(--primary)" />
                    <span>Building: <strong>{selectedPOI.building}</strong></span>
                  </div>
                )}
                {selectedPOI.floor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <Map size={18} color="var(--primary)" />
                    <span>Floor: <strong>{selectedPOI.floor}</strong></span>
                  </div>
                )}
              </div>

              {selectedPOI.facilities && selectedPOI.facilities.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>FACILITIES</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedPOI.facilities.map((f, i) => (
                      <span key={i} style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CampusMap;
