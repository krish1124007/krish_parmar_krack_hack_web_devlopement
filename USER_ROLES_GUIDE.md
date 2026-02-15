# 👥 KrackHack - User Roles & Features Guide

---

## 📊 Role-Based Feature Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          FEATURE ACCESS BY ROLE                                 │
├─────────────────────────────────┬──────┬──────┬──────┬──────────┐
│ Feature                         │ Stud │ Fac  │ Auth │ Admin    │
├─────────────────────────────────┼──────┼──────┼──────┼──────────┤
│ View Dashboard                  │  ✅  │  ✅  │  ✅  │    ✅    │
│ Update Profile                  │  ✅  │  ✅  │  ✅  │    ✅    │
│ Change Password                 │  ✅  │  ✅  │  ✅  │    ✅    │
│                                 │      │      │      │          │
│ Report Problems                 │  ✅  │  ✅  │  ❌  │    ❌    │
│ View Own Problems               │  ✅  │  ✅  │  ❌  │    ✅    │
│ View All Problems               │  ❌  │  ❌  │  ✅  │    ✅    │
│ Accept Problem                  │  ❌  │  ❌  │  ✅  │    ✅    │
│ Update Problem Status           │  ❌  │  ❌  │  ✅  │    ✅    │
│ Add Comment to Problem          │  ✅  │  ✅  │  ✅  │    ✅    │
│ Close/Resolve Problem           │  ❌  │  ❌  │  ✅  │    ✅    │
│ Delete Problem (own)            │  ✅  │  ✅  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ Create Event                    │  ❌  │  ✅  │  ❌  │    ✅    │
│ View Events                     │  ✅  │  ✅  │  ✅  │    ✅    │
│ Register for Event              │  ✅  │  ❌  │  ❌  │    ❌    │
│ Edit Event (own)                │  ❌  │  ✅  │  ❌  │    ✅    │
│ Delete Event (own)              │  ❌  │  ✅  │  ❌  │    ✅    │
│ View Registrations              │  ❌  │  ✅  │  ❌  │    ✅    │
│ Export Attendance               │  ❌  │  ✅  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ Create Forum Post               │  ✅  │  ✅  │  ✅  │    ✅    │
│ Edit Own Post                   │  ✅  │  ✅  │  ✅  │    ✅    │
│ Delete Own Post                 │  ✅  │  ✅  │  ✅  │    ✅    │
│ Reply to Posts                  │  ✅  │  ✅  │  ✅  │    ✅    │
│ Upvote/Downvote                 │  ✅  │  ✅  │  ✅  │    ✅    │
│ Flag Inappropriate Content      │  ✅  │  ✅  │  ✅  │    ✅    │
│ Remove Flagged Content          │  ❌  │  ❌  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ Post Lost Item                  │  ✅  │  ❌  │  ❌  │    ❌    │
│ Post Found Item                 │  ✅  │  ❌  │  ❌  │    ❌    │
│ Search Lost & Found             │  ✅  │  ✅  │  ✅  │    ✅    │
│ Claim Item                      │  ✅  │  ❌  │  ❌  │    ❌    │
│ Edit Listing (own)              │  ✅  │  ❌  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ List Item for Sale              │  ✅  │  ❌  │  ❌  │    ❌    │
│ Browse Marketplace              │  ✅  │  ✅  │  ✅  │    ✅    │
│ Edit Listing (own)              │  ✅  │  ❌  │  ❌  │    ✅    │
│ Mark as Sold                    │  ✅  │  ❌  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ View Campus Locations           │  ✅  │  ✅  │  ✅  │    ✅    │
│ Navigate Map                    │  ✅  │  ✅  │  ✅  │    ✅    │
│ Add Locations (admin)           │  ❌  │  ❌  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ Report Emergency SOS            │  ✅  │  ✅  │  ❌  │    ❌    │
│ View SOS Alerts                 │  ❌  │  ❌  │  ✅  │    ✅    │
│ Respond to SOS                  │  ❌  │  ❌  │  ✅  │    ✅    │
│ Resolve SOS                     │  ❌  │  ❌  │  ✅  │    ✅    │
│                                 │      │      │      │          │
│ View Clubs                      │  ✅  │  ✅  │  ✅  │    ✅    │
│ Create Club                     │  ❌  │  ✅  │  ❌  │    ✅    │
│ Join Club                       │  ✅  │  ❌  │  ❌  │    ❌    │
│ Manage Club (own)               │  ✅  │  ✅  │  ❌  │    ✅    │
│ Edit Club Details               │  ✅  │  ✅  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ View Announcements              │  ✅  │  ✅  │  ✅  │    ✅    │
│ Create Announcement             │  ❌  │  ❌  │  ❌  │    ✅    │
│ Edit Announcement (own)         │  ❌  │  ❌  │  ❌  │    ✅    │
│ Delete Announcement             │  ❌  │  ❌  │  ❌  │    ✅    │
│ Schedule Announcement           │  ❌  │  ❌  │  ❌  │    ✅    │
│ Set Expiration                  │  ❌  │  ❌  │  ❌  │    ✅    │
│ Send Notifications              │  ❌  │  ❌  │  ❌  │    ✅    │
│                                 │      │      │      │          │
│ Manage Users                    │  ❌  │  ❌  │  ❌  │    ✅    │
│ View Analytics                  │  ❌  │  ❌  │  ❌  │    ✅    │
│ Export Reports                  │  ❌  │  ❌  │  ❌  │    ✅    │
│ System Settings                 │  ❌  │  ❌  │  ❌  │    ✅    │
└─────────────────────────────────┴──────┴──────┴──────┴──────────┘

