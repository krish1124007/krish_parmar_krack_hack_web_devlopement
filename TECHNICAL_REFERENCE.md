# 📚 KrackHack - Technical Implementation Reference Guide

---

## 🔧 Quick Start Guide

### Prerequisites
- Node.js 16+ (Backend)
- npm or yarn (Package Manager)
- MongoDB Atlas account (Database)
- Cloudinary account (Image Storage)
- Gmail/Email service (Notifications)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file with:
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/krackhack
JWT_SECRET=your_secret_key_here_min_32_chars
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Run development server
npm run dev

# Server runs on http://localhost:8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend/aegis

# Install dependencies
npm install

# Create .env file with:
VITE_API_BASE_URL=http://localhost:8000

# Run development server
npm run dev

# Frontend runs on http://localhost:5173
```

---

## 📡 API Endpoints Reference

### Authentication
```
POST   /api/v1/student/register        Register new student
POST   /api/v1/student/login           Student login
POST   /api/v1/faculty/register        Register faculty
POST   /api/v1/faculty/login           Faculty login
POST   /api/v1/authority/register      Register authority
POST   /api/v1/authority/login         Authority login
POST   /api/v1/admin/create-admin      Create admin user
POST   /logout                         Logout endpoint
```

### Student Profile
```
GET    /api/v1/student/profile         Get student profile
PUT    /api/v1/student/profile         Update profile
GET    /api/v1/student/:id             Get student by ID
```

### Problems
```
POST   /api/v1/problem                 Create problem
GET    /api/v1/problem                 Get all problems
GET    /api/v1/problem/:id             Get problem details
PUT    /api/v1/problem/:id             Update problem
DELETE /api/v1/problem/:id             Delete problem
POST   /api/v1/problem/:id/comment     Add comment
GET    /api/v1/problem/:status         Filter by status
```

### Events
```
POST   /api/v1/event                   Create event
GET    /api/v1/event                   Get all events
GET    /api/v1/event/:id               Get event details
PUT    /api/v1/event/:id               Update event
DELETE /api/v1/event/:id               Delete event
POST   /api/v1/event/:id/register      Register for event
DELETE /api/v1/event/:id/register/:sid Unregister
GET    /api/v1/event/:id/attendees     Get attendee list
```

### Forum
```
POST   /api/v1/forum/post              Create post
GET    /api/v1/forum/post              Get all posts
GET    /api/v1/forum/post/:id          Get post with comments
PUT    /api/v1/forum/post/:id          Edit post
DELETE /api/v1/forum/post/:id          Delete post
POST   /api/v1/forum/post/:id/comment  Add comment
POST   /api/v1/forum/post/:id/upvote   Upvote post
POST   /api/v1/forum/post/:id/downvote Downvote post
POST   /api/v1/forum/post/:id/flag     Flag content
```

### Lost & Found
```
POST   /api/v1/student/lost-found      Report item
GET    /api/v1/student/lost-found      Search items
GET    /api/v1/student/lost-found/:id  Item details
PUT    /api/v1/student/lost-found/:id  Update report
DELETE /api/v1/student/lost-found/:id  Delete report
POST   /api/v1/student/lost-found/:id/claim Claim item
```

### Marketplace
```
POST   /api/v1/student/marketplace     List item
GET    /api/v1/student/marketplace     Browse items
GET    /api/v1/student/marketplace/:id Item details
PUT    /api/v1/student/marketplace/:id Update listing
DELETE /api/v1/student/marketplace/:id Remove listing
POST   /api/v1/student/marketplace/:id/purchase Mark sold
```

### Campus Locations
```
GET    /api/v1/campus/locations        Get all locations
GET    /api/v1/campus/locations/:id    Location details
POST   /api/v1/campus/locations        Create location (admin)
PUT    /api/v1/campus/locations/:id    Update location
DELETE /api/v1/campus/locations/:id    Delete location
```

### Emergency SOS
```
POST   /api/v1/campus/emergency        Report emergency
GET    /api/v1/campus/emergency        Get all SOS alerts
GET    /api/v1/campus/emergency/:id    SOS details
POST   /api/v1/campus/emergency/:id/respond Respond
PUT    /api/v1/campus/emergency/:id    Update status
```

### Clubs
```
POST   /api/v1/campus/clubs            Create club
GET    /api/v1/campus/clubs            Get all clubs
GET    /api/v1/campus/clubs/:id        Club details
PUT    /api/v1/campus/clubs/:id        Update club
DELETE /api/v1/campus/clubs/:id        Delete club
POST   /api/v1/campus/clubs/:id/join   Join club
```

### Announcements
```
POST   /api/v1/campus/announcements    Create announcement (admin)
GET    /api/v1/campus/announcements    Get all announcements
GET    /api/v1/campus/announcements/:id Announcement details
PUT    /api/v1/campus/announcements/:id Update announcement
DELETE /api/v1/campus/announcements/:id Delete announcement
```

---

## 📊 Database Collections Schema

### Users
```javascript
// Student
{
  name: String,
  email: String (unique),
  enrollmentNo: String,
  password: String (hashed),
  myclass: ObjectId (ref: Class),
  domain: ObjectId (ref: AuthorityDomain),
  role: String,
  createdAt: Date,
  updatedAt: Date
}

