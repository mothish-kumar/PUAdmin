<?php
include('config.php');

$query = "SELECT * FROM admissionOpen";
$result = $con->query($query);

if ($result->num_rows > 0) {
    $admissions = array();
    while ($row = $result->fetch_assoc()) {
        $admissions[] = $row;
    }
    // Return JSON response
    echo json_encode(array('success' => true, 'data' => $admissions));
} else {
    // Return error if no data found
    echo json_encode(array('success' => false, 'error' => 'No admissions found.'));
}
$con->close();
?>
