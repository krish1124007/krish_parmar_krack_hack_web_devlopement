# Quick Integration Guide

## ✅ What's Been Implemented

Your Krackhack platform now includes **7 major new features** with complete backend and frontend implementations:

### 1. **Lost & Found Community** 🔍
- Post lost/found items with images
- Browse and search community items
- Claim items with contact information

### 2. **Marketplace** 🛍️
- Buy and sell used items
- Advanced filtering by price, condition, category
- Seller/buyer profiles

### 3. **Discussion Forum** 💬
- Reddit-style threaded discussion forum
- 5 Categories: Academics, Campus Life, Events, Tech Support, General
- Upvote/downvote system
- Comments and moderation

### 4. **Campus Navigation Map** 🗺️
- Interactive campus map with POI markers
- Search for classrooms, labs, offices, facilities
- View location details and facilities list

### 5. **Emergency SOS** 🚨
- One-tap emergency alert button
- Automatic geolocation sharing
- Emergency responder tracking
- Incident logging

### 6. **Club Management** 🎭
- Club profiles and pages
- Join/leave clubs
- Club announcements
- Event management
- Member gallery

### 7. **Campus Announcements** 📣
- University-wide announcements
- Priority levels (low, medium, high, urgent)
- Category filtering
- Search & archive
- Email/Push notification ready

---

## 🔧 Backend Integration Steps

### Step 1: Update App.ts
✅ **Already done!** The routers are registered in `src/app.ts`

### Step 2: Verify Database Connection
```bash
# Make sure MongoDB is running and connected
# Check src/db/index.ts for connection string
```

### Step 3: Register Models
✅ **Already done!** All models are registered in `src/admin/model.register.ts`

### Step 4: Test Backend APIs

```bash
# Example: Create lost item
curl -X POST http://localhost:5000/api/v1/student/lost-found \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Lost Phone", "description": "Blue iPhone", ...}'

# Example: Get all announcements
curl -X GET http://localhost:5000/api/v1/campus/announcements
```

---

## 🎨 Frontend Integration Steps

### Step 1: Import Components

In your relevant page files, import the components:

```jsx
// In your student section
import LostFound from '../components/student/LostFound';
import Marketplace from '../components/student/Marketplace';
import Forum from '../components/forum/Forum';

// In your campus info section
import CampusMap from '../components/campus/CampusMap';
import EmergencySOS from '../components/campus/EmergencySOS';
import Announcements from '../components/campus/Announcements';

// In your clubs section
import Clubs from '../components/clubs/Clubs';
```

### Step 2: Add to Routes

In your Router configuration:

```jsx
<Routes>
  {/* Student Features */}
  <Route path="/student/lost-found" element={<LostFound />} />
  <Route path="/student/marketplace" element={<Marketplace />} />
  <Route path="/forum" element={<Forum />} />
  
  {/* Campus Features */}
  <Route path="/campus/map" element={<CampusMap />} />
  <Route path="/campus/emergency" element={<EmergencySOS />} />
  <Route path="/campus/announcements" element={<Announcements />} />
  
  {/* Community */}
  <Route path="/clubs" element={<Clubs />} />
</Routes>
```

### Step 3: Add Navigation Links

Update your navigation menu:

```jsx
// In your navigation component
<nav>
  {/* Existing links */}
  
  {/* New Links */}
  <Link to="/student/lost-found">Lost & Found</Link>
  <Link to="/student/marketplace">Marketplace</Link>
  <Link to="/forum">Forum</Link>
  <Link to="/campus/map">Campus Map</Link>
  <Link to="/campus/emergency">Emergency</Link>
  <Link to="/campus/announcements">Announcements</Link>
  <Link to="/clubs">Clubs</Link>
</nav>
```

### Step 4: Configure API Base URL

Make sure all components use the correct API endpoint. Update your axios default:

```javascript
// In your main.jsx or App.jsx
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
// or your production URL
```

### Step 5: Add Authentication

Components automatically use JWT from localStorage:

