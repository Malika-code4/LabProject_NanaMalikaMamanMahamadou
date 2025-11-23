<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role']!=='faculty') {
    header('Location: login.php');
    exit;
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Faculty Dashboard</title>
  <script src="js/course.js" defer></script>
</head>
<body>
  <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?> (Faculty)</h2>
  <button id="logoutBtn">Logout</button>
  <h3>Create Course</h3>
  <form id="createCourseForm">
    <label>Code: <input type="text" id="code"></label>
    <label>Title: <input type="text" id="title"></label>
    <button type="submit">Create</button>
  </form>
  <h3>Your Courses and Requests</h3>
  <div id="facultyCourses"></div>
</body>
</html>