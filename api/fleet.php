<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
require_admin();

const FLEET_STATUSES = [
    'con_falla' => 'Con falla',
    'en_servicio_tecnico' => 'En servicio técnico',
    'reparado' => 'Reparado',
    'fuera_de_servicio' => 'Fuera de servicio',
];
const FLEET_COLUMNS = 'id, vehicle, description, status, admin_notes, reported_at, resolved_at';

try {
    $pdo = database();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        json_response($pdo->query('SELECT ' . FLEET_COLUMNS . " FROM fleet_events ORDER BY (status = 'reparado'), reported_at DESC")->fetchAll());
    }

    if ($method === 'POST') {
        $data = request_json();
        $vehicle = trim((string) ($data['vehicle'] ?? ''));
        $description = trim((string) ($data['description'] ?? ''));
        $status = (string) ($data['status'] ?? 'con_falla');
        if ($vehicle === '' || $description === '' || !isset(FLEET_STATUSES[$status])) {
            json_response(['error' => 'Indica el bus, el problema y un estado válido.'], 422);
        }
        $resolved = $status === 'reparado' ? date('Y-m-d H:i:s') : null;
        $pdo->prepare('INSERT INTO fleet_events (vehicle, description, status, resolved_at) VALUES (?, ?, ?, ?)')
            ->execute([mb_substr($vehicle, 0, 60), mb_substr($description, 0, 500), $status, $resolved]);
        log_activity($pdo, 'flota', "Reporte de bus {$vehicle}: {$description} (" . FLEET_STATUSES[$status] . ')');
        json_response(['created' => true], 201);
    }

    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id < 1) {
        json_response(['error' => 'Falta el identificador del evento.'], 422);
    }
    $current = $pdo->prepare('SELECT ' . FLEET_COLUMNS . ' FROM fleet_events WHERE id = ?');
    $current->execute([$id]);
    $event = $current->fetch();
    if (!$event) {
        json_response(['error' => 'Evento de flota no encontrado.'], 404);
    }

    if ($method === 'PUT') {
        $data = request_json();
        $fields = [];
        $params = [];
        if (array_key_exists('status', $data)) {
            $status = (string) $data['status'];
            if (!isset(FLEET_STATUSES[$status])) {
                json_response(['error' => 'Estado no válido.'], 422);
            }
            $fields[] = 'status = ?';
            $params[] = $status;
            $fields[] = 'resolved_at = ?';
            $params[] = $status === 'reparado' ? date('Y-m-d H:i:s') : null;
        }
        if (array_key_exists('admin_notes', $data)) {
            $fields[] = 'admin_notes = ?';
            $params[] = trim((string) $data['admin_notes']);
        }
        if (array_key_exists('description', $data) && trim((string) $data['description']) !== '') {
            $fields[] = 'description = ?';
            $params[] = mb_substr(trim((string) $data['description']), 0, 500);
        }
        if (!$fields) {
            json_response(['error' => 'No hay cambios que guardar.'], 422);
        }
        $params[] = $id;
        $pdo->prepare('UPDATE fleet_events SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
        if (isset($status) && $status !== $event['status']) {
            log_activity($pdo, 'flota', "Bus {$event['vehicle']}: estado cambiado de " . FLEET_STATUSES[$event['status']] . ' a ' . FLEET_STATUSES[$status]);
        }
        json_response(['updated' => true]);
    }

    if ($method === 'DELETE') {
        $pdo->prepare('DELETE FROM fleet_events WHERE id = ?')->execute([$id]);
        log_activity($pdo, 'flota', "Evento de flota eliminado: bus {$event['vehicle']} - {$event['description']}");
        json_response(['deleted' => true]);
    }

    header('Allow: GET, POST, PUT, DELETE');
    json_response(['error' => 'Método no permitido.'], 405);
} catch (Throwable $error) {
    report_api_error($error);
}
