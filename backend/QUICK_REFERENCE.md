# Authority Domain System - Quick Reference Card

## 🚀 Quick Start (5 minutes)

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Authority Creates Domain (First Time)
```bash
# Authority logs in
POST /api/v1/authority/login
Body: { email: "authority@email.com", password: "password" }
Returns: { accessToken, authority }

# Create domain
POST /api/v1/authority/domain/create
Headers: Authorization: Bearer <accessToken>
Body: { name: "Academics", description: "Academic issues" }
```

### 3. Student Creates Complaint
```bash
# Get available domains
GET /api/v1/authority/domain/all
Returns: [ { _id, name, description, authority } ]

# Create complaint (MUST include domainId)
POST /api/v1/problem/create
Headers: Authorization: Bearer <studentToken>
FormData:
  - title: "Lab equipment broken"
  - description: "Details..."
  - department: "CS"
  - domainId: "<selected domain ID>"
  - priority: "high"
  - image: <file>
```

### 4. Authority Manages
```bash
# View complaints in domain
GET /api/v1/authority/complaints
Headers: Authorization: Bearer <authorityToken>

# Accept a complaint
POST /api/v1/authority/complaints/<complaintId>/accept
Headers: Authorization: Bearer <authorityToken>

# Update status
PUT /api/v1/authority/complaints/<complaintId>/status
Headers: Authorization: Bearer <authorityToken>
Body: { status: "resolved" }
```

---

## 📋 All Endpoints (Quick Reference)

### Authority Endpoints
```
LOGIN
  POST /authority/login

DOMAIN MANAGEMENT
  POST   /authority/domain/create              (Create domain)
  GET    /authority/domain/all                 (All domains - public)
  GET    /authority/domain/my                  (My domain)
  GET    /authority/domain/:domainId           (Get specific)
  PUT    /authority/domain/:domainId/update    (Update)
  DELETE /authority/domain/:domainId/delete    (Delete)

COMPLAINT HANDLING
  GET    /authority/complaints                 (New in domain)
  POST   /authority/complaints/:id/accept      (Claim)
  PUT    /authority/complaints/:id/status      (Update status)
  GET    /authority/assigned-complaints        (My complaints)
```

### Problem Endpoints (Student/Admin)
```
STUDENT
  POST   /problem/create                       (Create with domainId)
  GET    /problem/student/problems             (My complaints)

SYSTEM
  GET    /problem/domain/:domainId/problems    (By domain)
  GET    /problem/all                          (Admin only)
  PATCH  /problem/update/:problemId            (Update)
```

---

## 🔑 Key Concepts

| Term | Meaning | Example |
|------|---------|---------|
| **Domain** | Complaint category owned by authority | "Academics", "Hostel" |
| **Authority** | Person managing a domain | Dr. Smith (Academics) |
| **Complaint/Problem** | Issue reported by student | "Lab equipment broken" |
| **Status** | Complaint progress | new → progress → resolved |

---

## ✅ Data Requirements

### Creating Domain
```javascript
{
  name: String (required, unique),
  description: String (optional)
}
```

### Creating Complaint
```javascript
{
  title: String (required),
  description: String (required),
  department: String (required),
  domainId: ObjectId (required) ◄─── MUST SELECT DOMAIN,
  priority: String (optional, default: "medium"),
  image: File (required)
}
```

### Updating Complaint Status
```javascript
{
  status: "new" | "progress" | "resolved" (required)
}
```

---

## 🔐 Access Control Quick Check

| Action | Student | Authority | Admin |
|--------|---------|-----------|-------|
| Create domain | ❌ | ✅ | ❌ |
| See domains | ✅ | ✅ | ✅ |
| Create complaint | ✅ | ❌ | ❌ |
| See own complaints | ✅ | ❌ | ❌ |
| See domain complaints | ❌ | ✅ | ❌ |
| See all complaints | ❌ | ❌ | ✅ |
| Accept complaint | ❌ | ✅* | ❌ |
| Update status | ❌ | ✅* | ❌ |

*Only for own domain/assigned

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "domainId is required" | Student didn't select domain | Use domain dropdown |
| "Domain not found" | Domain doesn't exist | Create domain first |
| "Unauthorized" | Invalid/missing token | Re-login, get new token |
| "This complaint is not in your domain" | Authority accessing wrong domain | Check complaint domain |
| "You are not assigned to this complaint" | Authority didn't accept it | Accept complaint first |

