<?php
include 'config.php';

// Set response content type to JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $recordsPerPage = isset($_GET['records_per_page']) ? (int)$_GET['records_per_page'] : 10;
    $searchQuery = isset($_GET['search_query']) ? $_GET['search_query'] : '';
    $currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $offset = ($currentPage - 1) * $recordsPerPage;

    // Sanitize the search query
    $searchQuery = '%' . $searchQuery . '%';

    // Prepare the SQL query with pagination and search functionality
    $stmt = $con->prepare("SELECT SQL_CALC_FOUND_ROWS * FROM feeHead WHERE feeName LIKE ? OR feeDescr LIKE ? LIMIT ?, ?");
    $stmt->bind_param('ssii', $searchQuery, $searchQuery, $offset, $recordsPerPage);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Get the total number of records without pagination
        $result = $con->query("SELECT FOUND_ROWS() as total");
        $totalRows = $result->fetch_assoc()['total'];

        // Respond with the data
        echo json_encode([
            "success" => true,
            "data" => $data,
            "count" => count($data),
            "total" => $totalRows
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method"]);
}
?>