```javascript
// Tokens stored as 'userId' in localStorage
// Add interceptor for automatic auth
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📁 File Locations Quick Reference

### Backend Files Created
- Models: `backend/src/models/{feature}.models.ts`
- Interfaces: `backend/src/interface/{feature}.interface.ts`
- Controllers: `backend/src/controllers/student/*` and `backend/src/controllers/campus/*`
- Routers: `backend/src/routers/student/*` and `backend/src/routers/campus/*`

### Frontend Files Created
- Components: `frontend/aegis/src/components/{section}/{Feature}.jsx`
- Styles: `frontend/aegis/src/components/{section}/{Feature}.css`

---

## 🧪 Testing the Features

### 1. Test Lost & Found
```
1. Go to http://localhost:3000/student/lost-found
2. Click "Post Item"
3. Fill form and submit
4. View item in "Browse Items"
5. Try claiming an item
```

### 2. Test Marketplace
```
1. Go to http://localhost:3000/student/marketplace
2. Click "Sell Item"
3. List an item with price
4. Browse and filter items
5. View seller details
```

### 3. Test Forum
```
1. Go to http://localhost:3000/forum
2. Create a new discussion
3. Browse other posts
4. Upvote/downvote posts
5. Add comments
```

### 4. Test Campus Map
```
1. Go to http://localhost:3000/campus/map
2. View campus locations
3. Click markers for details
4. Search for specific locations
5. Filter by category
```

### 5. Test Emergency SOS
```
1. Go to http://localhost:3000/campus/emergency
2. Select emergency type
3. Add description
4. Share location (if browser supports)
5. Send alert
```

### 6. Test Clubs
```
1. Go to http://localhost:3000/clubs
2. Browse available clubs
3. Click on a club
4. Join the club
5. View announcements
```

### 7. Test Announcements
```
1. Go to http://localhost:3000/campus/announcements
2. Filter by category
3. Filter by priority
4. Search for announcements
5. View details
```

---

## ⚠️ Important Configuration Notes

### Environment Variables
Make sure your `.env` file includes:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5000
```

### CORS Configuration
✅ Already configured in `app.ts`:
```typescript
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));
```

### File Upload
All file uploads use Multer middleware with:
- Max size: 5MB
- Storage: Memory storage
- Update to disk storage as needed

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure frontend URL matches `CORS_ORIGIN` in backend

### Issue: Images Not Uploading
**Solution**: Check multer configuration in `src/middlewares/multer.middleware.ts`

### Issue: API Not Responding
**Solution**: 
- Check MongoDB connection
- Verify routers are imported in `app.ts`
- Check port is 5000 (or configured port)

### Issue: Components Not Rendering
**Solution**:
- Verify import paths
- Check if CSS imports are working
- Verify Axios is configured with correct base URL

---

## 📊 Database Collections Created

Automatically when first used:
- `lostfounds`
- `marketplaces`
- `forumposts`
- `campuslocations`
- `emergencysos`
- `clubs`
- `campusannouncements`

---

## 🚀 Deployment Checklist

- [ ] All backend routes registered in app.ts
- [ ] Frontend components imported and routed
- [ ] Database connection verified
- [ ] Environment variables configured
- [ ] Testing completed for all features
- [ ] Error handling tested
- [ ] Media upload working
- [ ] Authentication working
- [ ] CORS configured correctly
- [ ] Performance tested with sample data

---

## 📞 Next Steps

1. **Run Backend**: `npm start` in backend folder
2. **Run Frontend**: `npm run dev` in frontend folder
3. **Test Each Feature**: Follow the testing guide above
4. **Configure Admin Endpoints**: Add admin middleware for create/edit/delete of locations, announcements
5. **Add Notifications**: Integrate email/SMS for announcements and emergency alerts (optional bonus features)
6. **Deploy**: Deploy to production

---

## 💡 Tips for Customization

### Changing Colors/Styles
Edit CSS files in `frontend/aegis/src/components/{section}/{Feature}.css`

### Adding More Categories
Update enum in model files and component select options

### Custom Validation
Add validation in controller files before database operations

### API Response Format
All responses follow the standard format - modify `returnResponse` in `src/utils/apiResponse.ts` if needed

---

**Ready to go! Happy coding! 🎉**
