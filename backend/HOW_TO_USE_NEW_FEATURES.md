# How to Use the 7 New Features - Complete Guide

Now that all features are implemented, here's how to access and use each one:

---

## 🚀 Getting Started

### Step 1: Start Backend Server
```bash
cd backend
npm start
```
The server will run on `http://localhost:5000`

### Step 2: Start Frontend Application
```bash
cd frontend/aegis
npm run dev
```
The app will run on `http://localhost:5173` (or the port shown in terminal)

### Step 3: Login as Student
1. Go to the login page
2. Enter student credentials
3. You'll see the sidebar on the left with all navigation options

---

## 📋 Navigation in Sidebar

When logged in as a **Student**, you'll see two sections in the sidebar:

### Academic Section (Original)
- Dashboard
- My Classes
- Events
- Problems
- Explore Classes
- Grades
- My Profile

### Community Features (NEW) ⭐
*There's a divider line separating them*

- ❤️ **Lost & Found**
- 🛍️ **Marketplace**
- 💬 **Forum**
- 🗺️ **Campus Map**
- 🚨 **Emergency SOS**
- 👥 **Clubs**
- 📣 **Announcements**

---

## 🔍 Feature Guide

### 1️⃣ Lost & Found Community
**Path:** Click "Lost & Found" in sidebar → `/student/lost-found`

**How to Use:**
1. **Browse Items** - See items lost/found by other students
2. **My Items** - View items you posted
3. **Post Item** - Click "Post New Item"
   - Select category: Lost, Found, or Forgot
   - Enter title, description, item type, location
   - Upload image (optional)
   - Add contact details (phone, email)
   - Click Submit

**Features:**
- Filter by category
- View item details
- Claim items if found
- Delete your items

---

### 2️⃣ Marketplace
**Path:** Click "Marketplace" in sidebar → `/student/marketplace`

**How to Use:**
1. **Browse Items** - See available items for sale
2. **My Listings** - Your items for sale
3. **Sell Item** - Click "List New Item"
   - Enter item title, description
   - Set price
   - Choose condition (like-new, good, fair, needs-repair)
   - Upload image
   - Add contact details
   - Click Submit

**Features:**
- Filter by category, condition, price range
- Mark items as sold
- Edit your listings
- View seller details

---

### 3️⃣ Discussion Forum
**Path:** Click "Forum" in sidebar → `/forum`

**How to Use:**
1. **Browse Posts** - See all discussion topics
2. **Create Post** - Click "Create New Discussion"
   - Enter title, content
   - Choose category (Academics, Campus Life, Events, Tech Support, General)
   - Click Submit

3. **Interact:**
   - Click post to see details
   - 👍 Upvote/💩 Downvote posts
   - Add comments
   - Read what others wrote

**Features:**
- Category filtering
- Search discussions
- Upvote/Downvote system
- Comments on posts
- View post metrics

---

### 4️⃣ Campus Navigation Map
**Path:** Click "Campus Map" in sidebar → `/campus/map`

**How to Use:**
1. **View Map** - See all campus locations with markers
2. **Click Markers** - Get location details
3. **Search Locations** - Type location name in search bar
4. **Filter by Category** - 
   - Classroom, Office, Lab, Mess
   - Library, ATM, Medical, Other

5. **View Details:**
   - Location name
   - Building & Floor
   - Description
   - Facilities available
   - Gallery images

**Features:**
- Interactive markers
- Color-coded by category
- Search functionality
- Detailed location info
- Facilities list

---

### 5️⃣ Emergency SOS
**Path:** Click "Emergency" in sidebar → `/campus/emergency`

**How to Use:**
1. **Select Emergency Type** - Choose from dropdown
   - Medical Emergency
   - Security Issue
   - Fire/Safety
   - Accident
   - Other

