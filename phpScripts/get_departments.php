<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, name, code, contact, email FROM departments";
    $result = $con->query($sql);

    if ($result) {
        $departments = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $departments[] = $row;
            }
            echo json_encode(["success" => true, "data" => $departments]);
        } else {
            echo json_encode(["success" => true, "data" => []]); // Empty array if no departments found
        }
        $result->free_result();
    } else {
        echo json_encode(["success" => false, "message" => "Error executing query: " . $con->error]);
    }

    $con->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method"]);
}
?>
