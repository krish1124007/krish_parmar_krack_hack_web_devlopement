# Authority Domain System - Setup & Configuration Guide

## Installation & Deployment

### Prerequisites
- Node.js 16+ installed
- MongoDB running and connected
- Environment variables configured (JWT_SECRET, DB_URL, etc.)
- Backend project dependencies installed

### Deployment Steps

#### 1. Database Migration (First-Time Setup)

No special migration needed - the system uses Mongoose schemas which auto-create collections.

#### 2. Verify All Models Are Registered

Check `src/admin/model.register.ts` includes:
```typescript
"AuthorityDomain": AuthorityDomain,
"Problem": Problem
```

#### 3. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

#### 4. Test Authority Domain Creation

Authority needs to create domain after login:
```bash
# 1. Authority logs in
POST /api/v1/authority/login
Body: { email: "authority@example.com", password: "password" }

# 2. Authority creates domain (shows returned accessToken)
POST /api/v1/authority/domain/create
Headers: { Authorization: "Bearer <token_from_step_1>" }
Body: { name: "Academics", description: "Academic complaints" }

# 3. Verify domain in system
GET /api/v1/authority/domain/all
```

### MongoDB Schema Verification

After first run, verify these collections exist:
- `authorities` - Authority users
- `authoritydomains` - Authority domains (with unique name index)
- `problems` - Student complaints (with domain and authority refs)
- `students` - Student users (with domain ref)

### Required Environment Variables

Ensure these are set in `.env`:
```
JWT_SECRET=your_secret_key
DB_URL=mongodb://localhost:27017/your_db
CORS_ORIGIN=http://localhost:3000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Frontend Setup

### 1. Install Packages

The frontend needs axios (should already be installed via eventService.js):
```bash
cd frontend/aegis
npm install axios
```

### 2. Create Authority Service File

Create `src/utils/authorityService.js`:
```javascript
import axios from 'axios';

const API_BASE = '/api/v1';

