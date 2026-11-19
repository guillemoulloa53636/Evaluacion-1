USE viajes_chile;

ALTER TABLE users
  MODIFY COLUMN role ENUM('customer', 'seller', 'admin') NOT NULL DEFAULT 'customer';
