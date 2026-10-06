<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    json_response(['error' => 'Método no permitido.'], 405);
}

$data = request_json();
$name = trim((string) ($data['name'] ?? ''));
$email = strtolower(trim((string) ($data['email'] ?? '')));
$message = trim((string) ($data['message'] ?? ''));
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
    json_response(['error' => 'Completa nombre, correo y mensaje válido.'], 422);
}

try {
    $statement = database()->prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)');
    $statement->execute([$name, $email, $message]);
    json_response(['sent' => true], 201);
} catch (Throwable $error) {
    report_api_error($error);
}