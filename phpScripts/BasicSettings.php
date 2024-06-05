<?php
include "config.php";

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
else if($_SERVER['REQUEST_METHOD'] == 'GET'){
   $result =$con->query("SELECT * FROM header ");
   if($result->num_rows > 0){
      $data = $result->fetch_assoc();
      $headerLine1 = $data['headerLine1'];
      $headerLine2 = $data['headerLine2'];
      $headerLine3 = $data['headerLine3'];
      $logoImage1 = $data['logoImage1'];
      $logoImage2 =$data['logoImage2']; 
      echo json_encode(['success' => true,'headerLine1' => $headerLine1,'headerLine2' => $headerLine2 ,'headerLine3' => $headerLine3,'logoImage1' => $logoImage1,'logoImage2' => $logoImage2]);
   } 
   else{
      echo json_encode(['success' => true,'message' => 'Not data Found']);
   }


}
else{
   echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
   
}


?>