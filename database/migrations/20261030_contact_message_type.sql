-- Distingue los reclamos de los mensajes de contacto normales.
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS type ENUM('mensaje', 'reclamo') NOT NULL DEFAULT 'mensaje' AFTER message;
