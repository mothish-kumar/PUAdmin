<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   $department = $_POST['department'];
   $newCourse = $_POST['newCourse'];
   $expandCourse = $_POST['expandCourse'];
   $years = $_POST['years'];
   $semester = $_POST['semester'];
   //Preperation  and Binding
   $stmt = $con->prepare("INSERT INTO courses (department_id, course_name,expand_course,years,semester) VALUES (?, ?,?,?,?)");
   $stmt->bind_param("issss",$department,$newCourse,$expandCourse,$years,$semester);
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