<?php
include "config.php";

// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', '/path_to_your_log_file/php-error.log'); // Change this to your actual log file path
error_reporting(E_ALL);
ini_set('display_errors', 0); // Disable error display

// Absolute path to the images directory
$target_dir = $_SERVER['DOCUMENT_ROOT'] . "/PUAdmin/asserts/images/";

if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true); // Create the directory if it does not exist
}

// Function to upload image and return the file path
function uploadImage($file, $target_dir, $newFileName) {
   $target_file = $target_dir . $newFileName;

   if (move_uploaded_file($file["tmp_name"], $target_file)) {
       return "/PUAdmin/asserts/images/" . $newFileName;
   } else {
       error_log("Failed to move uploaded file to $target_file");
       return '';
   }
}

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $headLine1 = $_POST['headerLine1'];
    $headLine2 = $_POST['headerLine2'];
    $headLine3 = $_POST['headerLine3'];
    $logo1 = '';
    $logo2 = '';

    if (isset($_FILES['logoImage1'])) {
        $logo1 = uploadImage($_FILES['logoImage1'], $target_dir,'periyarUniversityLogo1');
        if ($logo1 == '') {
            $response = ['success' => false, 'message' => 'Failed to upload logoImage1'];
            echo json_encode($response);
            exit();
        }
    }

    if (isset($_FILES['logoImage2'])) {
        $logo2 = uploadImage($_FILES['logoImage2'], $target_dir,'periyarLogo2');
        if ($logo2 == '') {
            $response = ['success' => false, 'message' => 'Failed to upload logoImage2'];
            echo json_encode($response);
            exit();
        }
    }

    // Prepare SQL statement
    $sql = "UPDATE header SET 
                headerLine1 = ?, 
                headerLine2 = ?, 
                headerLine3 = ?";

    if ($logo1 != '') {
        $sql .= ", logoImage1 = ?";
    }
    if ($logo2 != '') {
        $sql .= ", logoImage2 = ?";
    }

    $sql .= " WHERE id = 1";

    $stmt = $con->prepare($sql);

    if ($logo1 != '' && $logo2 != '') {
        $stmt->bind_param("sssss", $headLine1, $headLine2, $headLine3, $logo1, $logo2);
    } elseif ($logo1 != '') {
        $stmt->bind_param("ssss", $headLine1, $headLine2, $headLine3, $logo1);
    } elseif ($logo2 != '') {
        $stmt->bind_param("ssss", $headLine1, $headLine2, $headLine3, $logo2);
    } else {
        $stmt->bind_param("sss", $headLine1, $headLine2, $headLine3);
    }

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Record updated successfully'];
    } else {
        $response = ['success' => false, 'message' => 'Error updating record: ' . $stmt->error];
    }

    echo json_encode($response);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM header WHERE id = 1";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response = ['success' => true, 'data' => $row];
    } else {
        $response = ['success' => false, 'message' => 'No data found'];
    }
    echo json_encode($response);
    exit();
}

$response = ['success' => false, 'message' => 'Invalid request method.'];
echo json_encode($response);
$con->close();
?>
