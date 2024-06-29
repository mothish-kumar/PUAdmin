<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the id from the frontend
    $id = $_POST['id'];

    // Prepare the SQL statement
    $stmt = $con->prepare("DELETE FROM feeHead WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param('i', $id);

        // Execute the prepared statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Record deleted successfully"]);
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
