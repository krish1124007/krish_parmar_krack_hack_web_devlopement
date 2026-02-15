# 🔧 URL MIGRATION GUIDE - Complete Fix Needed

## ⚠️ **PROBLEM**: 47 Hardcoded URLs Found!

Your frontend still has **47 hardcoded `localhost:8000` URLs** that need to be replaced with the centralized `API_ENDPOINTS` configuration.

---

## ✅ **ALREADY FIXED** (3 files):
1. ✅ `src/pages/student/Dashboard.jsx` - Updated
2. ✅ `src/pages/student/MyClasses.jsx` - Updated (partially)
3. ✅ `src/utils/eventService.js` - Already using centralized config
4. ✅ `src/pages/Login.jsx` - Already using centralized config

---

## ❌ **STILL NEEDS FIXING** (20+ files):

### **Student Pages** (3 files):
- `src/pages/student/StudentProfile.jsx` (2 URLs)
- `src/pages/student/Problems.jsx` (3 URLs)

### **Faculty Pages** (1 file):
- `src/pages/faculty/FacultyClassDetails.jsx` (8 URLs)

### **Authority Pages** (2 files):
- `src/pages/authority/Problems.jsx` (5 URLs)
- `src/pages/authority/Dashboard.jsx` (2 URLs)

### **Admin Pages** (5 files):
- `src/pages/admin/Problems.jsx` (2 URLs)
- `src/pages/admin/Dashboard.jsx` (4 URLs)
- `src/pages/admin/components/StudentManagement.jsx` (3 URLs)
- `src/pages/admin/components/FacultyManagement.jsx` (2 URLs)
- `src/pages/admin/components/ClassManagement.jsx` (2 URLs)
- `src/pages/admin/components/AuthorityManagement.jsx` (8 URLs)

### **Components** (2 files):
- `src/components/forum/Forum.jsx` (1 hardcoded base URL)
- `src/components/clubs/Clubs.jsx` (1 hardcoded base URL)

---

## 🛠️ **HOW TO FIX**:

### **Method 1: Manual Fix (Recommended for Learning)**

For each file:

1. **Add the import** at the top:
   ```javascript
   import { API_ENDPOINTS } from '../../config/api.config'; // Adjust path as needed
   ```

2. **Replace hardcoded URLs** with `API_ENDPOINTS`:

   **Before:**
   ```javascript
   const res = await apiFetch('http://localhost:8000/api/v1/student/profile');
   ```

   **After:**
   ```javascript
   const res = await apiFetch(API_ENDPOINTS.STUDENT.PROFILE);
   ```

   **For dynamic URLs:**
   ```javascript
   // Before
   `http://localhost:8000/api/v1/student/class/${classId}`
   
   // After
   API_ENDPOINTS.STUDENT.CLASS(classId)
   ```

---

### **Method 2: Use Find & Replace** (Faster)

Use VS Code's Find & Replace (Ctrl+H) across all files:

**Example replacements:**

1. Find: `'http://localhost:8000/api/v1/student/profile'`  
   Replace: `API_ENDPOINTS.STUDENT.PROFILE`

2. Find: `'http://localhost:8000/api/v1/admin/get-faculties'`  
   Replace: `API_ENDPOINTS.ADMIN.GET_FACULTIES`

3. Find: `` `http://localhost:8000/api/v1/faculty/class/${classId}` ``  
   Replace: `API_ENDPOINTS.FACULTY.CLASS(classId)`

**Then add imports to each modified file!**

---

### **Method 3: Run Python Script** (Automatic)

I created a Python script at: `c:\Users\Krish\Desktop\krackhack\fix-urls.py`

**To run:**
```powershell
cd c:\Users\Krish\Desktop\krackhack
python fix-urls.py
```

This will automatically:
- Replace all hardcoded URLs
- Add necessary imports
- Process all JS/JSX files

**⚠️ Warning:** Review the changes after running!

---

## 📋 **COMPLETE REPLACEMENT MAP**:

