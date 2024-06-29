<?php
// Database connection
include "config.php";
$department_id = $_GET['department_id'];
$query = "SELECT id,course_name FROM courses  WHERE department_id = ?";
$stmt = $con->prepare($query);
$stmt->bind_param("i", $department_id);
$stmt->execute();
$result = $stmt->get_result();
$dept = array();

while ($row = $result->fetch_assoc()) {
   $courses[] = $row;
}
echo json_encode($courses);

?>
