<?php
header('Content-Type: application/json');
require 'db_connect.php';
session_start();
$data = $_POST;
if (empty($data)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) $data = $input;
}
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
if (!$username || !$password) {
    echo json_encode(['success'=>false]);
    exit;
}
$stmt = $mysqli->prepare('SELECT id, username, password, role FROM users WHERE username=? OR email=? LIMIT 1');
$stmt->bind_param('ss', $username, $username);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        // success
        $_SESSION['user_id'] = (int)$row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['role'] = $row['role'];
        echo json_encode(['success'=>true, 'username'=>$row['username'], 'user_id'=>(int)$row['id'], 'role'=>$row['role']]);
        exit;
    }
}
echo json_encode(['success'=>false]);
?>