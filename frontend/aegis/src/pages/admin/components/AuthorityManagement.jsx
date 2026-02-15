
import React, { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import { Search, Plus } from 'lucide-react';

const AuthorityManagement = ({ authorities, onRefresh }) => {
    const [viewMode, setViewMode] = useState('domains'); // 'domains' | 'authorities'
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Domain State
    const [domains, setDomains] = useState([]);
    const [domainData, setDomainData] = useState({ name: '', description: '' });

    // Authority State (inherited props 'authorities' are used, or loaded specific to domain)
    const [authorityData, setAuthorityData] = useState({ name: '', email: '', password: '', mode: 'create', selectedId: '' });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    React.useEffect(() => {
        fetchDomains();
    }, [onRefresh]); // Refetch domains when refresh is triggered

    const fetchDomains = async () => {
        try {
            const res = await apiFetch('http://localhost:8000/api/v1/admin/get-domains');
            const data = await res.json();
            if (data.data.success) {
                console.log(data)

                setDomains(data.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateDomain = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('http://localhost:8000/api/v1/admin/create-domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(domainData)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Domain Created Successfully');
                setDomainData({ name: '', description: '' });
                setShowForm(false);
                fetchDomains();
            } else throw new Error(data.message);
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleCreateAuthority = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // First create the authority
            const res = await apiFetch('http://localhost:8000/api/v1/admin/create-authority', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authorityData)
            });
            const data = await res.json();

            if (res.ok) {
                const newAuthId = data.data.data._id;

                // If we are in a domain view, add this authority to the domain
                if (selectedDomain) {
                    await apiFetch('http://localhost:8000/api/v1/admin/add-authority-to-domain', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ domainId: selectedDomain._id, authorityId: newAuthId })
                    });
                }

                setMessage('Authority Created Successfully');
                setAuthorityData({ name: '', email: '', password: '', mode: 'create', selectedId: '' });
                setShowForm(false);
                onRefresh(); // Refresh global list
                fetchDomains(); // Refresh domains to update counts
                if (selectedDomain) handleDomainClick(selectedDomain); // Refresh current domain view
            } else throw new Error(data.message);
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDeleteAuthority = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            const res = await apiFetch(`http://localhost:8000/api/v1/admin/delete-authority/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.data.success) {
                setMessage('Authority Deleted');
                onRefresh();
                fetchDomains();
                if (selectedDomain) handleDomainClick(selectedDomain); // Refresh view
            } else {
                setMessage(data.message || 'Delete failed');
            }
        } catch (err) {
            setMessage('Error deleting item: ' + err.message);
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDomainClick = async (domain) => {
        // Fetch authorities for this domain to ensure fresh data
        try {
            const res = await apiFetch(`http://localhost:8000/api/v1/admin/get-domain-authorities/${domain._id}`);
            const data = await res.json();
            if (data.data.success) {
                // We update the selected domain with the fresh list of authorities
                setSelectedDomain({ ...domain, authorities: data.data.data });
                setViewMode('authorities');
                setShowForm(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderDomains = () => (
        <>
            <div className="section-header">
                <h2>Authority Domains</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="header-btn" onClick={() => { setShowForm(!showForm); }}>
                        {showForm ? 'Cancel' : <><Plus size={18} /> New Domain</>}
                    </button>
                    {/* Optional: Global Add Authority button if needed here */}
                </div>
            </div>

            {showForm && (
                <div className="action-card" style={{
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)'
                }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Create New Domain</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreateDomain} className="glass-form">
                        <div className="form-group">
                            <label>Domain Name</label>
                            <input
                                type="text"
                                value={domainData.name}
                                onChange={e => setDomainData({ ...domainData, name: e.target.value })}
                                required
                                style={{
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                    padding: '0.75rem',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                value={domainData.description}
                                onChange={e => setDomainData({ ...domainData, description: e.target.value })}
                                style={{
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                    padding: '0.75rem',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Domain'}
                        </button>
                    </form>
                </div>
            )}

            <div className="dashboard-grid">
                {domains.map(domain => (
                    <div
                        key={domain._id}
                        className="action-card"
                        onClick={() => handleDomainClick(domain)}
                        style={{
                            cursor: 'pointer',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            transition: 'all 0.3s ease',
                            borderRadius: '12px',
                            padding: '1.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.25rem',
                                    color: 'var(--text-primary)',
                                    fontWeight: '600'
                                }}>
                                    {domain.name}
                                </h3>
                                <p style={{
                                    margin: '0 0 1rem 0',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5'
                                }}>
                                    {domain.description || 'No description'}
                                </p>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.4rem 0.8rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }}>
                                    <span>👥</span>
                                    {domain.authorities?.length || 0} Members
                                </div>
                            </div>
                        </div>
                    </div>
                ))}</div>
        </>
    );

    const renderAuthorities = () => (
        <>
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="header-btn"
                        onClick={() => { setViewMode('domains'); setSelectedDomain(null); setShowForm(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                        &larr; Back to Domains
                    </button>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedDomain?.name} <span style={{ fontSize: '0.8em', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Authorities</span></h2>
                </div>
                <button
                    className="header-btn"
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: showForm ? 'transparent' : 'var(--primary)',
                        color: showForm ? 'var(--text-secondary)' : 'white',
                        border: showForm ? '1px solid var(--border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {showForm ? 'Cancel' : <><Plus size={18} /> Add Authority</>}
                </button>
            </div>

            {showForm && (
                <div className="action-card" style={{
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)'
                }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Add Authority to {selectedDomain?.name}</h2>
                            <p>Create a new authority or add an existing one to this domain</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                className={`header-btn ${authorityData.mode === 'create' ? 'active' : ''}`}
                                onClick={() => setAuthorityData({ ...authorityData, mode: 'create' })}
                                style={{
                                    background: authorityData.mode === 'create' ? 'var(--primary)' : 'transparent',
                                    color: authorityData.mode === 'create' ? '#fff' : 'var(--text-secondary)',
                                    border: authorityData.mode === 'create' ? 'none' : '1px solid var(--border)'
                                }}
                            >
                                Create New
                            </button>
                            <button
                                className={`header-btn ${authorityData.mode === 'existing' ? 'active' : ''}`}
                                onClick={() => setAuthorityData({ ...authorityData, mode: 'existing' })}
                                style={{
                                    background: authorityData.mode === 'existing' ? 'var(--primary)' : 'transparent',
                                    color: authorityData.mode === 'existing' ? '#fff' : 'var(--text-secondary)',
                                    border: authorityData.mode === 'existing' ? 'none' : '1px solid var(--border)'
                                }}
                            >
                                Add Existing
                            </button>
                        </div>
                    </div>

                    {authorityData.mode === 'existing' ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (authorityData.selectedId) {
                                // Add existing authority logic here
                                // Re-using handleCreateAuthority structure but skipping creation
                                const addExisting = async () => {
                                    setLoading(true);
                                    try {
                                        await apiFetch('http://localhost:8000/api/v1/admin/add-authority-to-domain', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ domainId: selectedDomain._id, authorityId: authorityData.selectedId })
                                        });
                                        setMessage('Authority Added Successfully');
                                        setAuthorityData({ ...authorityData, selectedId: '' });
                                        setShowForm(false);
                                        onRefresh();
                                        fetchDomains();
                                        if (selectedDomain) handleDomainClick(selectedDomain);
                                    } catch (err) {
                                        setMessage('Error: ' + err.message);
                                    } finally {
                                        setLoading(false);
                                        setTimeout(() => setMessage(''), 3000);
                                    }
                                };
                                addExisting();
                            }
                        }} className="glass-form">
                            <div className="form-group">
                                <label>Select Authority</label>
                                <select
                                    value={authorityData.selectedId || ''}
                                    onChange={e => setAuthorityData({ ...authorityData, selectedId: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>-- Select an Authority --</option>
                                    {authorities
                                        .filter(auth => !selectedDomain.authorities.some(da => da._id === auth._id)) // Filter out already added ones
                                        .map(auth => (
                                            <option key={auth._id} value={auth._id} style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
                                                {auth.name} ({auth.email})
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Adding...' : 'Add Selected Authority'}</button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateAuthority} className="glass-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={authorityData.name}
                                    onChange={e => setAuthorityData({ ...authorityData, name: e.target.value })}
                                    required
                                    style={{
                                        background: 'var(--input-bg)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={authorityData.email}
                                    onChange={e => setAuthorityData({ ...authorityData, email: e.target.value })}
                                    required
                                    style={{
                                        background: 'var(--input-bg)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={authorityData.password}
                                    onChange={e => setAuthorityData({ ...authorityData, password: e.target.value })}
                                    required
                                    style={{
                                        background: 'var(--input-bg)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Creating...' : 'Create & Add'}</button>
                        </form>
                    )}
                </div>
            )}

            <div className="action-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                <div className="table-container" style={{ margin: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Role</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Email</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedDomain?.authorities?.map((row) => (
                                <tr key={row._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.name}</span></td>
                                    <td style={{ padding: '1rem' }}>{row.role}</td>
                                    <td style={{ padding: '1rem' }}>{row.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="header-btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        const res = await apiFetch('http://localhost:8000/api/v1/admin/send-work-report', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ authorityId: row._id })
                                                        });
                                                        const data = await res.json();
                                                        if (data.data.success) {
                                                            setMessage(`Work report sent to ${row.name} successfully!`);
                                                        } else {
                                                            setMessage('Error sending report');
                                                        }
                                                    } catch (err) {
                                                        setMessage('Error sending report: ' + err.message);
                                                    }
                                                    setTimeout(() => setMessage(''), 3000);
                                                }}
                                            >
                                                📧 <span style={{ marginLeft: '4px' }}>Send Report</span>
                                            </button>
                                            <button
                                                className="header-btn"
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--danger)',
                                                    borderColor: 'var(--border)',
                                                    background: 'transparent'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); handleDeleteAuthority(row._id); }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!selectedDomain?.authorities || selectedDomain.authorities.length === 0) && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '2rem', opacity: '0.5' }}>👥</span>
                                            <p>No authorities in this domain yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    return (
        <div className="content-section fade-in">
            {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

            {viewMode === 'domains' ? renderDomains() : renderAuthorities()}
        </div>
    );
};

export default AuthorityManagement;
