<?php
// Database connection
include "config.php";

$query = "SELECT adddate FROM reservationsSettings ORDER BY ABS(DATEDIFF(adddate, CURDATE())) LIMIT 1";
$result = $con->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['date' => $row['adddate']]);
} else {
    echo json_encode(['date' => date('Y-m-d')]);
}

$con->close();
?>
