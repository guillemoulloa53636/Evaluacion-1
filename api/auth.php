<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$action = (string) ($_GET['action'] ?? '');

try {
    if ($action === 'me' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        json_response(['user' => current_user()]);
    }

    if ($action === 'logout' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        $_SESSION = [];
        session_destroy();
        json_response(['ok' => true]);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: GET, POST');
        json_response(['error' => 'Método no permitido.'], 405);
    }

    $data = request_json();
    $pdo = database();

    if ($action === 'register') {
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
            json_response(['error' => 'Ingresa un nombre, correo válido y contraseña de al menos 8 caracteres.'], 422);
        }

        $statement = $pdo->prepare('INSERT INTO users (name, email, password_hash, telephone, region, commune) VALUES (?, ?, ?, ?, ?, ?)');
        $statement->execute([
            $name, $email, password_hash($password, PASSWORD_DEFAULT),
            trim((string) ($data['telephone'] ?? '')), trim((string) ($data['region'] ?? '')),
            trim((string) ($data['commune'] ?? '')),
        ]);
        json_response(['created' => true], 201);
    }

    if ($action === 'login') {
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $statement = $pdo->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
        $statement->execute([$email]);
        $user = $statement->fetch();
        if (!$user || !password_verify((string) ($data['password'] ?? ''), $user['password_hash'])) {
            json_response(['error' => 'El correo o la contraseña no son correctos.'], 401);
        }
        session_regenerate_id(true);
        unset($user['password_hash']);
        $_SESSION['user'] = $user;
        json_response(['user' => $user]);
    }

    json_response(['error' => 'Acción no válida.'], 404);
} catch (PDOException $error) {
    if ($error->getCode() === '23000') {
        json_response(['error' => 'Ya existe una cuenta con ese correo.'], 409);
    }
    report_api_error($error);
} catch (Throwable $error) {
    report_api_error($error);
}