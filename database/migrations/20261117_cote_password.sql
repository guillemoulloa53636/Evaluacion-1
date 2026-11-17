USE viajes_chile;

-- Contraseña de cote@gmail.com: Cote1234
UPDATE users
SET password_hash = '$2b$10$qWHIozwGhm2xzB5YWSmezuCiGpduVTxw/5DI9u/kAjLl3UlQOmPs.'
WHERE email = 'cote@gmail.com';
