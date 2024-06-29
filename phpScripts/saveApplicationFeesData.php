<?php
include 'config.php'; 

// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];

    // Sanitize and validate other fields as needed
    $course = $_POST['course'];
    $OC = $_POST['OC'];
    $BC = $_POST['BC'];
    $BCMuslim = $_POST['BCMuslim'];
    $DNC = $_POST['DNC'];
    $MBC = $_POST['MBC'];
    $SC = $_POST['SC'];
    $SCA = $_POST['SCA'];
    $ST = $_POST['ST'];
    
    // Prepare SQL statement with placeholders
    $sql = "UPDATE application_fees 
            SET course = ?, OC = ?, BC = ?, BCMuslim = ?, DNC = ?,
                MBC = ?, SC = ?, SCA = ?, ST = ?
            WHERE id = ?";

    // Prepare the statement
    $stmt = $con->prepare($sql);

    // Bind parameters
    $stmt->bind_param("sssssssssi", $course, $OC, $BC, $BCMuslim, $DNC, $MBC, $SC, $SCA, $ST, $id);

    // Execute the query
    if ($stmt->execute()) {
        $response = array('success' => true, 'message' => 'Data updated successfully.');
        echo json_encode($response);
    } else {
        $response = array('success' => false, 'message' => 'Error updating data: ' . $stmt->error);
        echo json_encode($response);
    }

    // Close statement
    $stmt->close();
} else {
    $response = array('success' => false, 'message' => 'Invalid request.');
    echo json_encode($response);
}

// Close database connection
$con->close();
?>
