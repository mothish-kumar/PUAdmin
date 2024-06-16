<?php
include('config.php');

// Retrieve POST data
$id = $_POST['id'];

// Prepare SQL query
$query = $con->prepare("DELETE FROM admissionOpen WHERE id = ?");
$query->bind_param("i", $id);

if ($query->execute()) {
    $response = array('success' => true);
    echo json_encode($response);
} else {
    $response = array('success' => false, 'error' => $query->error);
    echo json_encode($response);
}

$query->close();
$con->close();
?>
