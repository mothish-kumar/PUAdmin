<?php
include "config.php";

$ids = $_POST['ids'];

foreach ($ids as $id) {
   $sql = "DELETE FROM reservations WHERE id = ?";
   $stmt = $con->prepare($sql);
   $stmt->bind_param("i", $id);
   $stmt->execute();
}
$con->close();
?>