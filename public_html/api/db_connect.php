<?php
// Simple .env parser
$envPath = __DIR__ . '/../..' . '/.env';
$env = [];
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (!str_contains($line, '=')) continue;
        [$k,$v] = explode('=', $line, 2);
        $env[trim($k)] = trim($v);
    }
} else {
    // fallback to example - but you should create a .env
    $env = [
        'DB_HOST' => 'localhost',
        'DB_USER' => 'root',
        'DB_PASS' => '',
        'DB_NAME' => 'attendance_manager'
    ];
}
$mysqli = new mysqli($env['DB_HOST'], $env['DB_USER'], $env['DB_PASS'], $env['DB_NAME']);
if ($mysqli->connect_errno) {
    header('Content-Type: application/json');
    echo json_encode(['success'=>false, 'error'=>'DB connect error: '.$mysqli->connect_error]);
    exit;
}
// set charset
$mysqli->set_charset('utf8mb4');
?>