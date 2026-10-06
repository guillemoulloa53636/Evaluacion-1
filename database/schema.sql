CREATE DATABASE IF NOT EXISTS viajes_chile
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE viajes_chile;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  destination VARCHAR(120) NOT NULL,
  price INT UNSIGNED NOT NULL,
  type VARCHAR(60) NOT NULL,
  status ENUM('Activo', 'Agotado') NOT NULL DEFAULT 'Activo',
  image VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  gallery LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telephone VARCHAR(40) NOT NULL DEFAULT '',
  region VARCHAR(100) NOT NULL DEFAULT '',
  commune VARCHAR(100) NOT NULL DEFAULT '',
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (id, slug, title, destination, price, type, status, image, description, gallery) VALUES
('PROD-01', 'puertomontt', 'Santiago - Puerto Montt', 'Puerto Montt', 35000, 'Salón Cama', 'Activo', 'Mont.jpg', 'La puerta de entrada a la Patagonia chilena y la Región de Los Lagos. Viaje directo con Wi-Fi y puertos USB.', '["Mont.jpg","Mont2.jpg"]'),
('PROD-02', 'valparaiso', 'Santiago - Valparaíso', 'Valparaíso', 10000, 'Clásico', 'Activo', 'Valpo.webp', 'Un destino bohemio e histórico, lleno de cerros con murales, arquitectura colorida y miradores al Pacífico.', '["Valpo.webp","valpo2.jpg"]'),
('PROD-03', 'laserena', 'Santiago - La Serena', 'La Serena', 18500, 'Semi Cama', 'Activo', 'Serena.webp', 'Destino costero de ritmo sereno, famoso por su arquitectura neocolonial y el icónico Faro Monumental.', '["Serena.webp","faro.jpg"]'),
('PROD-04', 'concepcion', 'Santiago - Concepción', 'Concepción', 22000, 'Salón Cama', 'Activo', 'Gran_Concepcion.jpg', 'La capital universitaria y del rock chileno, con servicios diurnos y nocturnos.', '["Gran_Concepcion.jpg","Conce2.jpg"]'),
('PROD-05', 'pucon', 'Santiago - Pucón', 'Pucón', 28000, 'Salón Cama', 'Agotado', 'Temuco.jpg', 'El epicentro del turismo de aventura en la Región de La Araucanía.', '["Temuco.jpg","Pucon2.jpg"]'),
('PROD-06', 'chiloe', 'Santiago - Chiloé', 'Chiloé', 25000, 'Salón Cama', 'Activo', 'Chilote.webp', 'Un viaje entre mitología, paisajes insulares verdes y una identidad cultural única.', '["Chilote.webp","Chiloe2.jpg"]'),
('PROD-07', 'talca', 'Santiago - Talca', 'Talca', 20000, 'Semi Cama', 'Activo', 'Talca.jpg', 'Corazón histórico y administrativo de la Región del Maule. Viaje rápido por la Ruta 5 Sur.', '["Talca.jpg","TalcaGod.jpg"]'),
('PROD-08', 'pichilemu', 'Santiago - Pichilemu', 'Pichilemu', 20000, 'Clásico', 'Activo', 'Pichilemu.jpg', 'La capital chilena del surf, reconocida mundialmente. Ideal para escapadas de fin de semana.', '["Pichilemu.jpg","Pichilemu2.jpg"]'),
('PROD-09', 'quintero', 'Santiago - Quintero', 'Quintero', 15000, 'Clásico', 'Activo', 'quintero.jpg', 'Tradicional ciudad costera de la zona central, conocida por sus numerosas playas.', '["quintero.jpg","quintero2.jpg"]'),
('PROD-10', 'vina', 'Santiago - Viña del Mar', 'Viña del Mar', 15000, 'Semi Cama', 'Activo', 'Vinia.jpg', 'La popular Ciudad Jardín, reconocida por su amplia infraestructura turística.', '["Vinia.jpg","Flores.jpg"]'),
('PROD-11', 'antofagasta', 'Santiago - Antofagasta', 'Antofagasta', 30000, 'Premium', 'Activo', 'Antofa.jpg', 'La Perla del Norte: ciudad costera e industrial con servicio a bordo.', '["Antofa.jpg","Anto2.jpg"]'),
('PROD-12', 'arica', 'Santiago - Arica', 'Arica', 35000, 'Premium', 'Activo', 'Arica.jpg', 'La Ciudad de la Eterna Primavera, con clima templado y asientos cama de 180°.', '["Arica.jpg","Arica2.jpg"]')
ON DUPLICATE KEY UPDATE slug = VALUES(slug);