Legend:
✅ = Full Access
🔒 = Read-only
❌ = No Access
```

---

## 👨‍🎓 STUDENT ROLE

### Profile & Account
**Capabilities:**
- View personal profile (name, email, enrollment number, class)
- Update profile information
- Change password
- View login history
- Download personal data (GDPR)

**Dashboard Widgets:**
- Quick stats (problems reported, events registered, forum posts)
- Recent announcements
- Upcoming events
- Active problems status

### Problem Reporting
**How it works:**
1. Click "Report Problem" on dashboard
2. Fill form with:
   - Problem title (max 100 chars)
   - Detailed description
   - Upload photo (auto-upload to Cloudinary)
   - Select category/department
3. Submit for review
4. Track status: New → Progress → Resolved
5. Add comments and provide updates
6. View authority responses

**Example Workflow:**
```
Student Reports Issue
   ↓
System assigns to Authority Domain
   ↓
Authority reviews & accepts
   ↓
Student notified of progress
   ↓
Student can comment & add info
   ↓
Authority resolves
   ↓
Student sees resolution details
```

### Event Management
**Capabilities:**
- View all events (upcoming, ongoing, completed)
- Filter by type (internship, workshop, hackathon, etc.)
- Register for events
- View registered students for own events
- Cancel registration
- Download event materials
- Rate events (post-completion)

**Event Types:**
- Internships (career-focused)
- Workshops (skill-building)
- Hackathons (competition)
- Seminars (educational talks)
- Competitions (athletic/academic)
- Club Events (extracurricular)

### Campus Forum
**Features:**
- Create discussion posts
- Ask questions
- Share knowledge
- Comment on posts
- Upvote/downvote posts and comments
- Search by category or keyword
- Follow interesting threads

**Post Categories:**
- 📚 Academics - Coursework, study materials
- 🏫 Campus Life - Student experiences
- 🎉 Events - Event discussions
- 💻 Tech Support - Technical issues
- 💬 General - Off-topic discussions

### Lost & Found Module
**What students can do:**
1. **Report Lost Item:**
   - Item name and description
   - Upload photo
   - Location where lost
   - Date of loss
   - Contact information
   - Status: Open → Claimed → Resolved

2. **Report Found Item:**
   - Item description
   - Photo
   - Location found
   - Contact info for owner

3. **Search & Claim:**
   - Search by item type or location
   - View lost item details
   - Contact claimer
   - Mark as claimed/returned

### Marketplace
**Selling Items:**
```
Create Listing
├─ Title & description
├─ Price
├─ Condition (like-new, good, fair, needs-repair)
├─ Category (textbooks, electronics, furniture, etc.)
├─ Upload photos (multiple)
└─ Contact info

