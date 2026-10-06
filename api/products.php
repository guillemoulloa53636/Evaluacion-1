<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

function product_payload(array $row): array
{
    $row['price'] = (int) $row['price'];
    $row['gallery'] = json_decode($row['gallery'], true) ?: [$row['image']];
    unset($row['created_at']);
    return $row;
}

function validate_product(array $data): array
{
    $product = [
        'id' => trim((string) ($data['id'] ?? '')),
        'slug' => strtolower(trim((string) ($data['slug'] ?? ''))),
        'title' => trim((string) ($data['title'] ?? '')),
        'destination' => trim((string) ($data['destination'] ?? '')),
        'price' => filter_var($data['price'] ?? null, FILTER_VALIDATE_INT),
        'type' => trim((string) ($data['type'] ?? 'Clásico')),
        'status' => (string) ($data['status'] ?? 'Activo'),
        'image' => basename(trim((string) ($data['image'] ?? ''))),
        'description' => trim((string) ($data['description'] ?? '')),
        'gallery' => is_array($data['gallery'] ?? null) ? $data['gallery'] : [],
    ];

    if ($product['id'] === '' || $product['slug'] === '' || $product['title'] === '' || $product['destination'] === '' || $product['price'] === false || $product['price'] < 1 || $product['image'] === '') {
        json_response(['error' => 'Completa los campos de la ruta con valores válidos.'], 422);
    }
    if (!in_array($product['status'], ['Activo', 'Agotado'], true)) {
        json_response(['error' => 'El estado seleccionado no es válido.'], 422);
    }
    if (!$product['gallery']) {
        $product['gallery'] = [$product['image']];
    }
    $product['gallery'] = array_map(static fn ($image) => basename((string) $image), $product['gallery']);
    return $product;
}

try {
    $pdo = database();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $rows = $pdo->query('SELECT id, slug, title, destination, price, type, status, image, description, gallery FROM products ORDER BY created_at, id')->fetchAll();
        json_response(array_map('product_payload', $rows));
    }

    require_admin();
    if ($method === 'POST') {
        $product = validate_product(request_json());
        $statement = $pdo->prepare('INSERT INTO products (id, slug, title, destination, price, type, status, image, description, gallery) VALUES (:id, :slug, :title, :destination, :price, :type, :status, :image, :description, :gallery)');
        $product['gallery'] = json_encode($product['gallery'], JSON_UNESCAPED_UNICODE);
        $statement->execute($product);
        $product['gallery'] = json_decode($product['gallery'], true);
        json_response(['product' => $product], 201);
    }

    if ($method === 'PUT') {
        $data = request_json();
        $originalSlug = strtolower(trim((string) ($_GET['slug'] ?? $data['originalSlug'] ?? '')));
        $product = validate_product($data);
        $statement = $pdo->prepare('UPDATE products SET id = :id, slug = :new_slug, title = :title, destination = :destination, price = :price, type = :type, status = :status, image = :image, description = :description, gallery = :gallery WHERE slug = :original_slug');
        $statement->execute([
            'id' => $product['id'], 'new_slug' => $product['slug'], 'title' => $product['title'],
            'destination' => $product['destination'], 'price' => $product['price'], 'type' => $product['type'],
            'status' => $product['status'], 'image' => $product['image'], 'description' => $product['description'],
            'gallery' => json_encode($product['gallery'], JSON_UNESCAPED_UNICODE), 'original_slug' => $originalSlug,
        ]);
        if ($statement->rowCount() === 0 && $originalSlug !== $product['slug']) {
            json_response(['error' => 'No se encontró la ruta que intentas editar.'], 404);
        }
        json_response(['product' => $product]);
    }

    if ($method === 'DELETE') {
        $slug = strtolower(trim((string) ($_GET['slug'] ?? '')));
        $statement = $pdo->prepare('DELETE FROM products WHERE slug = ?');
        $statement->execute([$slug]);
        if ($statement->rowCount() === 0) {
            json_response(['error' => 'No se encontró la ruta que intentas eliminar.'], 404);
        }
        json_response(['deleted' => true]);
    }

    header('Allow: GET, POST, PUT, DELETE');
    json_response(['error' => 'Método no permitido.'], 405);
} catch (PDOException $error) {
    if ($error->getCode() === '23000') {
        json_response(['error' => 'El identificador o slug ya está en uso.'], 409);
    }
    report_api_error($error);
} catch (Throwable $error) {
    report_api_error($error);
}