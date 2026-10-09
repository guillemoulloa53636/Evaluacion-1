<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'GET') {
    $saleCode = strtolower(trim((string) ($_GET['code'] ?? '')));
    if (!preg_match('/^[a-f0-9]{32}$/', $saleCode)) {
        json_response(['error' => 'No se encontró la compra solicitada.'], 404);
    }

    try {
        $pdo = database();
        $saleQuery = $pdo->prepare('SELECT sale_code, total_amount, created_at FROM sales WHERE sale_code = ?');
        $saleQuery->execute([$saleCode]);
        $sale = $saleQuery->fetch();
        if (!$sale) {
            json_response(['error' => 'No se encontró la compra solicitada.'], 404);
        }
        $ticketQuery = $pdo->prepare('SELECT ticket_code, trip_title, destination, schedule_date, departure_time, platform, seat_number, passenger_name, passenger_rut, original_price, discount_percent, price_paid FROM tickets WHERE sale_id = (SELECT id FROM sales WHERE sale_code = ?) ORDER BY id');
        $ticketQuery->execute([$saleCode]);
        $sale['total_amount'] = (int) $sale['total_amount'];
        $sale['tickets'] = $ticketQuery->fetchAll();
        json_response($sale);
    } catch (Throwable $error) {
        report_api_error($error);
    }
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_response(['error' => 'Método no permitido.'], 405);
}

$data = request_json();
$items = $data['items'] ?? null;
if (!is_array($items) || count($items) === 0) {
    json_response(['error' => 'El carrito no contiene pasajes para comprar.'], 422);
}

try {
    $pdo = database();
    $pdo->beginTransaction();
    $saleCode = bin2hex(random_bytes(16));
    $ticketInsert = $pdo->prepare('INSERT INTO tickets (sale_id, ticket_code, product_id, trip_title, destination, schedule_date, departure_time, platform, seat_number, passenger_name, passenger_rut, original_price, discount_percent, price_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $productQuery = $pdo->prepare('SELECT id, slug, title, destination, price, status, discount_percent, schedules FROM products WHERE slug = ? FOR UPDATE');
    $soldSeatsQuery = $pdo->prepare('SELECT seat_number FROM tickets WHERE product_id = ? AND schedule_date = ? AND departure_time = ?');
    $tickets = [];
    $reservedSeats = [];
    $total = 0;

    foreach ($items as $item) {
        $slug = strtolower(trim((string) ($item['slug'] ?? '')));
        $scheduleId = trim((string) ($item['scheduleId'] ?? ''));
        $passengers = $item['passengers'] ?? null;
        if ($slug === '' || $scheduleId === '' || !is_array($passengers) || count($passengers) < 1) {
            throw new InvalidArgumentException('Cada pasaje debe incluir ruta, salida y datos de sus pasajeros.');
        }

        $productQuery->execute([$slug]);
        $product = $productQuery->fetch();
        if (!$product || $product['status'] !== 'Activo') {
            throw new RuntimeException('Una de las rutas ya no está disponible.');
        }

        $schedules = json_decode($product['schedules'] ?? '[]', true) ?: [];
        $schedule = null;
        foreach ($schedules as $candidate) {
            if (($candidate['id'] ?? '') === $scheduleId) {
                $schedule = $candidate;
                break;
            }
        }
        if (!$schedule || $schedule['date'] < date('Y-m-d')) {
            throw new RuntimeException('Una de las salidas seleccionadas ya no está disponible.');
        }

        $occupied = [];
        $soldSeatsQuery->execute([$product['id'], $schedule['date'], $schedule['time']]);
        foreach ($soldSeatsQuery->fetchAll(PDO::FETCH_COLUMN) as $seat) {
            $occupied[(int) $seat] = true;
        }
        $seatKey = $product['id'] . '|' . $schedule['date'] . '|' . $schedule['time'];
        foreach ($reservedSeats[$seatKey] ?? [] as $seat) {
            $occupied[$seat] = true;
        }
        $availableSeats = [];
        for ($seat = 1; $seat <= (int) $schedule['capacity']; $seat++) {
            if (!isset($occupied[$seat])) {
                $availableSeats[] = $seat;
            }
        }
        if (count($availableSeats) < count($passengers)) {
            throw new RuntimeException('No quedan suficientes asientos disponibles para una de las salidas.');
        }
        $reservedSeats[$seatKey] = array_merge($reservedSeats[$seatKey] ?? [], array_slice($availableSeats, 0, count($passengers)));

        $originalPrice = (int) $product['price'];
        $discountPercent = (int) $product['discount_percent'];
        $pricePaid = (int) round($originalPrice * (100 - $discountPercent) / 100);

        foreach (array_values($passengers) as $index => $passenger) {
            $name = trim((string) ($passenger['name'] ?? ''));
            $rut = preg_replace('/[^0-9kK]/', '', (string) ($passenger['rut'] ?? ''));
            if ($name === '' || strlen($name) > 600 || !preg_match('/^\d{7,8}[0-9kK]$/', $rut)) {
                throw new InvalidArgumentException('Ingresa nombre y RUT válido para cada pasajero.');
            }

            $ticketCode = bin2hex(random_bytes(16));
            $tickets[] = [
                'product_id' => $product['id'],
                'ticket_code' => $ticketCode,
                'trip_title' => $product['title'],
                'destination' => $product['destination'],
                'schedule_date' => $schedule['date'],
                'departure_time' => $schedule['time'],
                'platform' => $schedule['platform'],
                'seat_number' => $availableSeats[$index],
                'passenger_name' => $name,
                'passenger_rut' => $rut,
                'original_price' => $originalPrice,
                'discount_percent' => $discountPercent,
                'price_paid' => $pricePaid,
            ];
            $total += $pricePaid;
        }
    }

    $saleInsert = $pdo->prepare('INSERT INTO sales (sale_code, total_amount) VALUES (?, ?)');
    $saleInsert->execute([$saleCode, $total]);
    $saleId = (int) $pdo->lastInsertId();

    foreach ($tickets as $ticket) {
        $ticketInsert->execute([
            $saleId, $ticket['ticket_code'], $ticket['product_id'], $ticket['trip_title'], $ticket['destination'],
            $ticket['schedule_date'], $ticket['departure_time'], $ticket['platform'], $ticket['seat_number'],
            $ticket['passenger_name'], $ticket['passenger_rut'], $ticket['original_price'],
            $ticket['discount_percent'], $ticket['price_paid'],
        ]);
    }

    $pdo->commit();
    $publicTickets = array_map(static function (array $ticket): array {
        unset($ticket['product_id']);
        return $ticket;
    }, $tickets);
    json_response(['sale_code' => $saleCode, 'total_amount' => $total, 'tickets' => $publicTickets], 201);
} catch (InvalidArgumentException $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_response(['error' => $error->getMessage()], 422);
} catch (RuntimeException $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_response(['error' => $error->getMessage()], 409);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    report_api_error($error);
}
