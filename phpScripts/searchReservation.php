<?php
include "config.php";

$date = $_POST['date'];

$sql = "SELECT * FROM reservations WHERE creation_date = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$data = array();
while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$con->close();


?>