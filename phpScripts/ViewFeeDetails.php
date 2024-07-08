<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET'){

   $id = $_GET['id']; // get the id data from frontend
   $sql = 'SELECT dynamic_data FROM fees_table WHERE id = ?';
   //prepare and bind the statements
   $stmt = $con->prepare($sql);
   $stmt->bind_param('i', $id);
   //execute
   if ($stmt->execute()) {
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
         $row = $result->fetch_assoc();
         // Decode JSON string to PHP array
         $dynamic_data = json_decode($row['dynamic_data'], true);

         echo json_encode([
            "success" => true,
            "data" => [
               "feeName" => "Fee Name Placeholder",
               "dynamic_data" => $dynamic_data,
               "id" => $id
            ],
         ]);
      } else {
         echo json_encode([
            "success" => false,
            "message" => "No data found for id: $id"
         ]);
      }
   }
   else{
      echo json_encode([
         "success" => false,
         "message" => "Execution Error"
      ]);
   }
}
else{
   echo json_encode([
      "success" => false,
      "message" => "Invalid Request Method"
   ]);
}
?>
