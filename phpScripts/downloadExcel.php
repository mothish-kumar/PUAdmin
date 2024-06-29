<?php
include 'config.php';
include 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Fetch courses
$sql = "SELECT course_name FROM courses";
$result = $con->query($sql);

if ($result->num_rows > 0) {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setCellValue('A1', 'Course');
    $sheet->setCellValue('B1', 'OC');
    $sheet->setCellValue('C1', 'BC');
    $sheet->setCellValue('D1', 'BC(Muslim)');
    $sheet->setCellValue('E1', 'DNC');
    $sheet->setCellValue('F1', 'MBC');
    $sheet->setCellValue('G1', 'SC');
    $sheet->setCellValue('H1', 'SC(A)');
    $sheet->setCellValue('I1', 'ST');

    $row = 2;
    while ($course = $result->fetch_assoc()) {
        $sheet->setCellValue('A' . $row, $course['course_name']);
        $row++;
    }

    $writer = new Xlsx($spreadsheet);
    $filename = 'courses_application_fee.xlsx';

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    
    $writer->save('php://output');
    exit;
} else {
    echo "No courses found.";
}

$con->close();

?>
