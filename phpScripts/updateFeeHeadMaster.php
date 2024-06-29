<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the data from the frontend
    $id = $_POST['id'];
    $feeName = $_POST['feeName'];  

    // Prepare and bind the data
    $stmt = $con->prepare("UPDATE feeHead SET feeName = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param('si', $feeName, $id);

        // Execute the prepared statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Record updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing statement: " . $con->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method: " . $_SERVER['REQUEST_METHOD']]);
}
?>
