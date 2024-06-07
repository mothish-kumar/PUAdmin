<?php
include "config.php";

//POST Method Handles
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    // Validate and sanitize input data
    $departmentHead = isset($_POST['departmentHead']) ? htmlspecialchars($_POST['departmentHead']) : '';
    $departmentHeadName = isset($_POST['departmentHeadName']) ? htmlspecialchars($_POST['departmentHeadName']) : '';
    $departmentHeadDesignation = isset($_POST['departmentHeadDesignation']) ? htmlspecialchars($_POST['departmentHeadDesignation']) : '';
    $registrarHeadName = isset($_POST['registrarHeadName']) ? htmlspecialchars($_POST['registrarHeadName']) : '';
    $registrarDesignation = isset($_POST['registrarDesignation']) ? htmlspecialchars($_POST['registrarDesignation']) : '';
    $ViceChancellorHeadName = isset($_POST['ViceChancellorHeadName']) ? htmlspecialchars($_POST['ViceChancellorHeadName']) : '';
    $ViceChancellorDesignation = isset($_POST['ViceChancellorDesignation']) ? htmlspecialchars($_POST['ViceChancellorDesignation']) : '';
    $SigningAuthorityDesignation = isset($_POST['SigningAuthorityDesignation']) ? htmlspecialchars($_POST['SigningAuthorityDesignation']) : '';

    // Prepare and execute the update query using prepared statements
    $stmt = $con->prepare("UPDATE authority SET 
                               departmentHead = ?,
                               departmentHeadName = ?,
                               departmentHeadDesignation = ?,
                               registrarHeadName = ?,
                               registrarDesignation = ?,
                               ViceChancellorHeadName = ?,
                               ViceChancellorDesignation = ?,
                               SigningAuthorityDesignation = ? 
                           WHERE id = 1");

    $stmt->bind_param("ssssssss", $departmentHead, $departmentHeadName, $departmentHeadDesignation, $registrarHeadName, $registrarDesignation, $ViceChancellorHeadName, $ViceChancellorDesignation, $SigningAuthorityDesignation);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Record updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating record: ' . $stmt->error]);
    }

    $stmt->close();
    $con->close();
    exit();
}

//GET Method Handles
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    $sql = "SELECT * FROM authority WHERE id = 1";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $row]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No data found']);
    }

    $con->close();
    exit();
}

//No Methods Found
echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
exit();
?>