Item Lifecycle:
├─ Status: Available
├─ Buyer contacts
├─ Negotiate
└─ Status: Sold → Hidden
```

**Buying Items:**
- Browse listings
- Filter by category, price, condition
- View seller rating
- Contact seller via email/phone
- Arrange purchase

### Campus Exploration
**Campus Map Features:**
- Interactive campus map
- Location categories:
  - Classrooms
  - Library
  - Cafeteria
  - Dormitories
  - Health Center
  - Sports Complex
  - Parking
  - Administrative
- Get directions
- View facility information

### Emergency SOS
**Quick Alert System:**
- One-click emergency reporting
- Types: Medical, Security, Infrastructure
- Auto-share location (with permission)
- Immediate responder notification
- Chat with responders
- Status tracking

### Club Participation
- Browse active clubs
- View club info (members, events, goals)
- Join clubs
- Participate in club events
- Access club resources

### Announcements
- View all announcements
- Filter by category (Academic, Events, Administrative, Emergency)
- Sort by priority
- View expiration dates
- Search announcements
- Get notifications

---

## 👨‍🏫 FACULTY ROLE

### Profile & Account
- Update profile
- Change password
- View teaching schedule
- Set office hours

### Event Management (Primary Feature)
**Create Events:**
```
New Event Form:
├─ Title & description
├─ Event type:
│  ├─ Internship (career placement)
│  ├─ Workshop (skill-building)
│  ├─ Seminar (educational talk)
│  ├─ Hackathon (coding-competition)
│  └─ Competition (athletic/academic)
├─ Date & time
├─ Location
├─ Max participants
├─ Upload banner/flyer
└─ Publish
```

**Manage Events:**
- View all created events
- Edit event details
- View registered students
- Export attendance list
- Mark attendance
- Send messages to registered students
- Update event status (upcoming → ongoing → completed)
- Delete upcoming events

**Data & Analytics:**
- Student registration count
- Attendance tracking
- Attendance report (Excel export)
- Participation metrics

### Problem Reporting
- Report problems (like students)
- View own problems
- Modify problems reported by them

### Forum Participation
- Create discussion posts
- Answer student questions
- Moderate comments (in own threads)
- Upvote helpful answers
- Flag inappropriate content

### Club Management (Optional)
- Create and manage clubs
- Post club events
- View club members
- Send announcements to club

### Announcements
- View announcements (read-only)
- Can see priority and category
- Search and filter

### View
- Dashboard with key stats
- Recent activities

---

## 🛡️ AUTHORITY ROLE

### Profile & Account
- Update department information
- Manage domain responsibilities
- View complaint history
- Track response metrics

### Problem Management (Core Feature)
**Incoming Complaints:**
```
Workflow:
├─ View new problems in their domain
├─ Filter by priority/date
├─ Click to view details
├─ Assign to team member (optional)
├─ Mark as "In Progress"
├─ Add comments/updates
├─ Provide timeline for resolution
├─ Mark as "Resolved"
└─ Final notes
```

**Problem Dashboard:**
- New complaints count
- In-progress problems
- Resolved problems
- Average response time
- Problem distribution by type
- Overdue problems (alerts)

**Actions on Problems:**
- Accept/reject complaints
- Update status
- Add technical comments
- Assign to teams
- Set resolution date
- Provide status to student
- Upload evidence/photos

**Problem Statuses:**
- `new` - Just reported
- `progress` - Under investigation
- `resolved` - Fixed/Completed

**Priority Levels:**
- `low` - Non-urgent
- `medium` - Standard
- `high` - Urgent/Safety

### Emergency SOS Management
**Alert Dashboard:**
- View active SOS alerts
- Emergency type & description
- Student location (GPS)
- Quick response options
- Contact student

**Response Workflow:**
```
Emergency Alert Received
├─ Review details
├─ Mark as "Responded"
├─ Chat with student
├─ Dispatch help
├─ Track responders
└─ Mark as "Resolved"
```

**Alert Types:**
- Medical emergency
- Security issue
- Campus danger
- Personal crisis

### Forum Moderation
- View flagged posts/comments
- Remove inappropriate content
- Contact offending user
- Close/archive threads

### Analytics
- Problem resolution metrics
- Response time average
- Problem categories breakdown
- Department performance
- SOS response times

---

## 🔧 ADMIN ROLE

### System-Wide Capabilities

### User Management
**Student Management:**
- Create student accounts
- Edit student information
- View enrollment status
- Assign to classes
- Delete accounts
- Reset passwords
- View login history

**Faculty Management:**
- Create faculty profiles
- Assign departments
- Edit information
- Deactivate accounts
- Reset credentials

**Authority Management:**
- Create authority accounts
- Assign domains/departments
- Edit responsibilities
- View performance metrics
- Deactivate accounts

**Admin Management:**
- Create admin accounts
- Set permission levels
- Edit information
- Audit actions

### Announcement Management (Key Feature)
```
Announcement Workflow:

Create:
├─ Title (required)
├─ Content (rich text)
├─ Category:
│  ├─ Academic (🔵 Blue)
│  ├─ Events (🟢 Green)
│  ├─ Administrative (🔷 Cyan)
│  └─ Emergency (🔴 Red)
├─ Priority:
│  ├─ Low (🟡 Yellow)
│  ├─ Medium (🟠 Orange)
│  └─ High (🔴 Red)
├─ Expiration date
├─ Target audience (All/Students/Faculty/Authority)
├─ Email notification
└─ Push notification

