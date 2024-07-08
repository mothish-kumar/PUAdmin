<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $department = $_POST['department'];
    $course = $_POST['course'];
    $quota = $_POST['quota'];
    $admissionYear = $_POST['admissionYear'];
    $tableData = json_decode($_POST['tableData'], true);
    $feeDetailsJSON = json_encode($tableData);

    $query = "INSERT INTO fees_table(department, course, quota, admission_year, dynamic_data) VALUES (?, ?, ?, ?, ?)";
    $stmt = $con ->prepare($query);
    $stmt->bind_param("sssss", $department, $course, $quota, $admissionYear, $feeDetailsJSON);

    if ($stmt->execute()) {
      echo json_encode(['success'=>true]);
  } else {
      echo json_encode(['success'=>false, 'message' => $stmt->error]);
  }
} else {
    echo json_encode(['success'=>false, 'message' => 'Invalid request method']);
}
?>
