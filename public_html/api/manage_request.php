<?php
header('Content-Type: application/json');
require 'db_connect.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'faculty') {
    echo json_encode(['success'=>false, 'message'=>'Not authorized']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$request_id = (int)($data['request_id'] ?? 0);
$action = $data['action'] ?? '';
if (!$request_id || !in_array($action, ['approve','reject'])) { echo json_encode(['success'=>false]); exit; }
// fetch request and course to ensure faculty owns the course
$stmt = $mysqli->prepare('SELECT cr.course_id, cr.student_id, c.faculty_id FROM course_requests cr JOIN courses c ON cr.course_id=c.id WHERE cr.id=? LIMIT 1');
$stmt->bind_param('i', $request_id);
$stmt->execute();
$res = $stmt->get_result();
if (!$row = $res->fetch_assoc()) { echo json_encode(['success'=>false]); exit; }
if ($row['faculty_id'] != $_SESSION['user_id']) { echo json_encode(['success'=>false, 'message'=>'Not owner']); exit; }
if ($action === 'approve') {
    // mark request approved and add to enrollments
    $mysqli->begin_transaction();
    $stmt = $mysqli->prepare('UPDATE course_requests SET status="approved" WHERE id=?');
    $stmt->bind_param('i', $request_id);
    $ok1 = $stmt->execute();
    $stmt = $mysqli->prepare('INSERT IGNORE INTO course_enrollments (course_id, student_id) VALUES (?, ?)');
    $stmt->bind_param('ii', $row['course_id'], $row['student_id']);
    $ok2 = $stmt->execute();
    if ($ok1 && $ok2) { $mysqli->commit(); echo json_encode(['success'=>true]); exit; }
    else { $mysqli->rollback(); echo json_encode(['success'=>false]); exit; }
} else {
    $stmt = $mysqli->prepare('UPDATE course_requests SET status="rejected" WHERE id=?');
    $stmt->bind_param('i', $request_id);
    if ($stmt->execute()) echo json_encode(['success'=>true]); else echo json_encode(['success'=>false]);
}
?>