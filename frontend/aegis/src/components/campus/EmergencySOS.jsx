import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { AlertCircle, MapPin, Send, Phone, Info, Shield, HeartPulse, Flame, MoreHorizontal } from 'lucide-react';
import '../../styles/Dashboard.css';
import '../../styles/EmergencySOS.css';

const EmergencySOS = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const [isAlertActive, setIsAlertActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Campus Location (Coordinates shared)'
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({
            latitude: 0,
            longitude: 0,
            address: 'Location unavailable'
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setIsGettingLocation(false);
    }
  };

  const handleEmergencyAlert = async () => {
    if (!emergencyType || !description) {
      alert('Please provide emergency type and description');
      return;
    }

    try {
      await axios.post('/api/v1/campus/emergency', {
        location,
        emergencyType,
        description
      });

      setIsAlertActive(true);
      setEmergencyType('');
      setDescription('');
      setLocation(null);

      // Alert will auto-clear after 5 seconds
      setTimeout(() => setIsAlertActive(false), 5000);
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      alert('Failed to send emergency alert');
    }
  };

  return (
    <Layout
      role="student"
      title="Emergency SOS"
      subtitle="Immediate assistance and support"
      user={user}
      activeTab="emergency"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="content-section fade-in">
        {isAlertActive && (
          <div className="status-toast error" style={{ position: 'relative', top: 'auto', right: 'auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700 }}>Emergency Alert Sent!</h3>
              <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>Security has been notified. Stay calm.</p>
            </div>
          </div>
        )}

        <div className="dashboard-grid glass-form" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* Emergency Form */}
          <div className="action-card" style={{ padding: '2rem', borderTop: '4px solid var(--danger)' }}>
            <div className="card-header">
              <div className="card-title">
                <h2 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={24} /> Report Emergency
                </h2>
                <p>Send an immediate alert to campus security</p>
              </div>
            </div>

            <div className="form-group">
              <label>Type of Emergency *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  className={`submit-btn ${emergencyType === 'medical' ? 'active' : ''}`}
                  onClick={() => setEmergencyType('medical')}
                  style={{ background: emergencyType === 'medical' ? 'var(--danger)' : 'var(--bg-secondary)', color: emergencyType === 'medical' ? 'white' : 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', height: 'auto', border: '1px solid var(--border)' }}
                >
                  <HeartPulse size={24} style={{ marginBottom: '0.5rem' }} /> Medical
                </button>
                <button
                  className={`submit-btn ${emergencyType === 'fire' ? 'active' : ''}`}
                  onClick={() => setEmergencyType('fire')}
                  style={{ background: emergencyType === 'fire' ? 'var(--warning)' : 'var(--bg-secondary)', color: emergencyType === 'fire' ? 'white' : 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', height: 'auto', border: '1px solid var(--border)' }}
                >
                  <Flame size={24} style={{ marginBottom: '0.5rem' }} /> Fire
                </button>
                <button
                  className={`submit-btn ${emergencyType === 'security' ? 'active' : ''}`}
                  onClick={() => setEmergencyType('security')}
                  style={{ background: emergencyType === 'security' ? 'var(--info)' : 'var(--bg-secondary)', color: emergencyType === 'security' ? 'white' : 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', height: 'auto', border: '1px solid var(--border)' }}
                >
                  <Shield size={24} style={{ marginBottom: '0.5rem' }} /> Security
                </button>
                <button
                  className={`submit-btn ${emergencyType === 'other' ? 'active' : ''}`}
                  onClick={() => setEmergencyType('other')}
                  style={{ background: emergencyType === 'other' ? 'var(--text-secondary)' : 'var(--bg-secondary)', color: emergencyType === 'other' ? 'white' : 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', height: 'auto', border: '1px solid var(--border)' }}
                >
                  <MoreHorizontal size={24} style={{ marginBottom: '0.5rem' }} /> Other
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the situation..."
                rows={4}
                style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="submit-btn"
                style={{ background: location ? 'var(--success)' : 'var(--bg-secondary)', color: location ? 'white' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', border: '1px solid var(--border)' }}
              >
                {isGettingLocation ? 'Acquiring...' : (location ? 'Location Secured' : '📍 Share GPS Location')}
              </button>
              {location && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                  Lat: {location.latitude.toFixed(5)}, Long: {location.longitude.toFixed(5)}
                </p>
              )}
            </div>

            <button
              className="submit-btn"
              onClick={handleEmergencyAlert}
              style={{ background: 'var(--danger)', fontSize: '1.2rem', padding: '1.2rem', marginTop: '1rem', fontWeight: 700, letterSpacing: '1px', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)' }}
            >
              🚨 SEND ALERT
            </button>
          </div>

          {/* Contacts & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="action-card" style={{ padding: '2rem' }}>
              <div className="card-header">
                <div className="card-title">
                  <h2><Phone size={20} style={{ display: 'inline', marginRight: '0.5rem' }} /> Emergency Contacts</h2>
                  <p>Direct lines for immediate help</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '10px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--danger)' }}>Campus Security</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>24/7 Patrol</p>
                  </div>
                  <a href="tel:+919876543210" style={{ fontWeight: 700, color: 'var(--danger)', textDecoration: 'none' }}>CALL</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--info)' }}>Medical Centre</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ambulance</p>
                  </div>
                  <a href="tel:+919876543211" style={{ fontWeight: 700, color: 'var(--info)', textDecoration: 'none' }}>CALL</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '10px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--warning)' }}>Fire Station</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fire & Rescue</p>
                  </div>
                  <a href="tel:+919876543212" style={{ fontWeight: 700, color: 'var(--warning)', textDecoration: 'none' }}>CALL</a>
                </div>
              </div>
            </div>

            <div className="action-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--card-bg) 100%)' }}>
              <div className="card-header">
                <div className="card-title">
                  <h2><Info size={20} style={{ display: 'inline', marginRight: '0.5rem' }} /> Safety Guidelines</h2>
                </div>
              </div>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <li>Stay calm and move to a safe location if possible.</li>
                <li>When calling, state your name and exact location clearly.</li>
                <li>Do not hang up until instructed by the dispatcher.</li>
                <li>If you cannot speak, try to signal or make noise to alert nearby security.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencySOS;
