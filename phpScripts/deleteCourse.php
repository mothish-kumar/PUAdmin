<?php
include 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   $department = $_POST['department'];
   // Get department ID from department name
   $stmt = $con->prepare("SELECT id FROM departments WHERE name = ?");
   $stmt->bind_param("s", $department);
   $stmt->execute();
   $result = $stmt->get_result();
   $departmentId = $result->fetch_assoc()['id'];
   $stmt->close();

   if ($departmentId) {
      // Update courses
      // First, delete existing courses for this department
      $stmt = $con->prepare("DELETE FROM courses WHERE department_id = ?");
      $stmt->bind_param("i", $departmentId);
      $stmt->execute();
      $stmt->close();
      $response = array("success" => true);
   }
   else{
      $response = array("success" => false, "error" => "Department not found");
   }
}

$con->close();

echo json_encode($response);

?>