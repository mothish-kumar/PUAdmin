<?php
include 'config.php';

header('Content-Type: application/json');

$sql = "SELECT departments.name AS department, GROUP_CONCAT(courses.course_name SEPARATOR '|') AS courses FROM courses JOIN departments ON courses.department_id = departments.id GROUP BY departments.name";

$result = $con->query($sql);

$courses = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
}

$response = array(
    "success" => true,
    "data" => $courses
);

echo json_encode($response);

$con->close();

?>