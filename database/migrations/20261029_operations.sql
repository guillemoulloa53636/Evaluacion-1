-- Operación del panel admin: cancelaciones de boletos, estado de buses y registro de sucesos.
-- Ejecutar sobre la base viajes_chile (phpMyAdmin → Importar o pestaña SQL).

ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS status ENUM('pagada', 'parcial', 'anulada') NOT NULL DEFAULT 'pagada';

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS status ENUM('activo', 'cancelado') NOT NULL DEFAULT 'activo',
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cancel_reason VARCHAR(300) NULL;

-- El índice único impedía volver a vender un asiento cancelado; se reemplaza por uno normal.
-- La disponibilidad se valida en purchase.php (con bloqueo de la ruta) solo contra boletos activos.
ALTER TABLE tickets DROP INDEX IF EXISTS ticket_schedule_seat;
ALTER TABLE tickets ADD INDEX IF NOT EXISTS ticket_schedule_seat (product_id, schedule_date, departure_time, seat_number);

CREATE TABLE IF NOT EXISTS fleet_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  vehicle VARCHAR(60) NOT NULL,
  description VARCHAR(500) NOT NULL,
  status ENUM('con_falla', 'en_servicio_tecnico', 'reparado', 'fuera_de_servicio') NOT NULL DEFAULT 'con_falla',
  admin_notes TEXT NULL,
  reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(30) NOT NULL,
  description VARCHAR(500) NOT NULL,
  actor VARCHAR(150) NOT NULL DEFAULT 'Sistema',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
