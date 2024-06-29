<?php
include 'config.php';

$programme = $_POST['programme'];
$course = $_POST['course'];
$year = $_POST['year'];
$records_per_page = (int)$_POST['records_per_page'];
$search_query = $_POST['search_query'];
$page = (int)$_POST['page'];
$offset = ($page - 1) * $records_per_page;

// Basic query with prepared statements
$sql = "SELECT * FROM applications WHERE 1=1";

$params = [];
$types = '';

if ($programme != "") {
    $sql .= " AND department = ?";
    $params[] = $programme;
    $types .= 's';
}
if ($course != "") {
    $sql .= " AND course LIKE ?";
    $params[] = "%$course%";
    $types .= 's';
}
if ($year != "") {
    $sql .= " AND admission_year = ?";
    $params[] = $year;
    $types .= 's';
}
if ($search_query != "") {
    $sql .= " AND (applicant_name LIKE ? OR application_no LIKE ?)";
    $params[] = "%$search_query%";
    $params[] = "%$search_query%";
    $types .= 'ss';
}

// Pagination
$sql .= " LIMIT ? OFFSET ?";
$params[] = $records_per_page;
$params[] = $offset;
$types .= 'ii';

// Prepare and execute statement
$stmt = $con->prepare($sql);
$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    echo json_encode(['error' => $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}

// Get total count for pagination
$count_result = $con->query("SELECT COUNT(*) as total FROM applications WHERE 1=1");
$total = $count_result->fetch_assoc()['total'];

$response = [
    'applications' => $applications,
    'count' => count($applications),
    'total' => $total
];

echo json_encode($response);

$stmt->close();
$con->close();
?>
