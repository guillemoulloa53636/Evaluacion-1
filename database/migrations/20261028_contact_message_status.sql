-- Estados y notas para los mensajes de contacto gestionados desde el panel admin.
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS status ENUM('no_leido', 'leido', 'aplicado', 'archivado', 'eliminado') NOT NULL DEFAULT 'no_leido',
  ADD COLUMN IF NOT EXISTS admin_notes TEXT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
