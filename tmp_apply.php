<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3308;dbname=viajes_chile;charset=utf8mb4', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$pdo->exec("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS type ENUM('mensaje','reclamo') NOT NULL DEFAULT 'mensaje'");
$sql = file_get_contents(__DIR__ . '/database/seeds/demo_admin_history.sql');
$sql = preg_replace('/^USE .*$/m', '', $sql);
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
$pdo->exec($sql);
foreach (['sales','tickets','fleet_events','activity_log','contact_messages'] as $t) {
  echo $t, ': ', $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn(), "\n";
}
