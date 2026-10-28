<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

const CONTACT_STATUSES = ['no_leido', 'leido', 'aplicado', 'archivado', 'eliminado'];
const CONTACT_TYPES = ['mensaje', 'reclamo'];
const CONTACT_COLUMNS = 'id, name, email, message, type, status, admin_notes, created_at, updated_at';

try {
    $pdo = database();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // Público: el formulario de contacto envía mensajes o reclamos.
    if ($method === 'POST') {
        $data = request_json();
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $message = trim((string) ($data['message'] ?? ''));
        $type = ($data['isComplaint'] ?? false) === true ? 'reclamo' : 'mensaje';
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
            json_response(['error' => 'Completa nombre, correo y mensaje válido.'], 422);
        }
        $statement = $pdo->prepare("INSERT INTO contact_messages (name, email, message, type, status) VALUES (?, ?, ?, ?, 'no_leido')");
        $statement->execute([$name, $email, $message, $type]);
        log_activity($pdo, $type, ($type === 'reclamo' ? 'Nuevo reclamo' : 'Nuevo mensaje de contacto') . " de {$name}", $name);
        json_response(['sent' => true], 201);
    }

    // Todo lo demás es solo para administradores.
    require_admin();

    if ($method === 'GET') {
        $status = (string) ($_GET['status'] ?? '');
        $type = (string) ($_GET['type'] ?? '');
        if ($status !== '' && !in_array($status, CONTACT_STATUSES, true)) {
            json_response(['error' => 'Estado no válido.'], 422);
        }
        if ($type !== '' && !in_array($type, CONTACT_TYPES, true)) {
            json_response(['error' => 'Tipo no válido.'], 422);
        }
        $conditions = [];
        $params = [];
        if ($status !== '') {
            $conditions[] = 'status = ?';
            $params[] = $status;
        } else {
            $conditions[] = "status <> 'eliminado'";
        }
        if ($type !== '') {
            $conditions[] = 'type = ?';
            $params[] = $type;
        }
        $statement = $pdo->prepare('SELECT ' . CONTACT_COLUMNS . ' FROM contact_messages WHERE ' . implode(' AND ', $conditions) . ' ORDER BY created_at DESC, id DESC');
        $statement->execute($params);
        json_response($statement->fetchAll());
    }

    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id < 1) {
        json_response(['error' => 'Falta el identificador del mensaje.'], 422);
    }

    if ($method === 'PUT') {
        $data = request_json();
        $fields = [];
        $params = [];
        if (array_key_exists('status', $data)) {
            $status = (string) $data['status'];
            if (!in_array($status, CONTACT_STATUSES, true)) {
                json_response(['error' => 'Estado no válido.'], 422);
            }
            $fields[] = 'status = ?';
            $params[] = $status;
        }
        if (array_key_exists('admin_notes', $data)) {
            $fields[] = 'admin_notes = ?';
            $params[] = trim((string) $data['admin_notes']);
        }
        if (!$fields) {
            json_response(['error' => 'No hay cambios que guardar.'], 422);
        }
        $params[] = $id;
        $pdo->prepare('UPDATE contact_messages SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
        $statement = $pdo->prepare('SELECT ' . CONTACT_COLUMNS . ' FROM contact_messages WHERE id = ?');
        $statement->execute([$id]);
        $row = $statement->fetch();
        if (!$row) {
            json_response(['error' => 'Mensaje no encontrado.'], 404);
        }
        if (array_key_exists('status', $data)) {
            $label = $row['type'] === 'reclamo' ? 'Reclamo' : 'Mensaje';
            log_activity($pdo, $row['type'], "{$label} de {$row['name']}: estado cambiado a " . str_replace('_', ' ', $row['status']));
        }
        json_response(['message' => $row]);
    }

    // DELETE: eliminación lógica; con ?permanent=1 se borra definitivamente.
    if ($method === 'DELETE') {
        if (($_GET['permanent'] ?? '') === '1') {
            $statement = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
        } else {
            $statement = $pdo->prepare("UPDATE contact_messages SET status = 'eliminado' WHERE id = ?");
        }
        $statement->execute([$id]);
        json_response(['deleted' => true]);
    }

    header('Allow: GET, POST, PUT, DELETE');
    json_response(['error' => 'Método no permitido.'], 405);
} catch (Throwable $error) {
    report_api_error($error);
}