// Faculty
{
  name: String,
  email: String (unique),
  password: String (hashed),
  department: String,
  designation: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}

// Authority
{
  name: String,
  email: String (unique),
  password: String (hashed),
  domain: ObjectId (ref: AuthorityDomain),
  role: String,
  createdAt: Date,
  updatedAt: Date
}

// Admin
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,
  permissions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Features
```javascript
// Problem
{
  title: String,
  description: String,
  image: String (Cloudinary URL),
  department: String,
  domain: ObjectId,
  authority: ObjectId,
  acceptedBy: ObjectId,
  status: enum["new", "progress", "resolved"],
  priority: enum["high", "medium", "low"],
  student: ObjectId,
  comments: [{
    text: String,
    by: ObjectId,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Event
{
  title: String,
  description: String,
  image: String,
  type: enum["internship", "workshop", "hackathon", ...],
  organizerType: enum["faculty", "club"],
  faculty: ObjectId,
  club: ObjectId,
  startDate: Date,
  endDate: Date,
  location: String,
  maxParticipants: Number,
  registeredStudents: [ObjectId],
  status: enum["upcoming", "ongoing", "completed", "cancelled"],
  createdAt: Date,
  updatedAt: Date
}

// ForumPost
{
  title: String,
  content: String,
  category: enum["Academics", "Campus Life", "Events", "Tech Support", "General"],
  author: ObjectId,
  upvotes: [ObjectId],
  downvotes: [ObjectId],
  comments: [ForumComment],
  flagged: Boolean,
  flagReasons: [String],
  createdAt: Date,
  updatedAt: Date
}

// ForumComment
{
  author: ObjectId,
  content: String,
  upvotes: [ObjectId],
  downvotes: [ObjectId],
  flagged: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// LostFound
{
  title: String,
  description: String,
  category: enum["lost", "found", "forgot"],
  itemType: String,
  image: String,
  location: String,
  dateReported: Date,
  student: ObjectId,
  contact: {phone: String, email: String},
  status: enum["open", "claimed", "resolved"],
  claimedBy: ObjectId,
  claimDate: Date,
  createdAt: Date,
  updatedAt: Date
}

// Marketplace
{
  title: String,
  description: String,
  category: String,
  price: Number,
  image: String,
  condition: enum["like-new", "good", "fair", "needs-repair"],
  seller: ObjectId,
  buyer: ObjectId,
  status: enum["available", "sold", "removed"],
  contact: {phone: String, email: String},
  saleDate: Date,
  createdAt: Date,
  updatedAt: Date
}

// EmergencySOS
{
  student: ObjectId,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  emergencyType: String,
  description: String,
  status: enum["reported", "responded", "resolved", "cancelled"],
  responders: [{
    respondedAt: Date,
    responderContact: String
  }],
  reportedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// CampusAnnouncement
{
  title: String,
  content: String,
  category: enum["Academic", "Events", "Administrative", "Emergency"],
  priority: enum["Low", "Medium", "High"],
  author: ObjectId,
  expirationDate: Date,
  notifyViaEmail: Boolean,
  notifyViaPush: Boolean,
  targetAudience: enum["All", "Students", "Faculty", "Authority"],
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}

// Club
{
  name: String,
  description: String,
  image: String,
  faculty: ObjectId,
  members: [ObjectId],
  events: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}

// CampusLocation
{
  name: String,
  category: String,
  coordinates: {latitude: Number, longitude: Number},
  address: String,
  department: String,
  contactInfo: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow Code

### Backend - Generating JWT
```typescript
const generateAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
    }, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    })
}
```

### Backend - Password Hashing
```typescript
studentSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

const isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}
```

### Backend - Auth Middleware
```typescript
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        
        if (!token) {
            throw new Error("Unauthorized")
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({status: 401, message: "Unauthorized"})
    }
}
```

### Frontend - Login & Store Token
```javascript
const handleLogin = async (email, password) => {
    try {
        const response = await axios.post('/api/v1/student/login', {
            email,
            password
        })
        
        const { accessToken, role, userData } = response.data
        
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('role', role)
        localStorage.setItem('userData', JSON.stringify(userData))
        
        // Redirect to dashboard
        navigate(`/${role}/dashboard`)
    } catch (error) {
        showError(error.response.data.message)
    }
}
```

### Frontend - Request Interceptor
```javascript
// In API config
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor for 401
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.clear()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)
```

---

## 🖥️ Frontend Routing Configuration

### Protected Route Component
```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('accessToken')
    const userRole = localStorage.getItem('role')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to={getDashboardByRole(userRole)} replace />
    }

    return children
}
```

### Route Configuration
```javascript
<Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Protected Routes */}
    <Route path="/student/*" 
        element={
            <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
            </ProtectedRoute>
        } 
    />
    
    <Route path="/faculty/*" 
        element={
            <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
            </ProtectedRoute>
        } 
    />
    
    <Route path="/authority/*" 
        element={
            <ProtectedRoute allowedRoles={['authority']}>
                <AuthorityDashboard />
            </ProtectedRoute>
        } 
    />
    
    <Route path="/admin/*" 
        element={
            <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
            </ProtectedRoute>
        } 
    />
</Routes>
```

---

## 📁 File Upload & Image Processing

### Backend - File Upload
```typescript
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage })

// In route
router.post('/problem', upload.single('image'), controller.createProblem)

// In controller
const createProblem = async (req, res) => {
    const imageUrl = req.file 
        ? await uploadToCloudinary(req.file.buffer)
        : null
    
    const problem = await Problem.create({
        ...req.body,
        image: imageUrl,
        student: req.user._id
    })
    
    res.json({status: 201, data: problem})
}
```

### Backend - Cloudinary Upload
```typescript
const uploadToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {folder: 'krackhack'},
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        )
        upload.end(buffer)
    })
}
```

### Frontend - File Upload
```javascript
const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', title)
    formData.append('description', description)
    
    try {
        const response = await axios.post('/api/v1/problem', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        showSuccess('Problem reported successfully')
    } catch (error) {
        showError(error.response.data.message)
    }
}
```

---

## 📧 Email Notifications

### Nodemailer Configuration
```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})
```

### Sending Email Example
```typescript
const sendProblemNotification = async (student, problem) => {
    const htmlContent = `
        <h2>${problem.title}</h2>
        <p>Your problem has been accepted for review.</p>
        <p>Status: <strong>${problem.status}</strong></p>
        <p>Priority: <strong>${problem.priority}</strong></p>
    `
    
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: student.email,
        subject: 'Problem Report Update',
        html: htmlContent
    })
}
```

---

## 🧪 Common API Request Examples

### Create Problem
```bash
curl -X POST http://localhost:8000/api/v1/problem \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken Door",
    "description": "Main gate door is broken",
    "department": "Infrastructure",
    "domain": "507f1f77bcf86cd799439011"
  }'
