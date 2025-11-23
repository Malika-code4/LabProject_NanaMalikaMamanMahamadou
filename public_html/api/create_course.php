<?php
header('Content-Type: application/json');
require 'db_connect.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'faculty') {
    echo json_encode(['success'=>false, 'message'=>'Not authorized']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$code = trim($data['code'] ?? '');
$title = trim($data['title'] ?? '');
if (!$code || !$title) {
    echo json_encode(['success'=>false, 'message'=>'Provide code and title']);
    exit;
}
$stmt = $mysqli->prepare('INSERT INTO courses (code, title, faculty_id) VALUES (?, ?, ?)');
$faculty_id = $_SESSION['user_id'];
$stmt->bind_param('ssi', $code, $title, $faculty_id);
if ($stmt->execute()) {
    echo json_encode(['success'=>true, 'course_id'=>$stmt->insert_id]);
} else {
    echo json_encode(['success'=>false, 'message'=>'DB error']);
}
?>