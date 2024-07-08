<?php

include 'config.php';

$sql = "SELECT id, feeName FROM feeHead";
$result = $con->query($sql);
$fees = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $fees[] = array(
            'id' => $row['id'],
            'feeName' => $row['feeName']
        );
    }
}

// Return fee names as JSON
header('Content-Type: application/json');
echo json_encode($fees);

$con->close();
?>