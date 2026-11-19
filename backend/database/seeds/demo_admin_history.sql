-- Datos de demostración para el panel admin (ventas, cancelaciones, flota, sucesos, mensajes).
-- Se puede importar varias veces: usa INSERT IGNORE con códigos fijos.
USE viajes_chile;

-- Ventas (fechas relativas a hoy)
INSERT IGNORE INTO sales (sale_code, total_amount, created_at, status) VALUES
('DEMO0000000000000000000000000001', 35000, NOW() - INTERVAL 2 HOUR, 'pagada'),
('DEMO0000000000000000000000000002', 20000, NOW() - INTERVAL 5 HOUR, 'anulada'),
('DEMO0000000000000000000000000003', 25500, NOW() - INTERVAL 2 DAY, 'parcial'),
('DEMO0000000000000000000000000004', 36000, NOW() - INTERVAL 4 DAY, 'pagada'),
('DEMO0000000000000000000000000005', 15000, NOW() - INTERVAL 12 DAY, 'pagada'),
('DEMO0000000000000000000000000006', 30000, NOW() - INTERVAL 20 DAY, 'anulada'),
('DEMO0000000000000000000000000007', 56000, NOW() - INTERVAL 45 DAY, 'pagada'),
('DEMO0000000000000000000000000008', 18500, NOW() - INTERVAL 80 DAY, 'pagada');

INSERT IGNORE INTO tickets
 (sale_id, ticket_code, product_id, trip_title, destination, schedule_date, departure_time, platform, seat_number,
  passenger_name, passenger_rut, original_price, discount_percent, price_paid, created_at, status, cancelled_at, cancel_reason)
SELECT s.id, t.code, t.pid, t.title, t.dest, t.sdate, t.stime, t.plat, t.seat, t.pname, t.rut, t.orig, t.disc, t.paid,
       s.created_at, t.st, t.cat, t.reason
FROM sales s JOIN (
  SELECT 'DEMO0000000000000000000000000001' sc, 'DEMOT000000000000000000000000001' code, 'PROD-01' pid, 'Santiago - Puerto Montt' title, 'Puerto Montt' dest, CURDATE() + INTERVAL 10 DAY sdate, '08:00:00' stime, 'Andén 3' plat, 1 seat, 'Camila Rojas' pname, '18.345.221-7' rut, 35000 orig, 0 disc, 35000 paid, 'activo' st, NULL cat, NULL reason
  UNION ALL SELECT 'DEMO0000000000000000000000000002','DEMOT000000000000000000000000002','PROD-07','Santiago - Talca','Talca',CURDATE() + INTERVAL 7 DAY,'09:30:00','Andén 2',4,'Pedro Soto','16.220.908-K',20000,0,20000,'cancelado',NOW() - INTERVAL 3 HOUR,'El pasajero no puede viajar'
  UNION ALL SELECT 'DEMO0000000000000000000000000003','DEMOT000000000000000000000000003','PROD-02','Santiago - Valparaíso','Valparaíso',CURDATE() + INTERVAL 5 DAY,'10:00:00','Andén 1',7,'Javiera Muñoz','19.876.543-2',10000,15,8500,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000003','DEMOT000000000000000000000000004','PROD-02','Santiago - Valparaíso','Valparaíso',CURDATE() + INTERVAL 5 DAY,'10:00:00','Andén 1',8,'Matías Muñoz','21.111.222-3',10000,15,8500,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000003','DEMOT000000000000000000000000005','PROD-02','Santiago - Valparaíso','Valparaíso',CURDATE() + INTERVAL 5 DAY,'10:00:00','Andén 1',9,'Sofía Muñoz','22.333.444-5',10000,15,8500,'cancelado',NOW() - INTERVAL 1 DAY,'Error en el nombre del pasajero'
  UNION ALL SELECT 'DEMO0000000000000000000000000004','DEMOT000000000000000000000000006','PROD-04','Santiago - Concepción','Concepción',CURDATE() + INTERVAL 3 DAY,'07:45:00','Andén 4',12,'Diego Fuentes','17.654.321-0',22000,20,17600,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000004','DEMOT000000000000000000000000007','PROD-04','Santiago - Concepción','Concepción',CURDATE() + INTERVAL 3 DAY,'07:45:00','Andén 4',13,'Valentina Fuentes','20.123.456-8',22000,20,17600,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000005','DEMOT000000000000000000000000008','PROD-09','Santiago - Quintero','Quintero',CURDATE() - INTERVAL 2 DAY,'11:00:00','Andén 1',3,'Andrés Pizarro','15.987.654-3',15000,0,15000,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000006','DEMOT000000000000000000000000009','PROD-11','Santiago - Antofagasta','Antofagasta',CURDATE() - INTERVAL 5 DAY,'20:00:00','Andén 5',2,'Francisca Lagos','14.765.432-1',30000,0,30000,'cancelado',NOW() - INTERVAL 19 DAY,'Cambio de planes del cliente'
  UNION ALL SELECT 'DEMO0000000000000000000000000007','DEMOT000000000000000000000000010','PROD-12','Santiago - Arica','Arica',CURDATE() - INTERVAL 30 DAY,'18:00:00','Andén 6',5,'Rodrigo Vega','13.456.789-5',35000,0,35000,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000007','DEMOT000000000000000000000000011','PROD-08','Santiago - Pichilemu','Pichilemu',CURDATE() - INTERVAL 30 DAY,'09:00:00','Andén 2',6,'Rodrigo Vega','13.456.789-5',20000,25,15000,'activo',NULL,NULL
  UNION ALL SELECT 'DEMO0000000000000000000000000008','DEMOT000000000000000000000000012','PROD-03','Santiago - La Serena','La Serena',CURDATE() - INTERVAL 70 DAY,'22:00:00','Andén 3',10,'Isidora Campos','18.222.333-4',18500,0,18500,'activo',NULL,NULL
) t ON t.sc = s.sale_code;