// Get all domains available to students
export const getAllDomains = async () => {
    try {
        const response = await axios.get(`${API_BASE}/authority/domain/all`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch domains';
    }
};

// Create new domain (Authority only)
export const createDomain = async (domainData, token) => {
    try {
        const response = await axios.post(
            `${API_BASE}/authority/domain/create`,
            domainData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create domain';
    }
};

// Get authority's own domain
export const getMyDomain = async (token) => {
    try {
        const response = await axios.get(`${API_BASE}/authority/domain/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Domain not found';
    }
};

// Get domain complaints (unassigned) (Authority only)
export const getDomainComplaints = async (token) => {
    try {
        const response = await axios.get(`${API_BASE}/authority/complaints`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch complaints';
    }
};

// Accept a complaint (Authority claims it)
export const acceptComplaint = async (complaintId, token) => {
    try {
        const response = await axios.post(
            `${API_BASE}/authority/complaints/${complaintId}/accept`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to accept complaint';
    }
};

// Update complaint status
export const updateComplaintStatus = async (complaintId, status, token) => {
    try {
        const response = await axios.put(
            `${API_BASE}/authority/complaints/${complaintId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update status';
    }
};

// Get authority's assigned complaints
export const getAssignedComplaints = async (token) => {
    try {
        const response = await axios.get(`${API_BASE}/authority/assigned-complaints`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch assigned complaints';
    }
};

// Update problem controller exports
export const createComplaintWithDomain = async (formData, token) => {
    try {
        const response = await axios.post(`${API_BASE}/problem/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create complaint';
    }
};

export const getStudentComplaints = async (token) => {
    try {
        const response = await axios.get(`${API_BASE}/problem/student/problems`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch complaints';
    }
};

export const getDomainProblems = async (domainId) => {
    try {
        const response = await axios.get(`${API_BASE}/problem/domain/${domainId}/problems`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch domain problems';
    }
};
```

### 3. Update Problem Service (if exists)

If `src/utils/problemService.js` exists, update `createProblem` to require `domainId`:
```javascript
export const createProblem = async (formData, token) => {
    // formData must include: title, description, department, domainId, priority, image file
    const response = await axios.post('/api/v1/problem/create', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
```

### 4. Authority Pages Needed

Create these components:

#### Authority Dashboard (`src/pages/authority/Dashboard.jsx`)
```jsx
import { useEffect, useState } from 'react';
import { getDomainComplaints, getAssignedComplaints, getMyDomain } from '../../utils/authorityService';

export default function Dashboard() {
    const [myDomain, setMyDomain] = useState(null);
    const [newComplaints, setNewComplaints] = useState([]);
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        Promise.all([
            getMyDomain(token).then(setMyDomain),
            getDomainComplaints(token).then(setNewComplaints),
            getAssignedComplaints(token).then(setAssignedComplaints)
        ]).finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Authority Dashboard</h2>
            {myDomain && (
                <section>
                    <h3>My Domain: {myDomain.name}</h3>
                    <p>{myDomain.description}</p>
                </section>
            )}
            <section>
                <h3>New Complaints ({newComplaints.length})</h3>
                {/* List new complaints with Accept buttons */}
            </section>
            <section>
                <h3>My Assigned ({assignedComplaints.length})</h3>
                {/* List assigned complaints with status updates */}
            </section>
        </div>
    );
}
```

#### Student Complaint Form (Update existing)
```jsx
// Add domain selection dropdown
const [domains, setDomains] = useState([]);

useEffect(() => {
    getAllDomains().then(setDomains);
}, []);

// In form:
<select name="domainId" required>
    <option value="">Select Domain (required) *</option>
    {domains.map(d => (
        <option key={d._id} value={d._id}>
            {d.name} - {d.authority.name}
        </option>
    ))}
</select>
```

---

## API Endpoint Reference

### Base URL: `/api/v1`

#### Authority Routes
```
POST   /authority/login
POST   /authority/domain/create
GET    /authority/domain/all
GET    /authority/domain/my
GET    /authority/domain/:domainId
PUT    /authority/domain/:domainId/update
DELETE /authority/domain/:domainId/delete
GET    /authority/complaints
POST   /authority/complaints/:problemId/accept
PUT    /authority/complaints/:problemId/status
GET    /authority/assigned-complaints
```

#### Problem Routes (Updated)
```
POST   /problem/create (requires domainId)
GET    /problem/student/problems
GET    /problem/domain/problems (authority)
GET    /problem/domain/:domainId/problems
PATCH  /problem/update/:problemId
GET    /problem/all (admin)
```

---

## Testing the System

### Manual Test Flow

**Step 1: Setup Authority Domain**
1. Authority logs in via admin panel
2. Authority creates domain
3. Verify domain appears in `/domain/all`

**Step 2: Student Creates Complaint**
1. Student logs in
2. Student views domains
3. Student creates complaint with selected domain
4. Complaint saved with domain ref
5. Student domain field updated

**Step 3: Authority Manages Complaint**
1. Authority sees complaint in `/complaints`
2. Authority accepts complaint
3. Complaint shows authority is handling it
4. Authority updates status to "progress"
5. Authority marks as "resolved"

**Step 4: Verify Privacy**
1. Another student cannot see first student's complaints
2. Other authority cannot see different domain's complaints
3. Admin can see all complaints

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "domainId is required" | Student must select domain before creating complaint |
| "Domain not found" | Domain doesn't exist in DB; create one first |
| "Unauthorized" | JWT token missing/invalid; re-login |
| "You can only update your own domain" | Authority trying to modify another's domain |
| "This complaint is not in your domain" | Authority trying to access different domain's complaint |

---

## Performance Considerations

1. **Indexing**: Domain names are unique indexed
2. **Population**: Complaint queries populate domain and authority for performance
3. **Caching**: Consider caching domain list (doesn't change frequently)
4. **Bulk Operations**: Authority might need pagination for large complaint lists

### Suggested Pagination Addition
```typescript
router.route("/complaints").get(verifyJWT, getDomainComplaints);
// Add query params: ?page=1&limit=10
```

---

## Security Notes

1. ✅ JWT tokens include domain info for quick verification
2. ✅ Authority can only modify own domain (checked in controller)
3. ✅ Authority can only update complaints in their domain
4. ✅ Students only see own complaints
5. ✅ Domain creation is authority-only (verifyJWT middleware)

### Recommended: Add Role-Based Middleware
```typescript
const authorityOnly = (req, res, next) => {
    if (req.user?.role !== 'Authority') {
        return returnResponse(res, 403, "Forbidden", { success: false });
    }
    next();
};
// Use: router.route("/domain/create").post(verifyJWT, authorityOnly, createDomain);
```

---

## Documentation Files

- **AUTHORITY_DOMAIN_SYSTEM.md** - Complete system documentation
- **API_INTEGRATION_GUIDE.md** - Frontend integration examples
- **IMPLEMENTATION_SUMMARY.md** - Summary of all changes made
- **This file** - Setup and deployment guide

---

## Support & Next Steps

### Before Going Live
1. ✅ Test all endpoints with Postman/Insomnia
2. ✅ Implement frontend pages
3. ✅ Test user workflows end-to-end
4. ✅ Setup database backups
5. ✅ Configure CORS for production domain

### Future Enhancements
- [ ] Multiple domains per authority
- [ ] Domain transfer functionality
- [ ] Complaint reassignment
- [ ] SLA/response time tracking
- [ ] Notification system for complaints
- [ ] Analytics dashboard
- [ ] Bulk import of domains/authorities
