<?php
include 'config.php';

// Check if admissionYear is set and not empty
if (isset($_GET['admissionYear']) && !empty($_GET['admissionYear'])) {
    $admissionYear = $_GET['admissionYear'];

    // Perform your SQL query to fetch data based on admissionYear
    // Example query: Adjust according to your actual database schema
    $sql = "SELECT * FROM application_fees WHERE admission_year = '$admissionYear'";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        $feesAllocation = [];
        while ($row = $result->fetch_assoc()) {
            // Example: Adjust column names based on your actual table structure
            $feesAllocation[] = [
               'id' => $row['id'],
                'course' => $row['course'],
                'OC' => $row['OC'],
                'BC' => $row['BC'],
                'BCMuslim' => $row['BCMuslim'],
                'DNC' => $row['DNC'],
                'MBC' => $row['MBC'],
                'SC' => $row['SC'],
                'SCA' => $row['SCA'],
                'ST' => $row['ST']
                // Add more fields as needed
            ];
        }

        // Return JSON response
        echo json_encode(['success' => true, 'data' => $feesAllocation]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No data found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}

$con->close();
?>
