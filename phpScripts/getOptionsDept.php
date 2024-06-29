<?php
// Database connection
include "config.php";

$query = "SELECT id,name FROM departments";
$result = $con->query($query);
$dept = array();

if ($result->num_rows > 0) {     
   while ($row = $result->fetch_assoc()) {
      $dept[] = array(
         'id' => $row['id'],
         'name' => $row['name'],
      );
   }
}

$con->close();
echo json_encode($dept);
