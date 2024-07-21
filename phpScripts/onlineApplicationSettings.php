<?php

use PhpOffice\PhpSpreadsheet\Writer\Ods\Content;

include 'config.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Variables from form data
    $admissionYearOptions = $_POST['admissionYearOptions'];
    $pagetxt = $_POST['pagetxt'];
    $lastPaymentDate = $_POST['lastPaymentDate'];
    $applyNow = $_POST['applyNow'];
    $applyNowBtnStart = $_POST['applyNowBtnStart'];
    $applyNowBtnEnd = $_POST['applyNowBtnEnd'];
    $applicantLogin = $_POST['applicantLogin'];
    $loginBtnStart = $_POST['loginBtnStart'];
    $loginBtnEnd = $_POST['loginBtnEnd'];
    $pageLink = $_POST['pageLink'];
    $courses = json_decode($_POST['courses']); // Decode JSON string into PHP object/array

    // Function to handle file upload
    function handleFileUpload($file, $destinationFileName) {
        $uploadDirectory = '../asserts/pdf/';
        if (!file_exists($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true);
        }
        $targetFilePath = $uploadDirectory . $destinationFileName;

        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            return $targetFilePath;
        } else {
            return false;
        }
    }
    // Handle file uploads
    $prospectusPdfPath = '';
    if (isset($_FILES['prospectusPdf'])) {
        $prospectusPdfPath = handleFileUpload($_FILES['prospectusPdf'], "Prospectus.pdf");
        if (!$prospectusPdfPath) {
            echo json_encode(["success" => false, "message" => "Error uploading prospectus file"]);
            exit;
        }
    }

    $instructionPdfPath = '';
    if (isset($_FILES['instructionPdf'])) {
        $instructionPdfPath = handleFileUpload($_FILES['instructionPdf'], "Instruction.pdf");
        if (!$instructionPdfPath) {
            echo json_encode(["success" => false, "message" => "Error uploading instruction file"]);
            exit;
        }
    }

    $homePagePdfPath = '';
    if (isset($_FILES['homePagePdf'])) {
        $homePagePdfPath = handleFileUpload($_FILES['homePagePdf'], "GuideLines.pdf");
        if (!$homePagePdfPath) {
            echo json_encode(["success" => false, "message" => "Error uploading home page file"]);
            exit;
        }
    }

    // Prepare SQL statement for updating the record
    $stmt = $con->prepare("UPDATE application_settings SET admission_year_options = ?, last_payment_date = ?, apply_now = ?, appl_now_btn_start = ?, apply_now_btn_end = ?, applicant_login = ?, login_btn_start = ?, login_btn_end = ?, page_link = ?, prospectus_pdf = ?, instruction_pdf = ?, home_page_pdf = ?, created_at = NOW(), courses = ?,page_txt = ? WHERE id = 1");
// Check if the statement preparation was successful
if ($stmt) {
    // Bind parameters to the prepared statement
    // Assuming `courses` needs to be stored as JSON in the database, encode it back to JSON
    $encodedCourses = json_encode($courses);
    $stmt->bind_param('ssssssssssssss', 
        $admissionYearOptions, $lastPaymentDate, $applyNow, $applyNowBtnStart, $applyNowBtnEnd, 
        $applicantLogin, $loginBtnStart, $loginBtnEnd, $pageLink, $prospectusPdfPath, 
        $instructionPdfPath, $homePagePdfPath, $encodedCourses,$pagetxt);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Settings updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error executing statement: " . $stmt->error]);
    }

    // Close the prepared statement
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error preparing statement: " . $con->error]);
}

// Close the database connection
$con->close();
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {

$sql = "SELECT * FROM application_settings WHERE id = 1";
$result = $con->query($sql);
if ($result && $result->num_rows > 0) {
    $settings = $result->fetch_assoc();
     // Get the apply_now_btn_end date
     $applyNowBtnEnd = $settings['apply_now_btn_end'];
     $loginBtnEnd = $settings['login_btn_end'];
     $currentDate = date('Y-m-d');
     
     // Check if the date has passed
     if ($applyNowBtnEnd < $currentDate) {
         // Update apply_now to Disabled
         $updateSql = "UPDATE application_settings SET apply_now = 'Disabled' WHERE id = 1";
         if ($con->query($updateSql) === TRUE) {
             $settings['apply_now'] = 'Disabled';
         } else {
             echo json_encode(["success" => false, "message" => "Error updating record: " . $con->error]);
             exit();
         }
     }
     if ($loginBtnEnd < $currentDate) {
        // Update apply_now to Disabled
        $updateSql = "UPDATE application_settings SET applicant_login = 'Disabled' WHERE id = 1";
        if ($con->query($updateSql) === TRUE) {
            $settings['applicant_login'] = 'Disabled';
        } else {
            echo json_encode(["success" => false, "message" => "Error updating record: " . $con->error]);
            exit();
        }
    }
    echo json_encode(["success" => true, "message" => "Getted Successfully ", "data" => $settings]);
} else {
    echo json_encode(["success" => false, "message" => "Error preparing statement: "]);
}
} 
else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method: " . $_SERVER['REQUEST_METHOD']]);
}
?>