-- Eventos de flota
INSERT INTO fleet_events (vehicle, description, status, admin_notes, reported_at, resolved_at)
SELECT * FROM (
  SELECT 'Bus 12 (BKXY-45)' v, 'Falla en el aire acondicionado' d, 'con_falla' s, NULL n, NOW() - INTERVAL 3 HOUR r, NULL x
  UNION ALL SELECT 'Bus 07 (HJTR-21)','Ruido en el motor al frenar','en_servicio_tecnico','Enviado al taller central',NOW() - INTERVAL 2 DAY,NULL
  UNION ALL SELECT 'Bus 03 (LPQW-88)','Cambio de neumáticos delanteros','reparado','Revisión aprobada',NOW() - INTERVAL 9 DAY,NOW() - INTERVAL 8 DAY
  UNION ALL SELECT 'Bus 15 (ZZMN-10)','Daño en la caja de cambios','fuera_de_servicio','Esperando repuesto',NOW() - INTERVAL 15 DAY,NULL
) e WHERE NOT EXISTS (SELECT 1 FROM fleet_events LIMIT 1);

-- Historial de sucesos
INSERT INTO activity_log (type, description, actor, created_at)
SELECT * FROM (
  SELECT 'compra' t, 'Compra DEMO...0001: 1 pasaje Santiago - Puerto Montt por $35.000' d, 'Camila Rojas' a, NOW() - INTERVAL 2 HOUR c
  UNION ALL SELECT 'compra','Compra DEMO...0002: 1 pasaje Santiago - Talca por $20.000','Pedro Soto',NOW() - INTERVAL 5 HOUR
  UNION ALL SELECT 'cancelacion','Pasaje de Pedro Soto cancelado: El pasajero no puede viajar','Administrador',NOW() - INTERVAL 3 HOUR
  UNION ALL SELECT 'flota','Bus 12 (BKXY-45) reportado con falla: aire acondicionado','Administrador',NOW() - INTERVAL 3 HOUR
  UNION ALL SELECT 'compra','Compra DEMO...0003: 3 pasajes Santiago - Valparaíso por $25.500','Javiera Muñoz',NOW() - INTERVAL 2 DAY
  UNION ALL SELECT 'cancelacion','Pasaje de Sofía Muñoz cancelado: Error en el nombre del pasajero','Administrador',NOW() - INTERVAL 1 DAY
  UNION ALL SELECT 'flota','Bus 07 (HJTR-21) enviado a servicio técnico','Administrador',NOW() - INTERVAL 2 DAY
  UNION ALL SELECT 'registro','Nueva cuenta registrada: Diego Fuentes','Diego Fuentes',NOW() - INTERVAL 4 DAY
  UNION ALL SELECT 'compra','Compra DEMO...0004: 2 pasajes Santiago - Concepción por $35.200','Diego Fuentes',NOW() - INTERVAL 4 DAY
  UNION ALL SELECT 'reclamo','Reclamo recibido de Ana Torres: atraso de 40 minutos','Ana Torres',NOW() - INTERVAL 6 DAY
  UNION ALL SELECT 'compra','Compra DEMO...0005: 1 pasaje Santiago - Quintero por $15.000','Andrés Pizarro',NOW() - INTERVAL 12 DAY
  UNION ALL SELECT 'flota','Bus 03 (LPQW-88) reparado','Administrador',NOW() - INTERVAL 8 DAY
  UNION ALL SELECT 'cancelacion','Venta DEMO...0006 anulada: Cambio de planes del cliente','Administrador',NOW() - INTERVAL 19 DAY
  UNION ALL SELECT 'compra','Compra DEMO...0007: 2 pasajes por $56.000','Rodrigo Vega',NOW() - INTERVAL 45 DAY
  UNION ALL SELECT 'compra','Compra DEMO...0008: 1 pasaje Santiago - La Serena por $18.500','Isidora Campos',NOW() - INTERVAL 80 DAY
) l WHERE NOT EXISTS (SELECT 1 FROM activity_log WHERE description LIKE 'Compra DEMO%');

-- Mensajes y reclamos
INSERT INTO contact_messages (name, email, message, type, status, admin_notes, created_at)
SELECT * FROM (
  SELECT 'Ana Torres' n, 'ana.torres@example.com' e, 'El bus a Valparaíso salió 40 minutos tarde.' m, 'reclamo' t, 'no_leido' st, NULL a, NOW() - INTERVAL 6 DAY c
  UNION ALL SELECT 'Luis Herrera','luis.h@example.com','¿Cuántas maletas puedo llevar?','mensaje','leido',NULL,NOW() - INTERVAL 3 DAY
  UNION ALL SELECT 'Carolina Díaz','caro.diaz@example.com','Me cobraron dos veces mi pasaje.','reclamo','aplicado','Se devolvió el cobro duplicado',NOW() - INTERVAL 15 DAY
  UNION ALL SELECT 'Marcelo Pinto','marcelo.p@example.com','Excelente servicio, muy puntual.','mensaje','archivado',NULL,NOW() - INTERVAL 25 DAY
) c WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'ana.torres@example.com');
