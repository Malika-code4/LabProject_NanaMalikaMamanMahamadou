<?php
header('Content-Type: application/json');
require 'db_connect.php';
// Accept both form-encoded and JSON
$data = $_POST;
if (empty($data)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) $data = $input;
}
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = ($data['role'] ?? 'student') === 'faculty' ? 'faculty' : 'student';
if (!$username || !$email || !$password) {
    echo json_encode(['success'=>false, 'message'=>'Please provide username, email and password.']);
    exit;
}
// basic server-side validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success'=>false, 'message'=>'Invalid email.']);
    exit;
}
// check existing user
$stmt = $mysqli->prepare('SELECT id FROM users WHERE username=? OR email=? LIMIT 1');
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success'=>false, 'message'=>'Username or email already exists.']);
    exit;
}
$stmt->close();
// hash password
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $username, $email, $hash, $role);
if ($stmt->execute()) {
    echo json_encode(['success'=>true, 'message'=>'Account created successfully.']);
} else {
    echo json_encode(['success'=>false, 'message'=>'DB insert failed.']);
}
?>