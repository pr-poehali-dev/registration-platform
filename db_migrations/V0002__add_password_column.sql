-- Добавление колонки для хранения пароля в открытом виде
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);