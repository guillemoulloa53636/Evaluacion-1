<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

const CONTACT_STATUSES = ['no_leido', 'leido', 'aplicado', 'archivado', 'eliminado'];
const CONTACT_COLUMNS = 'id, name, email, message, status, admin_notes, created_at, updated_at';

try {
    $pdo = database();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // Público: el formulario de contacto envía mensajes.
    if ($method === 'POST') {
        $data = request_json();
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $message = trim((string) ($data['message'] ?? ''));
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
            json_response(['error' => 'Completa nombre, correo y mensaje válido.'], 422);
        }
        $statement = $pdo->prepare("INSERT INTO contact_messages (name, email, message, status) VALUES (?, ?, ?, 'no_leido')");
        $statement->execute([$name, $email, $message]);
        json_response(['sent' => true], 201);
    }

    // Todo lo demás es solo para administradores.
    require_admin();

    if ($method === 'GET') {
        $status = (string) ($_GET['status'] ?? '');
        if ($status !== '' && !in_array($status, CONTACT_STATUSES, true)) {
            json_response(['error' => 'Estado no válido.'], 422);
        }
        $sql = 'SELECT ' . CONTACT_COLUMNS . ' FROM contact_messages';
        $params = [];
        if ($status !== '') {
            $sql .= ' WHERE status = ?';
            $params[] = $status;
        } else {
            $sql .= " WHERE status <> 'eliminado'";
        }
        $statement = $pdo->prepare($sql . ' ORDER BY created_at DESC, id DESC');
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