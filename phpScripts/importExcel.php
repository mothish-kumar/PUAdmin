<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'config.php';
include 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file']) && isset($_POST['admissionYear'])) {
    $file = $_FILES['file'];
    $admissionYear = $_POST['admissionYear']; // This will now contain the text, not the value

    if ($file['error'] === UPLOAD_ERR_OK) {
        $filePath = $file['tmp_name'];
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        $data = $sheet->rangeToArray('A2:' . $highestColumn . $highestRow, NULL, TRUE, FALSE);

        foreach ($data as $row) {
            $course = $row[0];
            $OC = $row[1];
            $BC = $row[2];
            $BCMuslim = $row[3];
            $DNC = $row[4];
            $MBC = $row[5];
            $SC = $row[6];
            $SCA = $row[7];
            $ST = $row[8];
            
            $sql = "INSERT INTO application_fees (admission_year, course, OC, BC, BCMuslim, DNC, MBC, SC, SCA, ST)
                    VALUES ('$admissionYear', '$course', '$OC', '$BC', '$BCMuslim', '$DNC', '$MBC', '$SC', '$SCA', '$ST')
                    ON DUPLICATE KEY UPDATE 
                    OC='$OC', BC='$BC', BCMuslim='$BCMuslim', DNC='$DNC', MBC='$MBC', SC='$SC', SCA='$SCA', ST='$ST'";
            $result = $con->query($sql);

            if (!$result) {
                echo "Error inserting data: " . $con->error;
                exit;
            }
        }

        echo "Data imported successfully.";
    } else {
        echo "Error during file upload.";
    }
} else {
    echo "Invalid request."; // This will be shown if POST variables are not set correctly
}

$con->close();
?>
