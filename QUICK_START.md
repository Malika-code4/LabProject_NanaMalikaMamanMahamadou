# Quick Start Guide - Attendance Manager Frontend

## 🚀 Get Running in 30 Seconds

### Step 1: Start PHP Server
```bash
cd public_html
php -S localhost:8000
```

### Step 2: Open Browser
```
http://localhost:8000
```

### Step 3: You're In! 
Click "Sign Up" to create account

---

## 📱 Main Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Welcome page, info, CTA buttons |
| Login | `/login.html` | Sign in to existing account |
| Signup | `/signup.html` | Create new account |
| Dashboard | `/dashboard.html` | Main app (courses, requests, profile) |

---

## 👥 User Roles

### Student
- View all courses
- Request to join
- See enrollment status
- View profile

### Faculty
- Create courses
- View student requests
- Approve/Reject requests
- View profile

---

## 🎯 Common Tasks

### Student: Request to Join Course
1. Login → Dashboard
2. Click "Courses" in sidebar
3. Click course card or "Request to Join"
4. Confirm request
5. Status shows "Request Pending"

### Faculty: Create Course
1. Login → Dashboard
2. Click "Create Course" in sidebar
3. Enter course code and title
4. Click "Create Course"
5. Course appears in your courses

### Faculty: Approve Request
1. Login → Dashboard
2. Click "Requests" in sidebar
3. Find the pending request
4. Click "Approve"
5. Student gets enrolled

---

## 🎨 File Quick Reference

```
HTML Pages (Navigate to)
├── index.html          → Landing page
├── login.html          → Login
├── signup.html         → Register
└── dashboard.html      → Main app

JavaScript (Auto-loaded)
├── js/app.js          → Global utilities
├── js/login.js        → Login page
├── js/signup.js       → Signup page
└── js/course.js       → Dashboard

Styling (Auto-loaded)
└── css/style.css      → All styles
```

---

## 🔑 Key Features

✅ Beautiful, modern design
✅ Mobile responsive
✅ Form validation
✅ Real-time feedback
✅ Session management
✅ Role-based UI
✅ Course management
✅ Request approval system
✅ User profiles
✅ Error handling

---

## ⚙️ Configuration

### Backend URL
Change `API_BASE` in `js/app.js` if needed:
```javascript
const API_BASE = './api';
```

### Branding
Edit in HTML files:
- `📋 Attendance Manager` → Your app name
- `<title>` → Page title
- Colors in `css/style.css`

---

## 🐛 Troubleshooting

### "Cannot connect to API"
- ✓ PHP server running? (`php -S localhost:8000`)
- ✓ API files exist in `/api/`?
- ✓ Database configured?

### "Session expired"
- ✓ Clear cookies (Ctrl+Shift+Delete)
- ✓ Login again
- ✓ Check PHP session settings

### Forms not submitting
- ✓ Check browser console (F12)
- ✓ Validate inputs
- ✓ Check API responses

---

## 📊 Database Tables (Backend)

```sql
users           → Stores user accounts
courses         → Stores courses created by faculty
course_requests → Student join requests
course_enrollments → Approved enrollments
```

---

## 🔒 Security

- Passwords hashed with bcrypt
- Session-based authentication
- SQL prepared statements
- Input validation (client + server)
- CSRF ready for implementation

---

## 📝 API Endpoints

```
POST   /api/signup.php
POST   /api/login.php
POST   /api/logout.php
GET    /api/auth_check.php

GET    /api/get_courses.php
POST   /api/create_course.php
POST   /api/request_join.php
GET    /api/get_course_requests.php
POST   /api/manage_request.php
```

---

## 🎓 Test Accounts

### Create Test Accounts:

**Student Account:**
- Username: student1
- Email: student@test.com
- Password: password123
- Role: Student

**Faculty Account:**
- Username: faculty1
- Email: faculty@test.com
- Password: password123
- Role: Faculty

---

## 💾 Local Storage

Frontend stores in browser:
- `current_user` → User data (ID, name, role)
- `auth_token` → Session token

Clear with: `localStorage.clear()`

---

## 🎯 Next Features to Add

1. Attendance tracking
2. Reports generation
3. Email notifications
4. File uploads
5. Search/filter
6. Dark mode
7. User management
8. Analytics dashboard

---

## 📞 Quick Help

**Question** | **Answer**
---|---
How do I reset password? | Backend feature needed (create /api/reset_password.php)
Can I delete courses? | Add delete button to /api/delete_course.php
How do I track attendance? | Create attendance table and UI
Can I upload files? | Create /api/upload_file.php endpoint

---

## ✨ Browser Compatibility

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile Browsers ✅

---

**Status: Ready to Use** ✅
**Version: 1.0.0**
**Last Updated: November 2025**

Start building! 🚀
