<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    json_response(['error' => 'Método no permitido.'], 405);
}

$period = (string) ($_GET['period'] ?? 'day');
$startDate = match ($period) {
    'day' => date('Y-m-d'),
    'week' => date('Y-m-d', strtotime('monday this week')),
    'month' => date('Y-m-01'),
    'year' => date('Y-01-01'),
    default => null,
};
if ($startDate === null) {
    json_response(['error' => 'Período no válido.'], 422);
}
$from = $startDate . ' 00:00:00';

try {
    $pdo = database();

    $scalar = static function (string $sql, array $params = []) use ($pdo): int {
        $statement = $pdo->prepare($sql);
        $statement->execute($params);
        return (int) $statement->fetchColumn();
    };

    $metrics = [
        'totalSales' => $scalar("SELECT COALESCE(SUM(t.price_paid), 0) FROM tickets t JOIN sales s ON s.id = t.sale_id WHERE s.created_at >= ? AND t.status = 'activo'", [$from]),
        'ticketsSold' => $scalar("SELECT COUNT(*) FROM tickets t JOIN sales s ON s.id = t.sale_id WHERE s.created_at >= ? AND t.status = 'activo'", [$from]),
        'completedTrips' => $scalar("SELECT COUNT(*) FROM (SELECT DISTINCT product_id, schedule_date, departure_time FROM tickets WHERE status = 'activo' AND schedule_date >= ? AND TIMESTAMP(schedule_date, departure_time) <= NOW()) trips", [$startDate]),
        'cancellations' => $scalar("SELECT COUNT(*) FROM tickets WHERE status = 'cancelado' AND cancelled_at >= ?", [$from]),
        'cancelledAmount' => $scalar("SELECT COALESCE(SUM(price_paid), 0) FROM tickets WHERE status = 'cancelado' AND cancelled_at >= ?", [$from]),
        'complaints' => $scalar("SELECT COUNT(*) FROM contact_messages WHERE type = 'reclamo' AND created_at >= ? AND status <> 'eliminado'", [$from]),
        'messages' => $scalar("SELECT COUNT(*) FROM contact_messages WHERE type = 'mensaje' AND created_at >= ? AND status <> 'eliminado'", [$from]),
        'unreadMessages' => $scalar("SELECT COUNT(*) FROM contact_messages WHERE status = 'no_leido'"),
        'newUsers' => $scalar('SELECT COUNT(*) FROM users WHERE created_at >= ?', [$from]),
        'openFleetEvents' => $scalar("SELECT COUNT(*) FROM fleet_events WHERE status <> 'reparado'"),
    ];

    $salesStatement = $pdo->prepare('SELECT id, sale_code, total_amount, status, created_at FROM sales WHERE created_at >= ? ORDER BY created_at DESC, id DESC');
    $salesStatement->execute([$from]);
    $sales = $salesStatement->fetchAll();

    $ticketsBySale = [];
    if ($sales) {
        $ids = array_column($sales, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $ticketStatement = $pdo->prepare("SELECT sale_id, ticket_code, trip_title, destination, schedule_date, departure_time, seat_number, passenger_name, price_paid, status, cancelled_at, cancel_reason FROM tickets WHERE sale_id IN ($placeholders) ORDER BY id");
        $ticketStatement->execute($ids);
        foreach ($ticketStatement->fetchAll() as $ticket) {
            $ticket['price_paid'] = (int) $ticket['price_paid'];
            $ticket['seat_number'] = (int) $ticket['seat_number'];
            $ticketsBySale[$ticket['sale_id']][] = $ticket;
        }
    }
    $purchases = array_map(static function (array $sale) use ($ticketsBySale): array {
        $sale['total_amount'] = (int) $sale['total_amount'];
        $sale['tickets'] = $ticketsBySale[$sale['id']] ?? [];
        unset($sale['id']);
        return $sale;
    }, $sales);

    $cancelled = $pdo->prepare("SELECT t.ticket_code, s.sale_code, t.trip_title, t.passenger_name, t.price_paid, t.cancelled_at, t.cancel_reason FROM tickets t JOIN sales s ON s.id = t.sale_id WHERE t.status = 'cancelado' AND t.cancelled_at >= ? ORDER BY t.cancelled_at DESC");
    $cancelled->execute([$from]);
    $cancellations = array_map(static function (array $row): array {
        $row['price_paid'] = (int) $row['price_paid'];
        return $row;
    }, $cancelled->fetchAll());

    $fleet = $pdo->prepare("SELECT id, vehicle, description, status, admin_notes, reported_at, resolved_at FROM fleet_events WHERE reported_at >= ? OR status <> 'reparado' ORDER BY (status = 'reparado'), reported_at DESC");
    $fleet->execute([$from]);

    $activity = $pdo->prepare('SELECT id, type, description, actor, created_at FROM activity_log WHERE created_at >= ? ORDER BY created_at DESC, id DESC LIMIT 200');
    $activity->execute([$from]);

    json_response([
        'period' => $period,
        'metrics' => $metrics,
        'purchases' => $purchases,
        'cancellations' => $cancellations,
        'fleetEvents' => $fleet->fetchAll(),
        'activity' => $activity->fetchAll(),
    ]);
} catch (Throwable $error) {
    report_api_error($error);
}
