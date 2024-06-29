<?php
// Database connection
include "config.php";

$query = "SELECT creation_date FROM reservations ORDER BY ABS(DATEDIFF(creation_date, CURDATE())) LIMIT 1";
$result = $con->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['date' => $row['creation_date']]);
} else {
    echo json_encode(['date' => date('Y-m-d')]);
}

$con->close();
?>
