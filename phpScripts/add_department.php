<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Prepare an SQL statement for execution
    $stmt = $con->prepare("INSERT INTO departments (name, code, contact, email) VALUES (?, ?, ?, ?)");

    if ($stmt) {
        // Bind variables to the parameter markers of the prepared statement
        $stmt->bind_param('ssss', $name, $code, $contact, $email);

        // Set the variables to the values submitted by the user
        $name = $_POST['name'];
        $code = $_POST['code'];
        $contact = $_POST['contact'];
        $email = $_POST['email'];

        // Execute the prepared statement
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "New record created successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Error preparing statement: " . $con->error]);
    }

    // Close the database connection
    $con->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Request Method: " . $_SERVER['REQUEST_METHOD']]);
}
?>
