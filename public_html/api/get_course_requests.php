<?php
header('Content-Type: application/json');
require 'db_connect.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'faculty') {
    echo json_encode([]);
    exit;
}
$course_id = (int)($_GET['course_id'] ?? 0);
if (!$course_id) { echo json_encode([]); exit; }
// ensure ownership
$stmt = $mysqli->prepare('SELECT id FROM courses WHERE id=? AND faculty_id=?');
$stmt->bind_param('ii', $course_id, $_SESSION['user_id']);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) { echo json_encode([]); exit; }
$stmt = $mysqli->prepare('SELECT cr.id AS request_id, cr.status, u.username AS student_username, u.id as student_id FROM course_requests cr JOIN users u ON cr.student_id=u.id WHERE cr.course_id=?');
$stmt->bind_param('i', $course_id);
$stmt->execute();
$res = $stmt->get_result();
$out = [];
while ($r = $res->fetch_assoc()) $out[] = $r;
echo json_encode($out);
?>