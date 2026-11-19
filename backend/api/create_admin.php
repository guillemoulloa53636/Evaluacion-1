<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/bootstrap.php';

fwrite(STDOUT, "Correo del administrador: ");
$email = strtolower(trim((string) fgets(STDIN)));
fwrite(STDOUT, "Contraseña (mínimo 8 caracteres): ");
$passwordInput = fgets(STDIN);
$password = $passwordInput === false ? '' : rtrim($passwordInput, "\r\n");

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
    fwrite(STDERR, "Correo o contraseña no válidos.\n");
    exit(1);
}

try {
    $statement = database()->prepare(
        "INSERT INTO users (name, email, password_hash, role) VALUES ('Administrador', ?, ?, 'admin')
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin'"
    );
    $statement->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);
    fwrite(STDOUT, "Administrador creado o actualizado. Inicia sesión desde la página principal.\n");
} catch (PDOException $error) {
    fwrite(STDERR, $error->getCode() === '23000' ? "Ese correo ya está registrado.\n" : "No se pudo crear el administrador: {$error->getMessage()}\n");
    exit(1);
}