<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'PUT') {
    header('Allow: PUT');
    json_response(['error' => 'Método no permitido.'], 405);
}

$data = request_json();
$ticketCode = strtolower(trim((string) ($data['ticket_code'] ?? '')));
$saleCode = strtolower(trim((string) ($data['sale_code'] ?? '')));
$reason = mb_substr(trim((string) ($data['reason'] ?? '')), 0, 300);
if ($ticketCode === '' && $saleCode === '') {
    json_response(['error' => 'Indica el boleto o la compra a cancelar.'], 422);
}

try {
    $pdo = database();
    $pdo->beginTransaction();

    if ($ticketCode !== '') {
        $lookup = $pdo->prepare('SELECT t.sale_id, t.trip_title, t.passenger_name, t.seat_number, s.sale_code FROM tickets t JOIN sales s ON s.id = t.sale_id WHERE t.ticket_code = ?');
        $lookup->execute([$ticketCode]);
        $info = $lookup->fetch();
        if (!$info) {
            $pdo->rollBack();
            json_response(['error' => 'Boleto no encontrado.'], 404);
        }
        $saleId = (int) $info['sale_id'];
        $update = $pdo->prepare("UPDATE tickets SET status = 'cancelado', cancelled_at = NOW(), cancel_reason = ? WHERE ticket_code = ? AND status = 'activo'");
        $update->execute([$reason ?: null, $ticketCode]);
        $description = "Boleto cancelado: {$info['passenger_name']}, asiento {$info['seat_number']}, {$info['trip_title']} (compra " . substr($info['sale_code'], 0, 8) . ')';
    } else {
        $lookup = $pdo->prepare('SELECT id FROM sales WHERE sale_code = ?');
        $lookup->execute([$saleCode]);
        $saleId = (int) $lookup->fetchColumn();
        if ($saleId < 1) {
            $pdo->rollBack();
            json_response(['error' => 'Compra no encontrada.'], 404);
        }
        $update = $pdo->prepare("UPDATE tickets SET status = 'cancelado', cancelled_at = NOW(), cancel_reason = ? WHERE sale_id = ? AND status = 'activo'");
        $update->execute([$reason ?: null, $saleId]);
        $description = 'Compra cancelada completa (' . substr($saleCode, 0, 8) . ')';
    }

    if ($update->rowCount() === 0) {
        $pdo->rollBack();
        json_response(['error' => 'Ese boleto o compra ya estaba cancelado.'], 409);
    }

    $counts = $pdo->prepare("SELECT SUM(status = 'activo') AS active_count, SUM(status = 'cancelado') AS cancelled_count FROM tickets WHERE sale_id = ?");
    $counts->execute([$saleId]);
    $row = $counts->fetch();
    $newStatus = (int) $row['active_count'] === 0 ? 'anulada' : ((int) $row['cancelled_count'] > 0 ? 'parcial' : 'pagada');
    $pdo->prepare('UPDATE sales SET status = ? WHERE id = ?')->execute([$newStatus, $saleId]);

    $pdo->commit();
    log_activity($pdo, 'cancelacion', $description . ($reason !== '' ? ". Motivo: {$reason}" : ''));
    json_response(['cancelled' => true, 'sale_status' => $newStatus]);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    report_api_error($error);
}
