<?php
$conn = new mysqli("localhost", "root","daredevil88", "mnl_exclusive");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>