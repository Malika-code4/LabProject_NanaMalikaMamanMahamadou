<?php
header('Content-Type: application/json');
require 'db_connect.php';
session_start();
$role = $_SESSION['role'] ?? null;
$user_id = $_SESSION['user_id'] ?? null;
// if faculty, return courses they created
if ($role === 'faculty') {
    $stmt = $mysqli->prepare('SELECT * FROM courses WHERE faculty_id=?');
    $stmt->bind_param('i', $user_id);
} else {
    // return all courses with join status for student
    $stmt = $mysqli->prepare('SELECT c.*, (SELECT status FROM course_requests cr WHERE cr.course_id=c.id AND cr.student_id=? LIMIT 1) AS request_status FROM courses c');
    $stmt->bind_param('i', $user_id);
}
$stmt->execute();
$res = $stmt->get_result();
$out = [];
while ($r = $res->fetch_assoc()) $out[] = $r;
echo json_encode($out);
?>