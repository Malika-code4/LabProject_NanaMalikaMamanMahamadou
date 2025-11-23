<?php
session_start();
if (isset($_SESSION['user_id'])) {
    if ($_SESSION['role'] === 'faculty') {
        header('Location: dashboard_faculty.php');
        exit;
    } else {
        header('Location: dashboard_student.php');
        exit;
    }
} else {
    header('Location: index.html');
    exit;
}
?>