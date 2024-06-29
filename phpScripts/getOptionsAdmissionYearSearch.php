<?php
include 'config.php';

$sql = "SELECT DISTINCT admission_year FROM application_fees ORDER BY admission_year";
$result = $con->query($sql);

$years = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $years[] = $row['admission_year'];
    }
}

$con->close();
echo json_encode($years);
?>