```

### Register for Event
```bash
curl -X POST http://localhost:8000/api/v1/event/507f1f77bcf86cd799439011/register \
  -H "Authorization: Bearer <token>"
```

### Create Forum Post
```bash
curl -X POST http://localhost:8000/api/v1/forum/post \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Study Methods",
    "content": "What are the best ways to study effectively?",
    "category": "Academics"
  }'
```

---

## 🔍 Debugging Tips

### Check JWT Token
```javascript
// In browser console
const token = localStorage.getItem('accessToken')
JSON.parse(atob(token.split('.')[1]))  // Decode payload
```

### Check API Response
```javascript
// In frontend code
axios.interceptors.response.use(
    response => {
        console.log('API Response:', response)
        return response
    },
    error => {
        console.log('API Error:', error.response)
        return Promise.reject(error)
    }
)
```

### Check MongoDB Query
```typescript
// Enable logging in mongoose
mongoose.set('debug', true)
```

### Check Cloudinary Upload
```typescript
// Log upload results
cloudinary.uploader.upload_stream(
    {folder: 'krackhack'},
    (error, result) => {
        console.log('Upload Error:', error)
        console.log('Upload Result:', result)
    }
).end(buffer)
```

---

## 📦 Dependencies Overview

### Backend Dependencies
```json
{
  "express": "5.2.1",              // Web framework
  "mongoose": "9.1.5",             // MongoDB ORM
  "jsonwebtoken": "9.0.3",         // JWT tokens
  "bcrypt": "6.0.0",               // Password hashing
  "cloudinary": "1.37.1",          // Image storage
  "nodemailer": "7.0.13",          // Email service
  "multer": "2.0.2",               // File upload
  "cors": "2.8.6",                 // CORS support
  "dotenv": "17.3.1"               // Environment variables
}
```

### Frontend Dependencies
```json
{
  "react": "19.2.0",               // UI framework
  "react-router-dom": "7.13.0",    // Routing
  "axios": "1.13.5",               // HTTP client
  "lucide-react": "0.564.0"        // Icons
}
```

---

## 🚀 Deployment Checklist

### Before Production
- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] Cloudinary account verified
- [ ] Email service tested
- [ ] JWT secret changed (minimum 32 chars)
- [ ] CORS properly configured
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] HTTPS enabled
- [ ] Database indexes created
- [ ] API documentation reviewed
- [ ] Test user accounts created
- [ ] Admin account secured

### Deployment Steps

**Backend:**
```bash
# Build
npm run build

# Deploy to Render/Heroku
git push heroku main

# Verify
curl https://your-backend.onrender.com/api/health
```

**Frontend:**
```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Verify
curl https://your-frontend.vercel.app
```

---

## 💡 Performance Optimization Tips

### Database
- Use indexes on frequently queried fields
- Use projection to fetch only needed fields
- Implement pagination for large lists
- Use aggregation pipeline for complex queries

### Frontend
- Code splitting with React.lazy()
- Image optimization with Cloudinary
- Lazy load components
- Minimize bundle size
- Use production build

### Backend
- Enable compression middleware
- Implement caching headers
- Use connection pooling
- Implement rate limiting
- Monitor performance

---

## 🔗 Quick Links

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **Cloudinary SDK**: https://cloudinary.com/documentation
- **JWT Introduction**: https://jwt.io/introduction
- **Mongoose Guide**: https://mongoosejs.com/

---

**End of Technical Reference Guide**
**Last Updated:** February 15, 2026
