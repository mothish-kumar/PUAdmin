<?php
include "config.php";

// Validate and sanitize input
if (isset($_POST['addDate'])) {
    $OCLabel = $_POST['OCLabel'];
    $BCLabel = $_POST['BCLabel'];
    $BCMLabel = $_POST['BCMLabel'];
    $DNCLabel = $_POST['DNCLabel'];
    $MBCLabel = $_POST['MBCLabel'];
    $SCLabel = $_POST['SCLabel'];
    $SCALabel = $_POST['SCALabel'];
    $STLabel = $_POST['STLabel'];
    $OCPer = $_POST['OCPer'];
    $BCPer = $_POST['BCPer'];
    $BCMPer = $_POST['BCMPer'];
    $DNCPer = $_POST['DNCPer'];
    $MBCPer = $_POST['MBCPer'];
    $SCPer = $_POST['SCPer'];
    $SCAPer = $_POST['SCAPer'];
    $STPer = $_POST['STPer'];
    $addDate = $_POST['addDate'];
    $data = isset($_POST['data']) ? json_decode($_POST['data'], true) : [];

    // Prepare the SQL statement for the main data
    $sql = "INSERT INTO reservationsSettings (oclabel, ocper, bclabel, bcper, bcmlabel, bcmper, dnclabel, dncper, mbclabel, mbcper, sclabel, scper, scalabel, scaper, stlabel, stper, adddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    if ($stmt = $con->prepare($sql)) {
        // Bind parameters
        $stmt->bind_param("sssssssssssssssss", $OCLabel, $OCPer, $BCLabel, $BCPer, $BCMLabel, $BCMPer, $DNCLabel, $DNCPer, $MBCLabel, $MBCPer, $SCLabel, $SCPer, $SCALabel, $SCAPer, $STLabel, $STPer, $addDate);

        // Execute the statement
        if ($stmt->execute()) {
            echo "Main record created successfully";
        } else {
            echo "Error executing main query: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Invalid reservation value.";
    } 

    // Prepare the SQL statement for the data array
    $sql = "INSERT INTO reservationsDetails (community, percentage, adddate) VALUES (?, ?, ?)";
    if ($stmt = $con->prepare($sql)) {
        foreach ($data as $item) {
            $community = $item['community'];
            $percentage = $item['per'];

            // Bind parameters
            $stmt->bind_param("sss", $community, $percentage, $addDate);

            // Execute the statement
            if ($stmt->execute()) {
                echo "Record for $community added successfully.";
            } else {
                echo "Error executing query for $community: " . $stmt->error;
            }
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Error preparing query for data array.";
    }
} else {
    echo "Date is a required field.";
}

// Close the connection
$con->close();
?>
