<?php
include "config.php";

// Get data
$addDate = $_POST['addDate'];
$data = isset($_POST['data']) ? json_decode($_POST['data'], true) : [];

if (empty($addDate) || empty($data)) {
    die("Error: Date or data is missing.");
}

// Extracting labels and percentages from the data array
$labels = [
    'OC' => '',
    'BC' => '',
    'BC(Muslim)' => '',
    'DNC' => '',
    'MBC' => '',
    'SC' => '',
    'SC(A)' => '',
    'ST' => ''
];

$percentages = [
    'OC' => '',
    'BC' => '',
    'BC(Muslim)' => '',
    'DNC' => '',
    'MBC' => '',
    'SC' => '',
    'SC(A)' => '',
    'ST' => ''
];

foreach ($data as $item) {
    $labels[$item['community']] = $item['community'];
    $percentages[$item['community']] = $item['percentage'];
}

// Main table Update
$sql = "UPDATE reservationsSettings 
        SET oclabel = ?, ocper = ?, bclabel = ?, bcper = ?, bcmlabel = ?, bcmper = ?, dnclabel = ?, dncper = ?, mbclabel = ?, mbcper = ?, sclabel = ?, scper = ?, scalabel = ?, scaper = ?, stlabel = ?, stper = ? 
        WHERE adddate = ?";
$stmt = $con->prepare($sql);
if (!$stmt) {
    die("Error preparing statement for reservationsSettings: " . $con->error);
}
$stmt->bind_param("sssssssssssssssss", 
    $labels['OC'], $percentages['OC'], 
    $labels['BC'], $percentages['BC'], 
    $labels['BC(Muslim)'], $percentages['BC(Muslim)'], 
    $labels['DNC'], $percentages['DNC'], 
    $labels['MBC'], $percentages['MBC'], 
    $labels['SC'], $percentages['SC'], 
    $labels['SC(A)'], $percentages['SC(A)'], 
    $labels['ST'], $percentages['ST'], 
    $addDate
);
$stmt->execute();
$stmt->close();

// Addition Table Update
$sql = "UPDATE reservationsDetails SET percentage = ? WHERE adddate = ? AND community = ?";
if ($stmt = $con->prepare($sql)) {
    foreach ($data as $item) {
        $community = $item['community'];
        $percentage = $item['percentage'];

        // Bind parameters
        $stmt->bind_param("sss", $percentage, $addDate, $community);

        // Execute the statement
        $stmt->execute();
    }
    $stmt->close();
} else {
    die("Error preparing statement for reservationsDetails: " . $con->error);
}

$con->close();
?>
