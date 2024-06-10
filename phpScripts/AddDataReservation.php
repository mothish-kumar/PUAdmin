<?php
include "config.php";

// Validate and sanitize input
if (isset($_POST['community']) && isset($_POST['reservation'])) {
    $community = trim($_POST['community']);
    $reservation = trim($_POST['reservation']);

    // Check if reservation is a valid number
    if (is_numeric($reservation)) {
        // Prepare the SQL statement
        $sql = "INSERT INTO reservations (community, reservation, creation_date) VALUES (?, ?, CURDATE())";
        if ($stmt = $con->prepare($sql)) {
            // Bind parameters
            $stmt->bind_param("sd", $community, $reservation);

            // Execute the statement
            if ($stmt->execute()) {
                echo "New record created successfully";
            } else {
                echo "Error executing query: " . $stmt->error;
            }

            // Close the statement
            $stmt->close();
        } else {
            echo "Error preparing query: " . $con->error;
        }
    } else {
        echo "Invalid reservation value.";
    }
} else {
    echo "Community and Reservation fields are required.";
}

// Close the connection
$con->close();
?>
