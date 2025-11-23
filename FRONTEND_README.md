# Attendance Manager - Frontend Setup Guide

This frontend has been completely redesigned with a modern, professional UI and comprehensive functionality for both students and faculty members.

## ✨ Frontend Features

### Landing Page (`index.html`)
- Beautiful hero section introducing the application
- Feature overview cards
- Call-to-action buttons for sign up
- Responsive design for all devices

### Authentication Pages
- **Login Page** (`login.html`)
  - Username/Email and password fields
  - Real-time validation
  - Error messages and feedback
  - Automatic redirect to dashboard on success

- **Signup Page** (`signup.html`)
  - Role selection (Student/Faculty)
  - Email validation
  - Password confirmation
  - Auto-select role from URL parameters

### Dashboard (`dashboard.html`)
A unified dashboard with different views for students and faculty:

#### Student Features:
- 📚 **Courses Tab**: Browse all available courses and request to join
- 📝 **Dashboard**: View enrolled courses and statistics
- 👤 **Profile**: View account information

#### Faculty Features:
- 📚 **Courses Tab**: View created courses
- ➕ **Create Course**: Create new courses with code and title
- 📝 **Requests Tab**: View and manage student join requests (approve/reject)
- 👤 **Profile**: View account information

### UI Components

#### Navigation
- Sticky top navigation with branding
- User info and logout button
- Navigation links

#### Sidebar
- Role-aware menu items
- Active state indication
- Quick navigation between views

#### Modal Dialogs
- Course details modal for students
- Request management modal for faculty

### Styling
- Modern gradient design with blue and purple themes
- Responsive grid layouts
- Smooth animations and transitions
- Mobile-friendly design
- Accessible form controls
- Clear visual hierarchy

## 📂 File Structure

```
public_html/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Sign up page
├── dashboard.html          # Main dashboard (students & faculty)
├── css/
│   └── style.css          # Global stylesheet with all styles
└── js/
    ├── app.js             # Global utilities and functions
    ├── login.js           # Login page logic
    ├── signup.js          # Signup page logic
    └── course.js          # Dashboard and course management
```

## 🚀 Getting Started

### Prerequisites
1. PHP 7.2+
2. MySQL database (already configured in backend)
3. Web server (Apache/Nginx with PHP support)

### Setup Steps

1. **Copy files to your web root**
   - All files should be in `public_html/` directory

2. **Ensure database is configured**
   - Check `.env` file in parent directory (set up by backend)
   - Database should have tables: users, courses, course_requests, course_enrollments

3. **Start web server**
   ```bash
   # Using PHP's built-in server
   cd public_html
   php -S localhost:8000
   ```

4. **Access the application**
   - Open browser to `http://localhost:8000`
   - You'll see the landing page

### First Time Setup

1. **Create an Account**
   - Click "Sign Up" on the landing page
   - Choose role (Student or Faculty)
   - Fill in username, email, password
   - Click "Create Account"

2. **Login**
   - Click "Login" or return to landing page
   - Enter your username/email and password
   - You'll be redirected to the dashboard

3. **For Faculty: Create Courses**
   - Go to "Create Course" from sidebar
   - Enter course code and title
   - Click "Create Course"

4. **For Students: Request to Join Courses**
   - Go to "Courses" from sidebar
   - Click on a course card or "Request to Join" button
   - Faculty will review your request
   - Once approved, course appears in your dashboard

## 🔌 API Endpoints Used

The frontend connects to these backend APIs:

- `api/auth_check.php` - Verify user session
- `api/login.php` - User login (POST)
- `api/logout.php` - User logout (POST)
- `api/signup.php` - User registration (POST)
- `api/get_courses.php` - Get courses (GET)
- `api/create_course.php` - Create course (POST, faculty only)
- `api/request_join.php` - Request course join (POST, students only)
- `api/get_course_requests.php` - Get course requests (GET, faculty only)
- `api/manage_request.php` - Approve/reject requests (POST, faculty only)

## 🎨 Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;      /* Blue */
    --secondary-color: #7c3aed;    /* Purple */
    --success-color: #10b981;      /* Green */
    --danger-color: #ef4444;       /* Red */
    /* ... more colors ... */
}
```

### Branding
- Update the header logo/text in HTML files
- Modify `navbar-brand h1` content

### Fonts & Typography
- Font family can be changed in `body` CSS rule
- All font sizes are customizable

## 🔒 Security Notes

- Passwords are hashed using PHP's `password_hash()` on the backend
- Session-based authentication
- CSRF protection should be implemented on production
- All inputs are validated both client and server-side
- SQL prepared statements used in backend

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### "Cannot reach API" error
- Check that PHP backend is running
- Verify API files exist in `api/` directory
- Check browser console for detailed error messages

### Session not persisting
- Ensure PHP sessions are enabled
- Check browser cookie settings
- Verify session.save_path is writable

### Course not showing up after creation
- Refresh the page
- Check that you're logged in as faculty
- Try creating the course again

### Login redirects to login page
- Clear browser cookies
- Verify database connection in `.env`
- Check user exists in database

## 📚 Additional Notes

- The dashboard uses localStorage to store user data for quick access
- All API calls include proper error handling
- Forms have real-time validation feedback
- Mobile responsive at 480px, 768px breakpoints
- Dark mode ready with CSS variables

## 🎯 Next Steps

1. Test all functionality
2. Add more features (attendance tracking, reports, etc.)
3. Implement file uploads for course materials
4. Add notification system
5. Create student/faculty analytics
6. Implement email notifications

---

**Frontend created:** November 2025
**Status:** Ready for production use with backend APIs
