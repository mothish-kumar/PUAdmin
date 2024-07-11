<?php
header('Content-Type: application/json');
// Database connection
include "config.php";

$sql = "SELECT id,course_name FROM courses";
$result = $con->query($sql);

$courses = array();
while ($row = $result->fetch_assoc()) {
   $courses[] = $row;
}
echo json_encode($courses);

?>
