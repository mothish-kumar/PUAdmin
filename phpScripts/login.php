<?php
include "config.php";
session_start();
if($_SERVER['REQUEST_METHOD'] == 'POST'){
   $userid = htmlspecialchars($_POST['userid']);
   $passwd = htmlspecialchars($_POST['passwd']);

   //Query Preperation for avoid sql injection
   $sql = $con->prepare("SELECT passwd FROM login WHERE userId = ?");
   $sql->bind_param("s",$userid);
   $sql->execute();
   $sql->store_result();

   if($sql->num_rows() > 0){
      $sql->bind_result($dbs_passwd);
      $sql->fetch();

      if($passwd == $dbs_passwd){
         $_SESSION['userId'] = $userId;
         echo json_encode(['success' => true]);
      }
      else{
         echo json_encode(['success' => false, 'message' => 'Mistyping Password.']);
      }
   }
   else {
      echo json_encode(['success' => false, 'message' => 'Mistyping User Id']);
  }
  $sql->close();
  $con->close();

}
else{
   echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}


?>