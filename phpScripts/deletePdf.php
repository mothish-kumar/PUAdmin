<?php
include 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $field = $_POST['field'];
    
    // Prepare SQL statement to set the PDF path to null or empty
    $stmt = $con->prepare("UPDATE application_settings SET $field = '' WHERE id = 1");

    if ($stmt) {
        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Error executing statement: " . $stmt->error]);
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing statement: " . $con->error]);
    }

    // Close the database connection
    $con->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method: " . $_SERVER['REQUEST_METHOD']]);
}
?>
