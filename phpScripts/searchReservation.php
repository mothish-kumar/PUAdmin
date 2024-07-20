<?php
include "config.php";

$date = $_POST['date'];

// Fetch reservations settings
$sql = "SELECT * FROM reservationsSettings WHERE adddate = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();
$reservationsSettings = $result->fetch_assoc();

// Fetch reservation details
$query = "SELECT * FROM reservationsDetails WHERE adddate = ?";
$statement = $con->prepare($query);
$statement->bind_param("s", $date);
$statement->execute();
$result1 = $statement->get_result();
$reservationDetails = $result1->fetch_all(MYSQLI_ASSOC);

// Prepare the structured data
$data = array();

if ($reservationsSettings) {
    $data[] = array(
        "oclabel" => $reservationsSettings['oclabel'],
        "ocper" => $reservationsSettings['ocper'],
        "bclabel" => $reservationsSettings['bclabel'],
        "bcper" => $reservationsSettings['bcper'],
        "bcmlabel" => $reservationsSettings['bcmlabel'],
        "bcmper" => $reservationsSettings['bcmper'],
        "dnclabel" => $reservationsSettings['dnclabel'],
        "dncper" => $reservationsSettings['dncper'],
        "mbclabel" => $reservationsSettings['mbclabel'],
        "mbcper" => $reservationsSettings['mbcper'],
        "sclabel" => $reservationsSettings['sclabel'],
        "scper" => $reservationsSettings['scper'],
        "scalabel" => $reservationsSettings['scalabel'],
        "scaper" => $reservationsSettings['scaper'],
        "stlabel" => $reservationsSettings['stlabel'],
        "stper" => $reservationsSettings['stper'],
        "id1" => $reservationsSettings['id']
    );
}

foreach ($reservationDetails as $detail) {
    $data[] = array(
        "oclabel" => null,
        "ocper" => null,
        "bclabel" => null,
        "bcper" => null,
        "bcmlabel" => null,
        "bcmper" => null,
        "dnclabel" => null,
        "dncper" => null,
        "mbclabel" => null,
        "mbcper" => null,
        "sclabel" => null,
        "scper" => null,
        "scalabel" => null,
        "scaper" => null,
        "stlabel" => null,
        "stper" => null,
        "community" => $detail['community'],
        "percentage" => $detail['percentage'],
        "id2" => $detail['id']
    );
}

echo json_encode($data);

$con->close();
?>
