<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Check if POST variables are set
    if (isset($_POST['feeName']) && isset($_POST['feeDescr'])) {
        // Get the data from frontend
        $feeName = $_POST['feeName'];
        $feeDescr = $_POST['feeDescr'];

        // Prepare and Bind the Data
        $stmt = $con->prepare("INSERT INTO feeHead (feeName, feeDescr) VALUES (?, ?)");
        if ($stmt) {
            $stmt->bind_param('ss', $feeName, $feeDescr);

            // Execute the prepared statement
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "New record created successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
            }

            // Close the Prepared Statement
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Error preparing statement: " . $con->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required POST parameters"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Request Method: " . $_SERVER['REQUEST_METHOD']]);
}
?>
