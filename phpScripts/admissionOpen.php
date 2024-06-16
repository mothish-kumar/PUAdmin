<?php
include('config.php');

// Retrieve form data
$startYear = $_POST['startYear'];
$endYear = $_POST['endYear'];
$admissionMonth = $_POST['admissionMonth'];
$courses = implode(',', $_POST['courses']);
$activeStatus = $_POST['activeStatus']; // Assuming user provides the active status

// Check if the user is setting this row as active
if ($activeStatus === 'Active') {
    // Begin a transaction for consistency
    $con->begin_transaction();

    // First, update all existing rows to set active_status to "Inactive"
    $updateQuery = "UPDATE admissionOpen SET active_status = 'Inactive'";
    $updateStmt = $con->prepare($updateQuery);

    if ($updateStmt->execute()) {
        // Now, insert the new row with the provided active_status
        $insertQuery = "INSERT INTO admissionOpen (start_year, end_year, admission_month, courses, active_status)
                        VALUES (?, ?, ?, ?, ?)";
        $insertStmt = $con->prepare($insertQuery);
        $insertStmt->bind_param("sssss", $startYear, $endYear, $admissionMonth, $courses, $activeStatus);

        if ($insertStmt->execute()) {
            $con->commit();
            $response = array('success' => true);
        } else {
            $con->rollback();
            $response = array('success' => false, 'error' => $insertStmt->error);
        }

        $insertStmt->close();
    } else {
        $con->rollback();
        $response = array('success' => false, 'error' => $updateStmt->error);
    }

    $updateStmt->close();
} else {
    // If the user sets activeStatus to "Inactive", simply insert the row with provided status
    $insertQuery = "INSERT INTO admissionOpen (start_year, end_year, admission_month, courses, active_status)
                    VALUES (?, ?, ?, ?, ?)";
    $insertStmt = $con->prepare($insertQuery);
    $insertStmt->bind_param("sssss", $startYear, $endYear, $admissionMonth, $courses, $activeStatus);

    if ($insertStmt->execute()) {
        $response = array('success' => true);
    } else {
        $response = array('success' => false, 'error' => $insertStmt->error);
    }

    $insertStmt->close();
}

echo json_encode($response);

$con->close();
?>
