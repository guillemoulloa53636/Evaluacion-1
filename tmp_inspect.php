<?php
require __DIR__ . '/api/bootstrap.php';
$pdo = database();
echo "--- users\n";
foreach ($pdo->query('SELECT id, name, email, role, created_at FROM users ORDER BY id')->fetchAll() as $u) {
    echo implode(' | ', $u) . "\n";
}
echo "--- contact_messages\n";
foreach ($pdo->query('SELECT id, name, created_at FROM contact_messages')->fetchAll() as $m) {
    echo implode(' | ', $m) . "\n";
}
echo "--- products\n";
foreach ($pdo->query('SELECT id, slug, price, discount_percent FROM products')->fetchAll() as $p) {
    echo implode(' | ', $p) . "\n";
}
echo "--- columnas users\n" . implode(', ', $pdo->query('SHOW COLUMNS FROM users')->fetchAll(PDO::FETCH_COLUMN)) . "\n";
echo "--- columnas contact_messages\n" . implode(', ', $pdo->query('SHOW COLUMNS FROM contact_messages')->fetchAll(PDO::FETCH_COLUMN)) . "\n";
echo "--- columnas tickets\n" . implode(', ', $pdo->query('SHOW COLUMNS FROM tickets')->fetchAll(PDO::FETCH_COLUMN)) . "\n";
echo "--- indices tickets\n";
foreach ($pdo->query('SHOW INDEX FROM tickets')->fetchAll() as $i) {
    echo $i['Key_name'] . ' (' . $i['Column_name'] . ') unique=' . (1 - $i['Non_unique']) . "\n";
}
