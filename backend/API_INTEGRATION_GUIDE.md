# Authority Domain System - API Integration Guide

## Quick Reference for Frontend Implementation

### 1. Authority Domain Management

#### Get All Available Domains
```javascript
// Show all domains to students (for complaint creation)
const domains = await fetch('/api/v1/authority/domain/all').then(r => r.json());
// Returns: { success: true, data: [{_id, name, description, authority: {name, email}}, ...] }
```

#### Get Authority's Own Domain
```javascript
// Used by Authority to manage their domain
const myDomain = await fetch('/api/v1/authority/domain/my', {
    headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json());
// Returns: { success: true, data: {_id, name, description, authority} }
```

#### Create Domain (Authority Only)
```javascript
const newDomain = await fetch('/api/v1/authority/domain/create', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'Academics', description: 'Academic issues' })
}).then(r => r.json());
```

### 2. Student Complaint Creation

#### Get Domains for Dropdown (Before Creating Complaint)
```javascript
// Display dropdown of all domains
const response = await fetch('/api/v1/authority/domain/all');
const { data: domains } = await response.json();
// User selects one domain: domainId = domains[index]._id
```

#### Create Complaint with Domain Selection
```javascript
const formData = new FormData();
formData.append('title', 'Lab equipment not working');
formData.append('description', 'Detailed problem...');
formData.append('department', 'Computer Science');
formData.append('priority', 'high');
formData.append('domainId', selectedDomainId); // REQUIRED - domain selected by student
formData.append('image', imageFile);

const complaint = await fetch('/api/v1/problem/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: formData
}).then(r => r.json());
```

#### View Student's Complaints
```javascript
const myComplaints = await fetch('/api/v1/problem/student/problems', {
    headers: { Authorization: `Bearer ${studentToken}` }
}).then(r => r.json());
// Returns: { success: true, data: [{ ..., domain: {_id, name}, authority: {name, email} }, ...] }
```

### 3. Authority Complaint Management

#### View All Complaints in My Domain
```javascript
const domainComplaints = await fetch('/api/v1/authority/complaints', {
    headers: { Authorization: `Bearer ${authorityToken}` }
}).then(r => r.json());
// Returns all NEW complaints in authority's domain
```

#### Accept a Complaint (Claim it)
```javascript
const updated = await fetch(`/api/v1/authority/complaints/${complaintId}/accept`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authorityToken}` }
}).then(r => r.json());
// Changes status to 'progress' and assigns authority
```

#### Update Complaint Status
```javascript
const updated = await fetch(`/api/v1/authority/complaints/${complaintId}/status`, {
    method: 'PUT',
    headers: {
        Authorization: `Bearer ${authorityToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'resolved' })
}).then(r => r.json());
// status: 'new' | 'progress' | 'resolved'
```

#### View My Assigned Complaints
```javascript
const myComplaints = await fetch('/api/v1/authority/assigned-complaints', {
    headers: { Authorization: `Bearer ${authorityToken}` }
}).then(r => r.json());
// Returns only complaints assigned to me
```

### 4. Admin Monitoring

#### Get All Complaints in System
```javascript
const allComplaints = await fetch('/api/v1/problem/all', {
    headers: { Authorization: `Bearer ${adminToken}` }
}).then(r => r.json());
// Returns with full details: student, domain, authority info
```

#### Get Complaints by Specific Domain
```javascript
const domainComplaints = await fetch(
    `/api/v1/problem/domain/${domainId}/problems`
).then(r => r.json());
```

---

## Component Implementation Examples

### Student - Select Domain for Complaint
```jsx
const [domains, setDomains] = useState([]);

useEffect(() => {
    fetch('/api/v1/authority/domain/all')
        .then(r => r.json())
        .then(({ data }) => setDomains(data));
}, []);

return (
    <form onSubmit={handleCreateComplaint}>
        <select 
            name="domainId" 
            required
            onChange={(e) => setFormData({...formData, domainId: e.target.value})}
        >
            <option value="">Select Domain *</option>
            {domains.map(d => (
                <option key={d._id} value={d._id}>
                    {d.name} (Authority: {d.authority.name})
                </option>
            ))}
        </select>
        {/* title, description, department, image, priority fields */}
        <button type="submit">Submit Complaint</button>
    </form>
);
```

### Authority - Dashboard View
```jsx
const [newComplaints, setNewComplaints] = useState([]);
const [myComplaints, setMyComplaints] = useState([]);

useEffect(() => {
    // Get unassigned complaints in my domain
    fetch('/api/v1/authority/complaints', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(({ data }) => setNewComplaints(data));

    // Get my assigned complaints
    fetch('/api/v1/authority/assigned-complaints', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(({ data }) => setMyComplaints(data));
}, []);

return (
    <div>
        <section>
            <h3>New Complaints ({newComplaints.length})</h3>
            {newComplaints.map(complaint => (
                <div key={complaint._id}>
                    <h4>{complaint.title}</h4>
                    <p>From: {complaint.student.name}</p>
                    <button onClick={() => acceptComplaint(complaint._id)}>
                        Accept & Handle
                    </button>
                </div>
            ))}
        </section>

        <section>
            <h3>My Assigned ({myComplaints.length})</h3>
            {myComplaints.map(complaint => (
                <div key={complaint._id}>
                    <h4>{complaint.title}</h4>
                    <p>Status: {complaint.status}</p>
                    <select 
                        value={complaint.status}
                        onChange={(e) => updateStatus(complaint._id, e.target.value)}
                    >
                        <option value="progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            ))}
        </section>
    </div>
);
```

---

## Key Points for Frontend

1. **Domain Selection is Mandatory**
   - Students MUST select a domain when creating complaint
   - Show as required field in form
   - Include authority name next to domain

2. **Complaint Visibility Depends on Domain**
   - Students only see their own complaints
   - Authority only sees complaints in their domain
   - Admin can see all complaints globally

3. **Status Flow**
   - new → authority accepts → progress → resolved
   - Authority can also mark as 'new' if reopening

4. **Authority Pages Needed**
   - Dashboard: Count of new complaints
   - New Complaints: List with "Accept" button
   - My Complaints: List with status update dropdown
   - Domain Info: Show my domain details

5. **Student Pages Needed**
   - Complaint Form: Dropdown to select domain (shows authority)
   - Complaint List: Show status and which authority is handling
   - Filter: By domain, status, priority
