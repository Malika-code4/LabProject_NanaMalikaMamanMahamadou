<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // Not authenticated
    header('Content-Type: application/json');
    echo json_encode(['authenticated'=>false]);
    exit;
}
// return basic session info
header('Content-Type: application/json');
echo json_encode([
    'authenticated'=>true,
    'user_id'=>$_SESSION['user_id'],
    'username'=>$_SESSION['username'],
    'role'=>$_SESSION['role']
]);
?>