### Student Endpoints:
```javascript
'http://localhost:8000/api/v1/student/profile' → API_ENDPOINTS.STUDENT.PROFILE
'http://localhost:8000/api/v1/student/explore-classes' → API_ENDPOINTS.STUDENT.EXPLORE_CLASSES
'http://localhost:8000/api/v1/student/enroll-class' → API_ENDPOINTS.STUDENT.ENROLL_CLASS
`http://localhost:8000/api/v1/student/class/${classId}` → API_ENDPOINTS.STUDENT.CLASS(classId)
`http://localhost:8000/api/v1/student/class/${id}/note` → API_ENDPOINTS.STUDENT.CLASS_NOTE(id)
'http://localhost:8000/api/v1/student/get-domains' → API_ENDPOINTS.STUDENT.GET_DOMAINS
```

### Faculty Endpoints:
```javascript
'http://localhost:8000/api/v1/faculty/my-classes' → API_ENDPOINTS.FACULTY.MY_CLASSES
`http://localhost:8000/api/v1/faculty/class/${id}` → API_ENDPOINTS.FACULTY.CLASS(id)
`http://localhost:8000/api/v1/faculty/class/${id}/lecture` → API_ENDPOINTS.FACULTY.LECTURE(id)
`http://localhost:8000/api/v1/faculty/class/${id}/attendance` → API_ENDPOINTS.FACULTY.ATTENDANCE(id)
`http://localhost:8000/api/v1/faculty/class/${id}/grade` → API_ENDPOINTS.FACULTY.GRADE(id)
`http://localhost:8000/api/v1/faculty/class/${id}/note` → API_ENDPOINTS.FACULTY.NOTE(id)
`http://localhost:8000/api/v1/faculty/class/${id}/discussion` → API_ENDPOINTS.FACULTY.DISCUSSION(id)
`http://localhost:8000/api/v1/faculty/discussion/${id}/reply` → API_ENDPOINTS.FACULTY.REPLY(id)
```

### Admin Endpoints:
```javascript
'http://localhost:8000/api/v1/admin/get-faculties' → API_ENDPOINTS.ADMIN.GET_FACULTIES
'http://localhost:8000/api/v1/admin/get-students' → API_ENDPOINTS.ADMIN.GET_STUDENTS
'http://localhost:8000/api/v1/admin/get-authorities' → API_ENDPOINTS.ADMIN.GET_AUTHORITIES
'http://localhost:8000/api/v1/admin/get-classes' → API_ENDPOINTS.ADMIN.GET_CLASSES
'http://localhost:8000/api/v1/admin/create-student' → API_ENDPOINTS.ADMIN.CREATE_STUDENT
'http://localhost:8000/api/v1/admin/bulk-create-students' → API_ENDPOINTS.ADMIN.BULK_CREATE_STUDENTS
`http://localhost:8000/api/v1/admin/delete-student/${id}` → API_ENDPOINTS.ADMIN.DELETE_STUDENT(id)
'http://localhost:8000/api/v1/admin/create-faculty' → API_ENDPOINTS.ADMIN.CREATE_FACULTY
`http://localhost:8000/api/v1/admin/delete-faculty/${id}` → API_ENDPOINTS.ADMIN.DELETE_FACULTY(id)
'http://localhost:8000/api/v1/admin/create-class' → API_ENDPOINTS.ADMIN.CREATE_CLASS
`http://localhost:8000/api/v1/admin/delete-class/${id}` → API_ENDPOINTS.ADMIN.DELETE_CLASS(id)
'http://localhost:8000/api/v1/admin/get-domains' → API_ENDPOINTS.ADMIN.GET_DOMAINS
'http://localhost:8000/api/v1/admin/create-domain' → API_ENDPOINTS.ADMIN.CREATE_DOMAIN
'http://localhost:8000/api/v1/admin/create-authority' → API_ENDPOINTS.ADMIN.CREATE_AUTHORITY
`http://localhost:8000/api/v1/admin/delete-authority/${id}` → API_ENDPOINTS.ADMIN.DELETE_AUTHORITY(id)
```

### Authority Endpoints:
```javascript
'http://localhost:8000/api/v1/authority/complaints' → API_ENDPOINTS.AUTHORITY.COMPLAINTS
'http://localhost:8000/api/v1/authority/colleagues' → API_ENDPOINTS.AUTHORITY.COLLEAGUES
`http://localhost:8000/api/v1/authority/complaints/${id}/accept` → API_ENDPOINTS.AUTHORITY.ACCEPT_COMPLAINT(id)
`http://localhost:8000/api/v1/authority/complaints/${id}/status` → API_ENDPOINTS.AUTHORITY.UPDATE_STATUS(id)
`http://localhost:8000/api/v1/authority/complaints/${id}/transfer` → API_ENDPOINTS.AUTHORITY.TRANSFER_COMPLAINT(id)
'http://localhost:8000/api/v1/authority/stats' → API_ENDPOINTS.AUTHORITY.STATS
```

### Problem Endpoints:
```javascript
'http://localhost:8000/api/v1/problem/all' → API_ENDPOINTS.PROBLEM.ALL
`http://localhost:8000/api/v1/problem/update/${id}` → API_ENDPOINTS.PROBLEM.UPDATE(id)
'http://localhost:8000/api/v1/problem/student/problems' → API_ENDPOINTS.PROBLEM.STUDENT_PROBLEMS
'http://localhost:8000/api/v1/problem/create' → API_ENDPOINTS.PROBLEM.CREATE
```

### Components (Special Cases):
In **Forum.jsx** and **Clubs.jsx**, replace:
```javascript
const API_URL = 'http://localhost:8000';
```
With:
```javascript
import { API_BASE_URL } from '../../config/api.config';
// Then use API_BASE_URL instead of API_URL
```

---

##  **QUICK TEST CHECKLIST:**

After fixing, test these pages:
- [ ] Student Dashboard - Enroll in class
- [ ] Student My Classes - View class details
- [ ] Faculty Dashboard - View classes
- [ ] Admin Dashboard - View students/faculty
- [ ] Admin Announcements - Create announcement
- [ ] Authority Dashboard - View complaints
- [ ] Forum - Create post
- [ ] Clubs - View clubs

---

## 🎯 **WHY THIS MATTERS:**

1. **Production Deployment**: Hardcoded `localhost:8000` won't work in production
2. **Easy URL Changes**: Change backend URL in ONE place (`.env`)
3. **Type Safety**: Centralized endpoints prevent typos
4. **Maintainability**: Easier to track and update API calls

---

## ✅ **NEXT STEPS:**

1. **Choose your method** (Manual, Find & Replace, or Python script)
2. **Fix all files** listed above
3. **Test each page** to ensure it works
4. **Commit changes** to git

**Estimated Time**: 
- Manual: 30-60 minutes
- Find & Replace: 15-20 minutes  
- Python Script: 2 minutes (+ testing)

---

**Last Updated**: 2026-02-15 20:40 IST  
**Status**: 44 URLs remaining to fix  
**Priority**: 🔴 HIGH - Required for production deployment

---

## 📝 **TIP:**

Start with the most commonly used pages:
1. Admin Dashboard ← Start here!
2. Student Pages
3. Faculty Pages
4. Authority Pages
5. Components (Forum, Clubs)

This way you can test as you go!
