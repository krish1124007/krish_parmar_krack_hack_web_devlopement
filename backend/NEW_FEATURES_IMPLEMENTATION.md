# 🎓 Campus Community Platform - New Features Implementation Guide

## Overview
This document outlines all the new features implemented for the student section of Krackhack. These features enhance community engagement, support peer-to-peer commerce, facilitate information sharing, and improve campus safety.

---

## 📋 Table of Contents
1. [Lost & Found Community](#1-lost--found-community)
2. [Marketplace (Buy & Sell)](#2-marketplace-buy--sell)
3. [The Hall of Echoes - Discussion Forum](#3-the-hall-of-echoes---discussion-forum)
4. [The Pathfinder's Map - Campus Navigation](#4-the-pathfinders-map---campus-navigation)
5. [The Guardian's Flare - Emergency SOS](#5-the-guardians-flare---emergency-sos)
6. [The Guild Halls - Club Management](#6-the-guild-halls---club-management)
7. [The Universal Array - Campus Announcements](#7-the-universal-array---campus-announcements)
8. [API Integration](#api-integration)
9. [Frontend Integration](#frontend-integration)

---

## 1. Lost & Found Community

### Purpose
Help students recover lost items and connect people who found items.

### Database Model
**File**: `src/models/lostFound.models.ts`

```typescript
{
  title: string,              // Item name/description
  description: string,        // Detailed description
  category: "lost" | "found" | "forgot",
  itemType: string,          // Type of item
  location: string,          // Where lost/found
  image?: string,            // Item image URL
  student: ObjectId,         // Posted by
  contact: {
    phone: string,
    email: string
  },
  status: "open" | "claimed" | "resolved",
  claimedBy?: ObjectId,      // Who claimed it
  claimDate?: Date,
  dateReported: Date
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/student/lost-found` | Create lost/found item |
| GET | `/api/v1/student/lost-found` | Get all items (with filters) |
| GET | `/api/v1/student/lost-found/my-items` | Get user's items |
| PUT | `/api/v1/student/lost-found/:itemId/claim` | Claim an item |
| PUT | `/api/v1/student/lost-found/:itemId` | Update item |
| DELETE | `/api/v1/student/lost-found/:itemId` | Delete item |

### Query Parameters
- `category`: Filter by lost/found/forgot
- `status`: Filter by open/claimed/resolved

### Frontend Component
**File**: `src/components/student/LostFound.jsx`

**Features**:
- Post lost/found items with images
- Browse all community items
- Filter by category and status
- Claim items
- Manage your postings
- Contact information displayed

---

## 2. Marketplace (Buy & Sell)

### Purpose
Enable peer-to-peer commerce for students to buy and sell used items.

### Database Model
**File**: `src/models/marketplace.models.ts`

```typescript
{
  title: string,
  description: string,
  category: string,
  price: number,
  image?: string,
  condition: "like-new" | "good" | "fair" | "needs-repair",
  seller: ObjectId,          // Student selling
  buyer?: ObjectId,          // Student who bought
  status: "available" | "sold" | "removed",
  contact: {
    phone: string,
    email: string
  },
  saleDate?: Date
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/student/marketplace` | List new item |
| GET | `/api/v1/student/marketplace` | Get all listings |
| GET | `/api/v1/student/marketplace/my-items` | Get user's listings |
| PUT | `/api/v1/student/marketplace/:itemId/sold` | Mark as sold |
| PUT | `/api/v1/student/marketplace/:itemId` | Update listing |
| DELETE | `/api/v1/student/marketplace/:itemId` | Remove listing |

### Query Parameters
- `category`: Filter by category
- `condition`: Filter by item condition
- `priceMin`, `priceMax`: Price range filter
- `status`: Filter by available/sold

### Frontend Component
**File**: `src/components/student/Marketplace.jsx`

**Features**:
- List items for sale with images
- Advanced search and filtering
- Price range filtering
- Item condition tracking
- Seller contact information
- Transaction history

---

## 3. The Hall of Echoes - Discussion Forum

### Purpose
Reddit-style forum for academic and campus discussions.

### Database Model
**File**: `src/models/forum.models.ts`

```typescript
ForumPost {
  title: string,
  content: string,
  category: "Academics" | "Campus Life" | "Events" | "Tech Support" | "General",
  author: ObjectId,
  upvotes: ObjectId[],
  downvotes: ObjectId[],
  comments: ForumComment[],
  flagged: boolean,
  flagReasons?: string[]
}

ForumComment {
  author: ObjectId,
  content: string,
  upvotes: ObjectId[],
  downvotes: ObjectId[],
  flagged: boolean
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/forum` | Create post |
| GET | `/api/v1/forum` | Get all posts |
| GET | `/api/v1/forum/:postId` | Get single post |
| PUT | `/api/v1/forum/:postId/upvote` | Upvote post |
| PUT | `/api/v1/forum/:postId/downvote` | Downvote post |
| POST | `/api/v1/forum/:postId/comment` | Add comment |
| PUT | `/api/v1/forum/:postId/flag` | Flag for moderation |
| DELETE | `/api/v1/forum/:postId` | Delete post |

### Query Parameters
- `category`: Filter by topic category
- `search`: Search in title and content

### Frontend Component
**File**: `src/components/forum/Forum.jsx`

**Features**:
- Create threaded discussions
- Category-based organization
- Upvote/downvote system
- Nested comments
- Search functionality
- Moderation flagging
- User reputation tracking

---

## 4. The Pathfinder's Map - Campus Navigation

### Purpose
Interactive map showing campus locations, facilities, and points of interest.

### Database Model
**File**: `src/models/campusLocation.models.ts`

```typescript
{
  name: string,
  description: string,
  category: "classroom" | "office" | "lab" | "mess" | "library" | "atm" | "medical" | "other",
  latitude: number,
  longitude: number,
  building?: string,
  floor?: string,
  image?: string,
  facilities?: string[]
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/campus/locations` | Get all locations |
| GET | `/api/v1/campus/locations/:locationId` | Get location details |
| GET | `/api/v1/campus/locations/search` | Search locations |
| POST | `/api/v1/campus/locations` | Create location (admin) |
| PUT | `/api/v1/campus/locations/:locationId` | Update location (admin) |
| DELETE | `/api/v1/campus/locations/:locationId` | Delete location (admin) |

### Query Parameters
- `category`: Filter by location type
- `search`: Search by name/description

### Frontend Component
**File**: `src/components/campus/CampusMap.jsx`

**Features**:
- Interactive campus map with markers
- Category-based location filtering
- Search functionality
- Location details and facilities
- POI categories (classrooms, labs, mess, ATMs, medical center)
- Coordinate-based positioning
- Legend for location types

---

## 5. The Guardian's Flare - Emergency SOS

### Purpose
One-tap emergency alert system with automatic location sharing.

### Database Model
**File**: `src/models/emergencySOS.models.ts`

```typescript
{
  student: ObjectId,
  location?: {
    latitude: number,
    longitude: number,
    address: string
  },
  emergencyType: string,
  description: string,
  status: "reported" | "responded" | "resolved" | "cancelled",
  responders?: {
    respondedAt: Date,
    responderContact: string
  }[],
  reportedAt: Date,
  resolvedAt?: Date
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/campus/emergency` | Send emergency alert |
| GET | `/api/v1/campus/emergency` | Get all alerts (admin) |
| GET | `/api/v1/campus/emergency/my-alerts` | Get user's alerts |
| GET | `/api/v1/campus/emergency/:alertId` | Get alert details |
| PUT | `/api/v1/campus/emergency/:alertId/status` | Update status (responder) |
| PUT | `/api/v1/campus/emergency/:alertId/cancel` | Cancel alert |

### Frontend Component
**File**: `src/components/campus/EmergencySOS.jsx`

**Features**:
- One-tap emergency button
- Automatic geolocation retrieval
- Emergency type selection
- Incident logging
- Response tracking
- Emergency contact display
- Safety tips and guidelines

---

## 6. The Guild Halls - Club Management

### Purpose
Dedicated pages for campus clubs with member management and events.

### Database Model
**File**: `src/models/club.models.ts`

```typescript
{
  name: string,
  description: string,
  logo?: string,
  banner?: string,
  advisor: ObjectId,          // Faculty advisor
  members: ObjectId[],
  leader: ObjectId,           // Club leader (student)
  events: ObjectId[],
  announcements: {
    title: string,
    content: string,
    date: Date
  }[],
  gallery: string[]           // Image URLs
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/campus/clubs` | Create club (admin) |
| GET | `/api/v1/campus/clubs` | Get all clubs |
| GET | `/api/v1/campus/clubs/:clubId` | Get club details |
| POST | `/api/v1/campus/clubs/:clubId/join` | Join club |
| POST | `/api/v1/campus/clubs/:clubId/leave` | Leave club |
| PUT | `/api/v1/campus/clubs/:clubId` | Update club (leader) |
| POST | `/api/v1/campus/clubs/:clubId/announcement` | Add announcement |
| POST | `/api/v1/campus/clubs/:clubId/gallery` | Add to gallery |

### Query Parameters
- `search`: Search by club name/description

### Frontend Component
**File**: `src/components/clubs/Clubs.jsx`

**Features**:
- Browse all campus clubs
- Club profiles with logos and banners
- Member management
- Club announcements
- Event management integration
- Gallery/portfolio section
- Join/leave functionality
- Search and filtering

---

## 7. The Universal Array - Campus Announcements

### Purpose
University-wide notification system for important updates.

### Database Model
**File**: `src/models/campusAnnouncement.models.ts`

```typescript
{
  title: string,
  content: string,
  category: "Academic" | "Events" | "Administrative" | "Emergency",
  author: ObjectId,
  image?: string,
  priority: "low" | "medium" | "high" | "urgent",
  sendEmail: boolean,
  sendPush: boolean,
  publishedAt: Date,
  expiresAt?: Date
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/campus/announcements` | Create announcement (admin) |
| GET | `/api/v1/campus/announcements` | Get all announcements |
| GET | `/api/v1/campus/announcements/:announcementId` | Get announcement |
| GET | `/api/v1/campus/announcements/category/:category` | Filter by category |
| GET | `/api/v1/campus/announcements/search` | Search announcements |
| PUT | `/api/v1/campus/announcements/:announcementId` | Update announcement (creator) |
| DELETE | `/api/v1/campus/announcements/:announcementId` | Delete announcement |

### Query Parameters
- `category`: Filter by category
- `priority`: Filter by priority level
- `search`: Search announcements

### Frontend Component
**File**: `src/components/campus/Announcements.jsx`

**Features**:
- Priority-based display (urgent, high, medium, low)
- Category-based filtering (Academic, Events, Administrative, Emergency)
- Search functionality
- Announcement archive
- Email integration ready
- Push notification ready
- Expiration date tracking

---

## API Integration

### Authentication
All protected endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Base URL
```
http://localhost:5000/api/v1
```

### Error Responses
Standard error format:
```json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "data": null
}
```

### File Upload
For endpoints that accept file uploads:
- Use `multipart/form-data` content type
- Max file size: 5MB
- Supported formats: JPEG, PNG, GIF

---

## Frontend Integration

### Installing Components
All components are React-based and require:
- React 18+
- Axios for API calls
- CSS modules (imported automatically)

### Using Components
```jsx
import LostFound from './components/student/LostFound';
import Marketplace from './components/student/Marketplace';
import Forum from './components/forum/Forum';
import CampusMap from './components/campus/CampusMap';
import EmergencySOS from './components/campus/EmergencySOS';
import Clubs from './components/clubs/Clubs';
import Announcements from './components/campus/Announcements';
```

### Integration in Main Layout
Add to your router or main layout:
```jsx
<Route path="/lost-found" element={<LostFound />} />
<Route path="/marketplace" element={<Marketplace />} />
<Route path="/forum" element={<Forum />} />
<Route path="/campus-map" element={<CampusMap />} />
<Route path="/emergency" element={<EmergencySOS />} />
<Route path="/clubs" element={<Clubs />} />
<Route path="/announcements" element={<Announcements />} />
```

---

## Testing Checklist

### Lost & Found
- [ ] Create lost item
- [ ] Create found item
- [ ] Create forgot item
- [ ] Upload image
- [ ] Filter by category
- [ ] Claim item
- [ ] View my items

### Marketplace
- [ ] List item for sale
- [ ] Filter by price
- [ ] Filter by condition
- [ ] Mark item as sold
- [ ] Update listing
- [ ] Delete listing

### Forum
- [ ] Create new post
- [ ] Upvote/downvote post
- [ ] Add comments
- [ ] Search posts
- [ ] Filter by category
- [ ] Flag inappropriate content

### Campus Map
- [ ] View all locations
- [ ] Search for specific location
- [ ] Filter by category
- [ ] Click marker for details
- [ ] View facilities list

### Emergency SOS
- [ ] Trigger emergency alert
- [ ] Share location
- [ ] Track response status
- [ ] Cancel alert
- [ ] View responder info

### Clubs
- [ ] Browse all clubs
- [ ] View club details
- [ ] Join club
- [ ] Leave club
- [ ] View announcements
- [ ] View gallery

### Announcements
- [ ] View all announcements
- [ ] Filter by category
- [ ] Filter by priority
- [ ] Search announcements
- [ ] View announcement details
- [ ] Check expiration dates

---

## Next Steps

1. **Database Integration**: Ensure MongoDB is configured and collections are created
2. **Environment Variables**: Set up necessary API keys for send emails (if email notifications are enabled)
3. **Testing**: Run through the testing checklist above
4. **Deployment**: Deploy to production environment
5. **Monitoring**: Monitor usage and performance

---

## File Structure Summary

```
backend/
├── src/
│   ├── models/
│   │   ├── lostFound.models.ts
│   │   ├── marketplace.models.ts
│   │   ├── forum.models.ts
│   │   ├── campusLocation.models.ts
│   │   ├── emergencySOS.models.ts
│   │   ├── club.models.ts
│   │   └── campusAnnouncement.models.ts
│   ├── interface/
│   │   ├── lostFound.interface.ts
│   │   ├── marketplace.interface.ts
│   │   ├── forum.interface.ts
│   │   ├── campusLocation.interface.ts
│   │   ├── emergencySOS.interface.ts
│   │   ├── club.interface.ts
│   │   └── campusAnnouncement.interface.ts
│   ├── controllers/
│   │   ├── student/
│   │   │   ├── lostFound.controller.ts
│   │   │   ├── marketplace.controller.ts
│   │   │   └── forum.controller.ts
│   │   └── campus/
│   │       ├── campusLocation.controller.ts
│   │       ├── emergencySOS.controller.ts
│   │       ├── club.controller.ts
│   │       └── announcement.controller.ts
│   ├── routers/
│   │   ├── student/
│   │   │   ├── lostFound.router.ts
│   │   │   ├── marketplace.router.ts
│   │   │   └── forum.router.ts
│   │   └── campus/
│   │       ├── campusLocation.router.ts
│   │       ├── emergencySOS.router.ts
│   │       ├── club.router.ts
│   │       └── announcement.router.ts
│   └── app.ts (updated)

frontend/aegis/src/components/
├── student/
│   ├── LostFound.jsx
│   ├── LostFound.css
│   ├── Marketplace.jsx
│   └── Marketplace.css
├── forum/
│   ├── Forum.jsx
│   └── Forum.css
├── campus/
│   ├── CampusMap.jsx
│   ├── CampusMap.css
│   ├── EmergencySOS.jsx
│   ├── EmergencySOS.css
│   ├── Announcements.jsx
│   └── Announcements.css
└── clubs/
    ├── Clubs.jsx
    └── Clubs.css
```

---

## Support & Documentation

For more information:
- API Documentation: See individual controller files for detailed comments
- Component Documentation: See component JSX files for Props and usage examples
- Model Documentation: See model files for schema definitions

---

**Implementation Date**: February 15, 2026
**Version**: 1.0.0
**Status**: Ready for Testing
