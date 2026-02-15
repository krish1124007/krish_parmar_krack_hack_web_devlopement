# Authority Domain System Documentation

## Overview
The Authority Domain System is a hierarchical complaint management system where authorities can create specialized domains (complaint categories), students can submit complaints to specific domains, and authorities can manage their assigned domains and complaints.

## System Architecture

### Key Entities

#### 1. **AuthorityDomain**
- **Purpose**: Represents a specialized complaint handling domain
- **Owner**: Created and managed by a specific Authority
- **Visibility**: Visible to all users (Admin, all Authorities, Students)
- **Fields**:
  - `name`: Unique domain name (e.g., "Academics", "Hostel", "Finance")
  - `description`: Details about the domain
  - `authority`: Reference to the Authority who owns this domain
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

#### 2. **Authority**
- **Purpose**: User with complaint management responsibilities
- **Responsibilities**:
  - Create and manage their domain
  - Accept complaints submitted to their domain
  - Update complaint status
  - View all complaints in their domain
- **Fields**:
  - `name`, `email`, `password`: Authentication
  - `department`: Department information
  - `domain`: Reference to AuthorityDomain they manage
  - `role`: Set to "Authority"

#### 3. **Student**
- **Purpose**: User who can submit complaints to specific domains
- **Process**:
  - Views available domains
  - Selects a domain when creating a complaint
  - Can only see complaints in their selected domain
  - After complaint submission, domain is stored in student record
- **Fields**:
  - Standard student fields + `domain`: Reference to chosen AuthorityDomain

#### 4. **Problem (Complaint)**
- **Purpose**: Complaint ticket submitted by student to specific domain
- **Required Fields for Creation**:
  - `title`: Complaint title
  - `description`: Detailed description
  - `department`: Department related to complaint
  - `image`: Proof/evidence image
  - `domainId`: Which domain this complaint belongs to
- **Fields**:
  - `domain`: Reference to AuthorityDomain (REQUIRED)
  - `authority`: Reference to Authority handling it (assigned when accepted)
  - `student`: Reference to Student who created it
  - `status`: "new" | "progress" | "resolved"
  - `priority`: "high" | "medium" | "low"

---

## User Workflows

### Authority Workflow

1. **Register/Login**
   ```
   POST /api/v1/authority/login
   Body: { email, password }
   Returns: { authority, accessToken }
   ```

2. **Create Domain** (First-time setup)
   ```
   POST /api/v1/authority/domain/create
   Headers: { Authorization: "Bearer <token>" }
   Body: { name, description }
   Returns: { domain }
   ```
   - Only one domain per authority initially
   - Automatically links authority to domain

3. **View All Domains** (See all system domains)
   ```
   GET /api/v1/authority/domain/all
   Returns: Array of all domains with authority info
   ```

4. **Get My Domain**
   ```
   GET /api/v1/authority/domain/my
   Headers: { Authorization: "Bearer <token>" }
   Returns: { domain }
   ```

5. **View Domain Complaints** (All complaints in my domain)
   ```
   GET /api/v1/authority/complaints
   Headers: { Authorization: "Bearer <token>" }
   Returns: Array of complaints in my domain
   ```

6. **Accept Complaint** (Claim a complaint to work on it)
   ```
   POST /api/v1/authority/complaints/:problemId/accept
   Headers: { Authorization: "Bearer <token>" }
   Effect: Sets authority as handler, status changes to "progress"
   Returns: { problem }
   ```

7. **Update Complaint Status** (Mark as resolved, etc.)
   ```
   PUT /api/v1/authority/complaints/:problemId/status
   Headers: { Authorization: "Bearer <token>" }
   Body: { status: "new" | "progress" | "resolved" }
   Returns: { problem }
   ```

