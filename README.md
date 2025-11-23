# Attendance Manager - Lab Solution (Generated)

## Setup
1. Copy `.env.example` to `.env` and fill in your database credentials.
2. Import `schema.sql` into your MySQL/MariaDB server.
3. Place the `public_html` folder in your server document root (or point your VirtualHost there).
4. Ensure PHP sessions are working and `public_html/uploads` is writable if needed.

## Structure
- public_html/
  - css/, js/, php/, images/
  - index.php, login.php, signup.php, dashboard_student.php, dashboard_faculty.php
  - api/ - server endpoints (signup, login, logout, courses)
- schema.sql - database creation script
