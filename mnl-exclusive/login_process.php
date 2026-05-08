<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

// Show all errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

// Debug: check if data is coming in
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received from form.']);
    exit;
}

$email    = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit;
}

$stmt = $conn->prepare("SELECT id, fullname, password, role FROM users WHERE email = ?");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No user found with that email.']);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Password is wrong.']);
    exit;
}

$_SESSION['isLoggedIn'] = true;
$_SESSION['userRole']   = $user['role'];
$_SESSION['userName']   = $user['fullname'];

$redirect = $user['role'] === 'admin' ? './AdminDashboard.html' : './HomePage.html';

echo json_encode(['success' => true, 'redirect' => $redirect, 'role' => $user['role']]);
$stmt->close();
$conn->close();
?>