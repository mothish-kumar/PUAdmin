<?php
include "config.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM emailSettings WHERE id = 1";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode( ['success' => true, 'data' => $row]);
    } 
    else {
        echo json_encode(['success' => false, 'message' => 'No email settings found']);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $emailId = $_POST['emailId'];
    $mailSignature = $_POST['mailSignature'];

    $sql = "UPDATE emailSettings SET emailId = ?, mailSignature = ? WHERE id = 1";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ss", $emailId, $mailSignature);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Email settings updated successfully']);
    } 
    else {
        echo json_encode(['success' => false, 'message' => 'Error updating email settings: ' . $stmt->error]);
    }

    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
$con->close();
?>
