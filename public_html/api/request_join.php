<?php
header('Content-Type: application/json');
require 'db_connect.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['success'=>false, 'message'=>'Not authorized']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$course_id = (int)($data['course_id'] ?? 0);
if (!$course_id) { echo json_encode(['success'=>false]); exit; }
$student_id = $_SESSION['user_id'];
// check existing request or enrollment
$stmt = $mysqli->prepare('SELECT id FROM course_requests WHERE course_id=? AND student_id=?');
$stmt->bind_param('ii', $course_id, $student_id);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) { echo json_encode(['success'=>false, 'message'=>'Already requested']); exit; }
$stmt = $mysqli->prepare('INSERT INTO course_requests (course_id, student_id) VALUES (?, ?)');
$stmt->bind_param('ii', $course_id, $student_id);
if ($stmt->execute()) echo json_encode(['success'=>true]);
else echo json_encode(['success'=>false]);
?>