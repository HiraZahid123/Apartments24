<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=apartments24", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $result = $pdo->query("SHOW COLUMNS FROM guest_checkins");
    $cols = $result->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents('final_check.txt', print_r($cols, true));
} catch (Exception $e) {
    file_put_contents('final_check.txt', "ERROR: " . $e->getMessage());
}
