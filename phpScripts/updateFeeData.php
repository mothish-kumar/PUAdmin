<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $updatedData = json_decode($_POST['updatedData'], true);

    if (!$id || !$updatedData) {
        echo json_encode([
            "success" => false,
            "message" => "Missing id or updated data"
        ]);
        exit();
    }

    $sql = 'UPDATE fees_table SET dynamic_data = ? WHERE id = ?';
    $stmt = $con->prepare($sql);
    $jsonUpdatedData = json_encode($updatedData);

    if ($stmt) {
        $stmt->bind_param('si', $jsonUpdatedData, $id);
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Fees data updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to execute update statement"
            ]);
        }
        $stmt->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to prepare statement"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
}

$con->close();
?>