Display Features:
├─ Color-coded cards
├─ Priority badges
├─ Publication date
├─ View count
├─ Expiration countdown
└─ Author info

Edit/Delete:
├─ Modify existing announcements
├─ Update content & metadata
├─ Delete (archive option)
└─ Bulk actions
```

**Announcement Management:**
- Create system-wide announcements
- Edit announcements
- Delete announcements
- Schedule announcements
- Set expiration dates
- Choose target audience
- Enable/disable notifications
- View announcement stats (views, clicks)
- Search announcements
- Archive old announcements

**Notification System:**
- Send email notifications
- Schedule push notifications
- Track notification delivery
- View notification logs

### Dashboard Analytics
**System Overview:**
- Total users (students, faculty, authority)
- Active users today
- New problems this month
- Active events
- Forum activity
- Marketplace activity

**Detailed Analytics:**
- User growth trends
- Problem resolution time
- Event attendance rates
- Forum engagement metrics
- Campus location popularity
- Emergency SOS statistics

### Event Management
- Create events
- Edit/delete any event
- View attendance in all events
- Export attendance reports
- Manage event categories
- Set featured events

### Problem Management
- View all problems (regardless of domain)
- View problem resolution rates
- Generate compliance reports
- Escalate critical problems
- Override status updates
- Delete problems

### Forum Moderation
- Remove any posts/comments
- Ban users from forum
- Archive discussions
- View flagged content
- Generate community reports

### System Settings
- Configure base URL
- Email settings
- Notification preferences
- File upload limits
- Database backups
- API rate limiting
- Security settings

### Reports & Exports
**Available Reports:**
- User activity report
- Problem resolution report
- Event attendance report
- Forum activity report
- Emergency response report
- Announcement distribution
- Revenue report (if enabled)

**Export Formats:**
- CSV (Excel)
- PDF
- JSON

### Database Management
- View database stats
- Backup & restore
- Clean up old data
- Optimize indexes
- View query logs

### Audit & Logging
- Track all user actions
- View deleted items
- Login history
- API access logs
- Changes history
- Compliance reports

---

## 🔑 Key Data & Statistics by Role

### Student Dashboard Metrics
```
┌─────────────────────────────────────┐
│  Personal Statistics                │
├─────────────────────────────────────┤
│ 📊 Problems Reported:    5          │
│ ✅ Problems Resolved:    3          │
│ 🎯 Events Registered:    8          │
│ 📝 Forum Posts:          12         │
│ ❤️ Marketplace Listings: 2          │
│ 🏢 Clubs Joined:         3          │
│ 🚨 SOS Alerts:           1          │
│ 📢 Announcements Viewed: 47         │
└─────────────────────────────────────┘
```

### Faculty Dashboard Metrics
```
┌─────────────────────────────────────┐
│  Teaching Analytics                 │
├─────────────────────────────────────┤
│ 📅 Events Created:       6          │
│ 👥 Total Students Reg:   245        │
│ ✅ Events Completed:     4          │
│ 📊 Avg Attendance:       78%        │
│ 📈 Forum Answers:        34         │
│ 🏆 Club Managed:         2          │
│ 📢 Recent Announce:      5          │
└─────────────────────────────────────┘
```

### Authority Dashboard Metrics
```
┌─────────────────────────────────────┐
│  Problem Management                 │
├─────────────────────────────────────┤
│ 🆕 New Problems:         12         │
│ ⏳ In Progress:           8          │
│ ✅ Resolved:             156        │
│ ⏱️ Avg Response:        2.5 hours   │
│ 🚨 High Priority:        3          │
│ 🆘 SOS Responses:        45         │
│ ⭐ Avg Rating:           4.2/5      │
│ ⏰ Overdue:              0          │
└─────────────────────────────────────┘
```

### Admin Dashboard Metrics
```
┌─────────────────────────────────────┐
│  System Overview                    │
├─────────────────────────────────────┤
│ 👥 Total Users:         2,450       │
│ 👨‍🎓 Students:           1,800       │
│ 👨‍🏫 Faculty:            200         │
│ 🛡️ Authority:           150         │
│ 🔧 Admins:              5           │
│                                     │
│ 🎫 Active Events:        25         │
│ 📝 Total Problems:       782        │
│ 📢 Announcements:        145        │
│ 💬 Forum Posts:          5,230      │
│ 🛒 Marketplace Items:    1,245      │
│                                     │
│ 📊 System Health:        98%        │
│ ⚡ Uptime:              99.9%       │
│ 💾 Storage Used:        45%        │
│ 🔐 Security Level:       High       │
└─────────────────────────────────────┘
```

---

## 🎯 Common User Workflows

### Workflow 1: Report & Resolve a Problem
```
STUDENT              BACKEND             AUTHORITY
│                    │                   │
├─Login──────────────→│                   │
│                    │                   │
├─Fill Problem Form──→│───Validate───────→│
│                    │   Data            │
│                    │   ↓              │
│                    │ Save to DB        │
│                    │ ↓                 │
│                    │ Assign Domain     │
│ ←────Confirm───────│ ↓                 │
│                    │ Notify Authority  │
│                    │                   ├─Receive Alert
│                    │                   │
│                    │                   ├─Review Details
│                    │ ←───Accept Problem─┤
│ ←─Notif: In Prog───│ Update Status     │
│                    │                   │
│                    │                   ├─Investigate
│                    │                   ├─Add Comments
│ ←─Notif: Progress──│ ←───Add Comment───│
│                    │                   │
│ Add Comment─────────→│ Update           │
│                    │ ↓                 │
│                    │ ←───Resolve───────┤
│ ←─Notif: Resolved──│ Mark Complete     │
│                    │                   │
└────────────────────────────────────────┘
```

### Workflow 2: Create & Attend Event
```
FACULTY              BACKEND             STUDENT
│                    │                   │
├─Login──────────────→│                   │
│                    │                   │
├─Create Event───────→│─Validate Data    │
│ (title, date...)    │ ↓                 │
│                    │ Save to DB        │
│                    │ ↓                 │
│                    │ Publish Event     │
│ ←─Confirm────────────│                 │
│                    │ ←───Notify All───┤
│                    │                   ├─See Alert
│                    │                   │
│                    │                   ├─Login
│                    │                   │
│ ←─View Registr──────│ ←─Register·────────┤
│                    │ Add to list       │
│                    │ ↓                 │
│                    │ Confirm Register  │
│                    │                   ├─Get Confirmation
│ Mark Attendance─────→│ Update Status    │
│                    │ ↓                 │
│                    │ Final Report      │
│ ←─Export List───────│ Generate CSV      │
│                    │                   │
└────────────────────────────────────────┘
```

### Workflow 3: Forum Discussion
```
STUDENT1             BACKEND             STUDENT2
│                    │                   │
├─Create Post────────→│─Validate Content│
│ (title, content)    │ ↓                 │
│                    │ Save Post         │
│ ←─Confirm────────────│ ↓               │
│                    │ Notify Users      │
│                    │ ←─Notify─────────┤
│                    │                   ├─See Notification
│                    │                   │
│                    │                   ├─Open Forum
│                    │                   │
│ ←─View Post──────────│ ←──View Post─────┤
│                    │                   │
│ ←─Student2 Replies──│ ←──Post Comment───┤
│                    │ ↓                 │
│                    │ Add Comment       │
│                    │                   │
├─Upvote Post────────→│ Update Votes      │
│                    │ ↓                 │
│                    │ Reorder (top)     │
│ ←─Updated View──────│─────Notify────────→
│                    │                   ├─See New Vote
│                    │                   │
└────────────────────────────────────────┘
```

---

## 🚀 Feature Comparison Table

| Feature Area | Student | Faculty | Authority | Admin |
|---|:---:|:---:|:---:|:---:|
| **Account** | ✅ | ✅ | ✅ | ✅ |
| **Problems** | ✅✅ | ✅✅ | ✅✅✅ | ✅✅✅ |
| **Events** | ✅✅ | ✅✅✅ | ✅ | ✅✅✅ |
| **Forum** | ✅✅ | ✅✅ | ✅ | ✅✅ |
| **Lost & Found** | ✅✅ | ✅ | - | ✅ |
| **Marketplace** | ✅✅ | ✅ | - | ✅ |
| **Campus Map** | ✅ | ✅ | ✅ | ✅✅ |
| **SOS** | ✅ | - | ✅✅ | ✅ |
| **Clubs** | ✅✅ | ✅✅ | - | ✅ |
| **Announcements** | ✅ | ✅ | ✅ | ✅✅✅ |
| **Analytics** | ✅ | ✅✅ | ✅✅ | ✅✅✅ |
| **Admin Panel** | - | - | - | ✅✅✅ |

Legend: 
- ✅ = Basic Access
- ✅✅ = Extended Access  
- ✅✅✅ = Full Admin Access
- \- = No Access

---

**End of User Roles & Features Guide**
