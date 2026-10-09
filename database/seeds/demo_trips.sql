-- Local demonstration offers and departures.
-- Preserve existing schedules; only populate routes whose schedule list is empty.
UPDATE products
SET discount_percent = CASE slug
  WHEN 'puertomontt' THEN 23
  WHEN 'valparaiso' THEN 15
  WHEN 'laserena' THEN 10
  WHEN 'concepcion' THEN 20
  WHEN 'pichilemu' THEN 25
END,
    schedules = CASE
      WHEN schedules IS NULL OR TRIM(schedules) = '' OR TRIM(schedules) = '[]' THEN
        CASE slug
          WHEN 'puertomontt' THEN '[{"id":"demo-puerto-20261010-am","date":"2026-10-10","time":"08:30","platform":"3","capacity":30},{"id":"demo-puerto-20261011-pm","date":"2026-10-11","time":"20:00","platform":"1","capacity":25}]'
          WHEN 'valparaiso' THEN '[{"id":"demo-valpo-20261009-am","date":"2026-10-09","time":"09:00","platform":"4","capacity":40},{"id":"demo-valpo-20261010-pm","date":"2026-10-10","time":"14:30","platform":"2","capacity":40}]'
          WHEN 'laserena' THEN '[{"id":"demo-serena-20261010-am","date":"2026-10-10","time":"07:15","platform":"5","capacity":35},{"id":"demo-serena-20261012-pm","date":"2026-10-12","time":"21:00","platform":"3","capacity":28}]'
          WHEN 'concepcion' THEN '[{"id":"demo-conce-20261011-am","date":"2026-10-11","time":"08:00","platform":"1","capacity":32}]'
          WHEN 'pichilemu' THEN '[{"id":"demo-pichi-20261012-am","date":"2026-10-12","time":"06:45","platform":"2","capacity":24}]'
        END
      ELSE schedules
    END
WHERE status = 'Activo'
  AND slug IN ('puertomontt', 'valparaiso', 'laserena', 'concepcion', 'pichilemu');