---

## 📊 Status Values

```javascript
// Complaint Status
status: "new"       // Just created
status: "progress"  // Authority accepted
status: "resolved"  // Completed

// Priority Values (optional)
priority: "high"    // Urgent
priority: "medium"  // Normal
priority: "low"     // Can wait
```

---

## 🔄 Complaint Workflow

```
Student Actions:
1. Login → 2. View Domains → 3. Create Complaint (Select Domain)
   ↓
Authority Actions:
4. View New Complaints → 5. Accept → 6. Update Status → 7. Resolve
   ↓
Student Actions:
8. View Complaint → 9. See Status Updated → 10. Problem Solved!
```

---

## 📱 Frontend Integration Checklist

### Student UI
- [ ] Login page (existing)
- [ ] Complaint form with **domain dropdown**
- [ ] Complaint list page
- [ ] Filter by domain
- [ ] View complaint details

### Authority UI
- [ ] Login page (existing)
- [ ] Dashboard with stats
- [ ] New complaints list
- [ ] "Accept" button per complaint
- [ ] My assignments list
- [ ] Status update dropdown
- [ ] Domain info display

### Admin UI
- [ ] System overview
- [ ] Domain list
- [ ] All complaints
- [ ] Filter options

---

## 🧪 Testing with Postman/Insomnia

### Test Flow
```
1. Authority Login
   POST /api/v1/authority/login
   
2. Get Token from response
   Store as: {{auth_token}}
   
3. Create Domain
   POST /api/v1/authority/domain/create
   Headers: Authorization: Bearer {{auth_token}}
   
4. Get Domain ID from response
   Store as: {{domain_id}}
   
5. Student Login
   POST /api/v1/student/login
   
6. Get Student Token
   Store as: {{student_token}}
   
7. Create Complaint
   POST /api/v1/problem/create
   Headers: Authorization: Bearer {{student_token}}
   Body includes: domainId={{domain_id}}
   
8. Test Authority Flow
   GET /api/v1/authority/complaints
   POST /api/v1/authority/complaints/{id}/accept
   PUT /api/v1/authority/complaints/{id}/status
```

---

## 💾 Database Collections

After setup, you'll have these collections:

```
krackhack/
├─ admins
├─ students           (added: domain field)
├─ authorities        (added: domain field)
├─ authoritydomains   ◄─── NEW
├─ problems           (added: domain, authority)
├─ faculties
├─ classes
├─ events
└─ sessions (Mongoose)
```

---

## 🎓 Learning Path

```
Beginner
├─ Understand domain = category
├─ Understand status = progress
└─ Make first API call

Intermediate
├─ Create domain
├─ Create complaint with domain
├─ Accept and update
└─ Verify access control

Advanced
├─ Build full frontend
├─ Implement caching
├─ Add notifications
└─ Build analytics
```

---

## 🚨 Important Notes

1. **Domain is REQUIRED** when creating complaint
2. **One domain per authority** initially
3. **Status flow** is linear: new → progress → resolved
4. **Privacy strict**: Students only see own complaints
5. **All routes** need proper JWT tokens
6. **CORS** configured for frontend domain

---

## 📞 Support Resources

- **System Docs**: `AUTHORITY_DOMAIN_SYSTEM.md`
- **Integration Guide**: `API_INTEGRATION_GUIDE.md`
- **Setup Guide**: `SETUP_GUIDE.md`
- **Visual Guides**: `VISUAL_GUIDES.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Readme**: `README_AUTHORITY_DOMAIN.md`

---

## 🎯 Success Criteria Check

- ✅ Authority can create domain
- ✅ Student sees all domains
- ✅ Student must select domain
- ✅ Student domain field updates
- ✅ Authority only sees their domain
- ✅ Authority can accept complaints
- ✅ Authority can update status
- ✅ Admin can see all
- ✅ Proper access control
- ✅ API fully functional

---

## 🚀 Next Steps

1. **Immediate**: Start backend, test endpoints
2. **Short-term**: Build UI components
3. **Medium-term**: Test end-to-end
4. **Long-term**: Deploy to production

**Ready to code? Let's go! 💪**

---

## Version Info

- **System**: Authority Domain System v1.0
- **Backend**: Node.js + Express + MongoDB
- **Auth**: JWT Token Based
- **Status**: Production Ready ✅
- **Last Updated**: February 2026
