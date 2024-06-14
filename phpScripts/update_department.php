<?php
include 'config.php';

header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $name = isset($_POST['name']) ? $con->real_escape_string($_POST['name']) : '';
    $code = isset($_POST['code']) ? $con->real_escape_string($_POST['code']) : '';
    $contact = isset($_POST['contact']) ? $con->real_escape_string($_POST['contact']) : '';
    $email = isset($_POST['email']) ? $con->real_escape_string($_POST['email']) : '';

    // Prepare an SQL statement for execution
    $stmt = $con->prepare("UPDATE departments SET name=?, code=?, contact=?, email=? WHERE id=?");

    if ($stmt) {
        // Bind variables to the parameter markers of the prepared statement
        $stmt->bind_param('ssssi', $name, $code, $contact, $email, $id);

        // Execute the prepared statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Record updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating record: " . $stmt->error]);
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
