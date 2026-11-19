-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-10-2026 a las 00:28:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `viajes_chile`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` varchar(32) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(180) NOT NULL,
  `destination` varchar(120) NOT NULL,
  `price` int(10) UNSIGNED NOT NULL,
  `type` varchar(60) NOT NULL,
  `status` enum('Activo','Agotado') NOT NULL DEFAULT 'Activo',
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `gallery` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `slug`, `title`, `destination`, `price`, `type`, `status`, `image`, `description`, `gallery`, `created_at`) VALUES
('PROD-01', 'puertomontt', 'Santiago - Puerto Montt', 'Puerto Montt', 35000, 'Salón Cama', 'Activo', 'Mont.jpg', 'La puerta de entrada a la Patagonia chilena y la Región de Los Lagos. Viaje directo con Wi-Fi y puertos USB.', '[\"Mont.jpg\",\"Mont2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-02', 'valparaiso', 'Santiago - Valparaíso', 'Valparaíso', 10000, 'Clásico', 'Activo', 'Valpo.webp', 'Un destino bohemio e histórico, lleno de cerros con murales, arquitectura colorida y miradores al Pacífico.', '[\"Valpo.webp\",\"valpo2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-03', 'laserena', 'Santiago - La Serena', 'La Serena', 18500, 'Semi Cama', 'Activo', 'Serena.webp', 'Destino costero de ritmo sereno, famoso por su arquitectura neocolonial y el icónico Faro Monumental.', '[\"Serena.webp\",\"faro.jpg\"]', '2026-10-06 21:44:11'),
('PROD-04', 'concepcion', 'Santiago - Concepción', 'Concepción', 22000, 'Salón Cama', 'Activo', 'Gran_Concepcion.jpg', 'La capital universitaria y del rock chileno, con servicios diurnos y nocturnos.', '[\"Gran_Concepcion.jpg\",\"Conce2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-05', 'pucon', 'Santiago - Pucón', 'Pucón', 28000, 'Salón Cama', 'Agotado', 'Temuco.jpg', 'El epicentro del turismo de aventura en la Región de La Araucanía.', '[\"Temuco.jpg\",\"Pucon2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-06', 'chiloe', 'Santiago - Chiloé', 'Chiloé', 25000, 'Salón Cama', 'Activo', 'Chilote.webp', 'Un viaje entre mitología, paisajes insulares verdes y una identidad cultural única.', '[\"Chilote.webp\",\"Chiloe2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-07', 'talca', 'Santiago - Talca', 'Talca', 20000, 'Semi Cama', 'Activo', 'Talca.jpg', 'Corazón histórico y administrativo de la Región del Maule. Viaje rápido por la Ruta 5 Sur.', '[\"Talca.jpg\",\"TalcaGod.jpg\"]', '2026-10-06 21:44:11'),
('PROD-08', 'pichilemu', 'Santiago - Pichilemu', 'Pichilemu', 20000, 'Clásico', 'Activo', 'Pichilemu.jpg', 'La capital chilena del surf, reconocida mundialmente. Ideal para escapadas de fin de semana.', '[\"Pichilemu.jpg\",\"Pichilemu2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-09', 'quintero', 'Santiago - Quintero', 'Quintero', 15000, 'Clásico', 'Activo', 'quintero.jpg', 'Tradicional ciudad costera de la zona central, conocida por sus numerosas playas.', '[\"quintero.jpg\",\"quintero2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-10', 'vina', 'Santiago - Viña del Mar', 'Viña del Mar', 15000, 'Semi Cama', 'Activo', 'Vinia.jpg', 'La popular Ciudad Jardín, reconocida por su amplia infraestructura turística.', '[\"Vinia.jpg\",\"Flores.jpg\"]', '2026-10-06 21:44:11'),
('PROD-11', 'antofagasta', 'Santiago - Antofagasta', 'Antofagasta', 30000, 'Premium', 'Activo', 'Antofa.jpg', 'La Perla del Norte: ciudad costera e industrial con servicio a bordo.', '[\"Antofa.jpg\",\"Anto2.jpg\"]', '2026-10-06 21:44:11'),
('PROD-12', 'arica', 'Santiago - Arica', 'Arica', 35000, 'Premium', 'Activo', 'Arica.jpg', 'La Ciudad de la Eterna Primavera, con clima templado y asientos cama de 180°.', '[\"Arica.jpg\",\"Arica2.jpg\"]', '2026-10-06 21:44:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telephone` varchar(40) NOT NULL DEFAULT '',
  `region` varchar(100) NOT NULL DEFAULT '',
  `commune` varchar(100) NOT NULL DEFAULT '',
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
