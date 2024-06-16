<?php
include('config.php');

// Retrieve form data
$id = $_POST['id'];
$startYear = $_POST['startYear'];
$endYear = $_POST['endYear'];
$admissionMonth = $_POST['admissionMonth'];
$courses = is_array($_POST['courses']) ? implode(',', $_POST['courses']) : $_POST['courses'];
$activeStatus = $_POST['activeStatus'];

// Check the current active status of the row being updated
$queryCheckCurrentStatus = "SELECT active_status FROM admissionOpen WHERE id = ?";
$stmtCheckCurrentStatus = $con->prepare($queryCheckCurrentStatus);
$stmtCheckCurrentStatus->bind_param("i", $id);
$stmtCheckCurrentStatus->execute();
$stmtCheckCurrentStatus->bind_result($currentActiveStatus);
$stmtCheckCurrentStatus->fetch();
$stmtCheckCurrentStatus->close();

// Prepare the SQL statement for updating the record
$queryUpdate = "UPDATE admissionOpen SET start_year = ?, end_year = ?, admission_month = ?, courses = ?, active_status = ? WHERE id = ?";
$stmtUpdate = $con->prepare($queryUpdate);

if ($stmtUpdate === false) {
   $response = array('success' => false, 'error' => 'Prepare failed: ' . htmlspecialchars($con->error));
   echo json_encode($response);
   exit;
}

// Bind parameters
$stmtUpdate->bind_param("sssssi", $startYear, $endYear, $admissionMonth, $courses, $activeStatus, $id);

// Execute the update statement
if ($stmtUpdate->execute()) {
    $response = array('success' => true);
    
    // If active_status is set to 'Active', update all other rows to 'Inactive'
    if ($activeStatus == 'Active') {
        $queryUpdateInactive = "UPDATE admissionOpen SET active_status = 'Inactive' WHERE id != ?";
        $stmtUpdateInactive = $con->prepare($queryUpdateInactive);
        $stmtUpdateInactive->bind_param("i", $id);
        $stmtUpdateInactive->execute();
        $stmtUpdateInactive->close();
    }

    echo json_encode($response);
} else {
    $response = array('success' => false, 'error' => $stmtUpdate->error);
    echo json_encode($response);
}

$stmtUpdate->close();
$con->close();
?>