8. **View My Assigned Complaints** (Complaints I'm handling)
   ```
   GET /api/v1/authority/assigned-complaints
   Headers: { Authorization: "Bearer <token>" }
   Returns: Array of assigned complaints
   ```

### Student Workflow

1. **Login**
   ```
   POST /api/v1/student/login
   Body: { email, className }
   Returns: { student, accessToken }
   ```

2. **View Available Domains** (Complaint categories)
   ```
   GET /api/v1/authority/domain/all
   Returns: Array of all domains
   ```
   - Student can see all available domains
   - Each domain shows authority (owner) information

3. **Create Complaint** (Submit to specific domain)
   ```
   POST /api/v1/problem/create
   Headers: { Authorization: "Bearer <token>" }
   Body (FormData):
   {
     title: "string",
     description: "string",
     department: "string",
     priority: "high|medium|low",
     domainId: "ObjectId of domain",
     image: File
   }
   Returns: { problem }
   Effect: Student's domain field is updated to domainId
   ```

4. **View My Complaints** (Only sees complaints in their domain)
   ```
   GET /api/v1/problem/student/problems
   Headers: { Authorization: "Bearer <token>" }
   Returns: Array of student's complaints
   Note: Populated with domain and authority info
   ```

5. **Track Complaint Status**
   - Student can see status: "new" → "progress" → "resolved"
   - Can see which authority is handling it
   - Can see updates on their complaints

### Admin Workflow

1. **View All System Data**
   - **All Domains**: `GET /api/v1/authority/domain/all`
   - **All Complaints**: `GET /api/v1/problem/all`
   - Can see full system state including:
     - Which authority manages which domain
     - All complaints and their current status
     - Which authority is handling each complaint
     - Student information for each complaint

---

## Domain Visibility Rules

### **AuthorityDomain Visibility**
| User Type | Can View | Can Edit | Can Delete |
|-----------|----------|----------|-----------|
| Authority (Owner) | Own domain + all others | Own domain only | Own domain only |
| Authority (Other) | All domains (read-only) | No | No |
| Student | All domains (to select for complaint) | No | No |
| Admin | All domains | No | No |

### **Problem (Complaint) Visibility**
| User Type | Can View | Can Create | Can Update |
|-----------|----------|-----------|-----------|
| Student | Own complaints only | Yes (to own domain) | No |
| Authority | Complaints in own domain | No | Assigned complaints |
| Admin | All complaints | No | No (through other means) |

### **Student Domain Selection**
- Student sees all domains when creating complaint
- Must select one domain (required field)
- After creation, student's `domain` field stores selected domain
- Student can only see their own complaints (which are in their domain)
- If student needs to create complaint in different domain later, they can select it

---

## API Endpoints Summary

### Authority Endpoints
```
POST   /api/v1/authority/login
POST   /api/v1/authority/domain/create
GET    /api/v1/authority/domain/all
GET    /api/v1/authority/domain/my
GET    /api/v1/authority/domain/:domainId
PUT    /api/v1/authority/domain/:domainId/update
DELETE /api/v1/authority/domain/:domainId/delete
GET    /api/v1/authority/complaints
POST   /api/v1/authority/complaints/:problemId/accept
PUT    /api/v1/authority/complaints/:problemId/status
GET    /api/v1/authority/assigned-complaints
```

### Problem Endpoints
```
POST   /api/v1/problem/create (Student creates complaint with domainId)
GET    /api/v1/problem/student/problems
GET    /api/v1/problem/domain/problems (Authority gets domain complaints)
GET    /api/v1/problem/domain/:domainId/problems (Get complaints by domain)
PATCH  /api/v1/problem/update/:problemId
GET    /api/v1/problem/all (Admin)
```

---

## Key Features

1. **Domain-Based Segregation**
   - Complaints are organized by domain
   - Authorities specialize in specific domains
   - Students submit to appropriate domains

2. **Complaint Lifecycle**
   - `new`: Just created, waiting for authority
   - `progress`: Authority accepted and working
   - `resolved`: Authority completed

3. **Tracking & Accountability**
   - Which authority handles each complaint
   - When it was created and updated
   - Full complaint history with all metadata

4. **Student Privacy**
   - Students only see their own complaints
   - Can see which authority is handling their complaint
   - Cannot see other students' complaints

5. **Authority Management**
   - Each authority manages one unique domain
   - Can see all complaints in their domain
   - Can accept and track complaints

---

## Database Schema Notes

### Problem Schema Additions
```typescript
domain: ObjectId → AuthorityDomain (REQUIRED)
authority: ObjectId → Authority (Optional, assigned when accepted)
```

### Authority Schema Additions
```typescript
domain: ObjectId → AuthorityDomain (Optional, one per authority)
```

### Student Schema Additions
```typescript
domain: ObjectId → AuthorityDomain (Optional, set when creating complaint)
```

---

## Error Handling

| Scenario | Error Code | Message |
|----------|-----------|---------|
| No domain specified when creating complaint | 400 | "domainId is required" |
| Domain doesn't exist | 404 | "Domain not found" |
| Student creating complaint without login | 401 | "Unauthorized" |
| Authority accessing other domain's complaints | 403 | "This complaint is not in your domain" |
| Authority updating complaint they don't handle | 403 | "You are not assigned to this complaint" |

---

## Future Enhancements
- Multiple domains per authority
- Domain transfer/reassignment
- Complaint reassignment between authorities
- SLA tracking per domain
- Analytics per domain
