<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   $department = $_POST['department'];
   $newCourse = $_POST['newCourse'];
   //Preperation  and Binding
   $stmt = $con->prepare("INSERT INTO courses (department_id, course_name) VALUES (?, ?)");
   $stmt->bind_param("is",$department,$newCourse);
   if ($stmt->execute()) {
      echo "Course added successfully";
  } else {
      echo "Error: " . $stmt->error;
  }

  $stmt->close();
}
else{
   echo "Invalid Request Method";
}

$con->close();

?>