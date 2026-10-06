<?php
declare(strict_types=1);

define('DB_HOST', '127.0.0.1;port=3306');
define('DB_NAME', 'viajes_chile');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
function start_api(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        ]);
        session_start();
    }
}

function database(): PDO
{
    static $connection;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $connection = new PDO($dsn, DB_USER, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $connection;
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json(): array
{
    $body = json_decode((string) file_get_contents('php://input'), true);
    return is_array($body) ? $body : [];
}

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function require_admin(): void
{
    if ((current_user()['role'] ?? null) !== 'admin') {
        json_response(['error' => 'Debes iniciar sesión como administrador.'], 403);
    }
}

function report_api_error(Throwable $error): never
{
    error_log($error->getMessage());
    json_response(['error' => 'No se pudo completar la operación. Verifica que Apache, MySQL y la base viajes_chile estén activos.'], 500);
}

start_api();