
<?php
// Database connection
include "config.php";

$query = "SELECT id,start_year,end_year FROM admissionOpen";
$result = $con->query($query);
$admissionYears = array();

if ($result->num_rows > 0) {
   while ($row = $result->fetch_assoc()) {
      $admissionYears[] = array(
         'id' => $row['id'],
         'start_year' => $row['start_year'],
         'end_year' => $row['end_year']
      );
   }
}

$con->close();
echo json_encode($admissionYears);
?>