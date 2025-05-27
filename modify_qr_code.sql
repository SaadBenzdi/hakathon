-- Modifier la colonne qr_code pour utiliser TEXT au lieu de VARCHAR(255)
ALTER TABLE users MODIFY COLUMN qr_code TEXT;
