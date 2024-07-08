<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];

    if (!$id) {
        echo json_encode([
            "success" => false,
            "message" => "Missing id"
        ]);
        exit();
    }

    $sql = 'DELETE FROM fees_table WHERE id = ?';
    $stmt = $con->prepare($sql);

    if ($stmt) {
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Fees data deleted successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to execute delete statement"
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