2. **Fill Details:**
   - Enter description
   - Click "Share My Location" (uses your device's GPS)
   - Add any additional info

3. **Send Alert** - Red button at bottom
   - Your location is shared
   - Alert is sent to response team
   - Track responder status

**Features:**
- Geolocation tracking
- Emergency type selection
- Real-time status updates
- Direct contact info for responders
- Safety tips display

---

### 6️⃣ Club Management
**Path:** Click "Clubs" in sidebar → `/clubs`

**How to Use:**
1. **Browse Clubs** - See all available clubs
2. **Click Club** - View club details
3. **Join Club** - Click "Join Club" button
   - You'll be added to members list
   - Instant access to announcements

4. **Club Info:**
   - Club name & description
   - Member count
   - Event information
   - Announcements
   - Club gallery

5. **Leave Club** - Click "Leave Club" if you want to exit

**Features:**
- Club discovery
- Join/Leave functionality
- View announcements
- Event tracking
- Member profiles

---

### 7️⃣ Campus Announcements
**Path:** Click "Announcements" in sidebar → `/campus/announcements`

**How to Use:**
1. **View Announcements** - See all campus announcements
2. **Filter by Category:**
   - Academic
   - Events
   - Administrative
   - Emergency

3. **Filter by Priority:**
   - Low, Medium, High, Urgent
   - Urgent items show first

4. **Search** - Type keywords to find specific announcements

5. **Click Announcement:**
   - Read full content
   - See published date
   - Check expiration date
   - View attachments (if any)

**Features:**
- Priority-based sorting
- Category filtering
- Search functionality
- Expiration tracking
- Author information

---

## 📱 Using on Mobile

All features are responsive and work on mobile devices:

1. Sidebar collapses into a hamburger menu
2. Touch-friendly buttons
3. Optimized image sizes
4. Enhanced visibility for important alerts

---

## 🔐 Authentication

All features require:
- ✅ Valid student login
- ✅ Active JWT token (stored in localStorage)
- ✅ Valid MongoDB connection

Tokens automatically included in all API calls via Axios interceptor.

---

## ⚙️ API Endpoints Used

Each feature connects to backend APIs:

### Lost & Found
- `GET /api/v1/student/lost-found` - Get all items
- `GET /api/v1/student/lost-found/my-items` - Your items
- `POST /api/v1/student/lost-found` - Create item
- `PUT /api/v1/student/lost-found/:itemId/claim` - Claim item
- `DELETE /api/v1/student/lost-found/:itemId` - Delete item

### Marketplace
- `GET /api/v1/student/marketplace` - Get listings
- `GET /api/v1/student/marketplace/my-listings` - Your listings
- `POST /api/v1/student/marketplace` - Create listing
- `PUT /api/v1/student/marketplace/:itemId/mark-sold` - Mark as sold
- `DELETE /api/v1/student/marketplace/:itemId` - Delete listing

### Forum
- `GET /api/v1/forum` - Get all posts
- `POST /api/v1/forum` - Create post
- `PUT /api/v1/forum/:postId/upvote` - Upvote
- `PUT /api/v1/forum/:postId/downvote` - Downvote
- `POST /api/v1/forum/:postId/comment` - Add comment
- `DELETE /api/v1/forum/:postId` - Delete post

### Campus Map
- `GET /api/v1/campus/locations` - Get all locations
- `GET /api/v1/campus/locations/search?query=...` - Search

### Emergency SOS
- `POST /api/v1/campus/emergency` - Send alert
- `GET /api/v1/campus/emergency/my-alerts` - Your alerts
- `PUT /api/v1/campus/emergency/:alertId/status` - Update status

### Clubs
- `GET /api/v1/campus/clubs` - Get all clubs
- `POST /api/v1/campus/clubs/:clubId/join` - Join club
- `POST /api/v1/campus/clubs/:clubId/leave` - Leave club

### Announcements
- `GET /api/v1/campus/announcements` - Get announcements
- `GET /api/v1/campus/announcements/category/:category` - Filter by category

---

## 🎨 UI Customization

Each feature has its own CSS file:
- `src/components/student/LostFound.css`
- `src/components/student/Marketplace.css`
- `src/components/forum/Forum.css`
- `src/components/campus/CampusMap.css`
- `src/components/campus/EmergencySOS.css`
- `src/components/clubs/Clubs.css`
- `src/components/campus/Announcements.css`

Modify colors, fonts, layout in these files.

---

## 🐛 Troubleshooting

### Features not showing in sidebar?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend server
3. Check if logged in as student (not admin/faculty)
4. Check browser console for errors

### Images not uploading?
1. Check file size (max 5MB)
2. Verify file format (jpg, png, gif, webp)
3. Check internet connection
4. Verify MongoDB is running

### API errors?
1. Ensure backend is running (`npm start` in backend folder)
2. Check MongoDB connection
3. Verify JWT token is valid
4. Check backend logs for errors

### Emergency SOS not getting location?
1. Allow browser to access location
2. Check if device has GPS/location enabled
3. Try clearing browser permissions and retry
4. Use manual address entry as fallback

---

## 💡 Tips & Tricks

1. **Lost & Found:** Always include clear descriptions and recent photos
2. **Marketplace:** Fair pricing attracts more buyers
3. **Forum:** Search before posting - your question might already be answered
4. **Campus Map:** Bookmark important locations
5. **Emergency:** Don't hesitate to use - it's for real emergencies
6. **Clubs:** Join clubs to network and get event notifications
7. **Announcements:** Check regularly for important updates

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Search the forum for similar issues
3. Contact the admin dashboard
4. Report bugs with screenshots

---

**Happy using the new features! 🎉**
