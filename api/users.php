<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
require_admin();

try {
    // Historial completo de cuentas (compradores y administradores), de la más reciente a la más antigua.
    $rows = database()->query('SELECT id, name, email, telephone, region, commune, role, created_at FROM users ORDER BY created_at DESC, id DESC')->fetchAll();
    json_response($rows);
} catch (Throwable $error) {
    report_api_error($error);
}