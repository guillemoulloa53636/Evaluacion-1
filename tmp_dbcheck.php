<?php
require __DIR__ . '/api/bootstrap.php';
try {
    $pdo = database();
    echo "Conexion OK\n";
    echo 'Tablas: ' . implode(', ', $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN)) . "\n";
} catch (Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . "\n";
}
