<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
require_admin();

try {
    $rows = database()->query("SELECT id, name, email, telephone, region, commune, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC")->fetchAll();
    json_response($rows);
} catch (Throwable $error) {
    report_api_error($error);
}