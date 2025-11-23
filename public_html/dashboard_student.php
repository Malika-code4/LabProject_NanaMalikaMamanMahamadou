<?php
// protect page
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role']!=='student') {
    header('Location: login.php');
    exit;
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Student Dashboard</title>
  <script src="js/course.js" defer></script>
</head>
<body>
  <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?> (Student)</h2>
  <button id="logoutBtn">Logout</button>
  <h3>Available Courses</h3>
  <div id="courses"></div>
</body>
</html>