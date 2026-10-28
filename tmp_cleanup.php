<?php
require __DIR__ . '/api/bootstrap.php';
$statement = database()->prepare("DELETE FROM users WHERE email = ? AND role = 'customer'");
$statement->execute(['cotee@gmail.com']);
echo 'Filas eliminadas: ' . $statement->rowCount() . "\n";
