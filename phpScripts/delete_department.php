<?php
include 'config.php';

header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize input
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    // Prepare an SQL statement for execution
    $stmt = $con->prepare("DELETE FROM departments WHERE id=?");

    if ($stmt) {
        // Bind the id parameter to the prepared statement
        $stmt->bind_param('i', $id);

        // Execute the prepared statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Record deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error deleting record: " . $stmt->error]);
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing statement: " . $con->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method"]);
}

// Close the database connection
$con->close();
?>
