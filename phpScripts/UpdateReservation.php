<?php
include "config.php";

$data = $_POST['data'];

foreach ($data as $item) {
   $sql = "UPDATE reservations SET reservation = ? WHERE id = ?";
   $stmt = $con->prepare($sql);
   $stmt->bind_param("si", $item['reservation'], $item['id']);
   $stmt->execute();
}

$con->close();
?>