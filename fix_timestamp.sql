ALTER TABLE token_recuperacion ALTER COLUMN "fechaExpiracion" TYPE timestamptz USING "fechaExpiracion" AT TIME ZONE 'UTC';
