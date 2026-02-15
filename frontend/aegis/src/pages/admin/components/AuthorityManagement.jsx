
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
                <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Create New Domain</h2>
                        </div>
                    </div>
                    <form onSubmit={handleCreateDomain} className="glass-form">
                        <div className="form-group">
                            <label>Domain Name</label>
                            <input type="text" value={domainData.name} onChange={e => setDomainData({ ...domainData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" value={domainData.description} onChange={e => setDomainData({ ...domainData, description: e.target.value })} />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Creating...' : 'Create Domain'}</button>
                    </form>
                </div>
            )}

            <div className="dashboard-grid">
                {domains.map(domain => (
                    <div key={domain._id} className="action-card" onClick={() => handleDomainClick(domain)} style={{ cursor: 'pointer' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <h3>{domain.name}</h3>
                                <p>{domain.description || 'No description'}</p>
                            </div>
                            <div className="icon-bg bg-purple-100 text-purple-600">
                                {domain.authorities?.length || 0} Members
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const renderAuthorities = () => (
        <>
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="header-btn" onClick={() => { setViewMode('domains'); setSelectedDomain(null); setShowForm(false); }}>
                        &larr; Back
                    </button>
                    <h2>{selectedDomain?.name} Authorities</h2>
                </div>
                <button className="header-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : <><Plus size={18} /> Add Authority</>}
                </button>
            </div>

            {showForm && (
                <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <h2>Add Authority to {selectedDomain?.name}</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                className={`header-btn ${authorityData.mode === 'create' ? 'active' : ''}`}
                                onClick={() => setAuthorityData({ ...authorityData, mode: 'create' })}
                                style={{ background: authorityData.mode === 'create' ? 'var(--primary)' : 'transparent', color: authorityData.mode === 'create' ? '#fff' : 'var(--text-primary)' }}
                            >
                                Create New
                            </button>
                            <button
                                className={`header-btn ${authorityData.mode === 'existing' ? 'active' : ''}`}
                                onClick={() => setAuthorityData({ ...authorityData, mode: 'existing' })}
                                style={{ background: authorityData.mode === 'existing' ? 'var(--primary)' : 'transparent', color: authorityData.mode === 'existing' ? '#fff' : 'var(--text-primary)' }}
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
                                        border: '1px solid var(--input-border)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="">-- Select an Authority --</option>
                                    {authorities
                                        .filter(auth => !selectedDomain.authorities.some(da => da._id === auth._id)) // Filter out already added ones
                                        .map(auth => (
                                            <option key={auth._id} value={auth._id}>
                                                {auth.name} ({auth.email})
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Adding...' : 'Add Selected Authority'}</button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateAuthority} className="glass-form">
                            <div className="form-group"><label>Name</label><input type="text" value={authorityData.name} onChange={e => setAuthorityData({ ...authorityData, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Email</label><input type="email" value={authorityData.email} onChange={e => setAuthorityData({ ...authorityData, email: e.target.value })} required /></div>
                            <div className="form-group"><label>Password</label><input type="password" value={authorityData.password} onChange={e => setAuthorityData({ ...authorityData, password: e.target.value })} required /></div>
                            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Creating...' : 'Create & Add'}</button>
                        </form>
                    )}
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedDomain?.authorities?.map((row) => (
                            <tr key={row._id}>
                                <td><span style={{ fontWeight: 500 }}>{row.name}</span></td>
                                <td>{row.role}</td>
                                <td>{row.email}</td>
                                <td>
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
                                            📧 Send Report
                                        </button>
                                        <button className="header-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDeleteAuthority(row._id); }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!selectedDomain?.authorities || selectedDomain.authorities.length === 0) && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No authorities in this domain</td></tr>}
                    </tbody>
                </table>
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
