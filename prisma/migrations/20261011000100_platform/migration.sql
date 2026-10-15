BEGIN;
ALTER TABLE users ADD COLUMN preferred_locale VARCHAR(2) NOT NULL DEFAULT 'ru';
ALTER TABLE regions ADD COLUMN name_kg VARCHAR(100), ADD COLUMN name_en VARCHAR(100);
ALTER TABLE amenities ADD COLUMN name_kg VARCHAR(100), ADD COLUMN name_en VARCHAR(100);
ALTER TABLE cabins
  ADD COLUMN title_kg VARCHAR(255), ADD COLUMN title_en VARCHAR(255),
  ADD COLUMN description_kg TEXT, ADD COLUMN description_en TEXT,
  ADD COLUMN check_in_time VARCHAR(5) NOT NULL DEFAULT '14:00',
  ADD COLUMN check_out_time VARCHAR(5) NOT NULL DEFAULT '11:00',
  ADD COLUMN cancellation_hours INTEGER NOT NULL DEFAULT 48,
  ADD COLUMN is_demo BOOLEAN NOT NULL DEFAULT false,
  ADD CONSTRAINT cabins_cancellation_hours_check CHECK (cancellation_hours BETWEEN 0 AND 720),
  ADD CONSTRAINT cabins_times_check CHECK (check_in_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND check_out_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');
ALTER TABLE bookings ADD COLUMN request_key VARCHAR(36), ADD COLUMN pricing_details JSONB, ADD COLUMN cancel_until TIMESTAMPTZ(3);
CREATE UNIQUE INDEX bookings_request_key_key ON bookings(request_key);
ALTER TABLE notifications ADD COLUMN data JSONB;
CREATE TABLE sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  expires_at TIMESTAMPTZ(3) NOT NULL,
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_expires_at_idx ON sessions(expires_at);
CREATE TABLE auth_throttles (key VARCHAR(64) PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 1, expires_at TIMESTAMPTZ(3) NOT NULL);
CREATE INDEX auth_throttles_expires_at_idx ON auth_throttles(expires_at);
CREATE TABLE site_settings (key VARCHAR(100) PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ(3) NOT NULL);
CREATE TABLE translations (id BIGSERIAL PRIMARY KEY, locale VARCHAR(2) NOT NULL, namespace VARCHAR(100) NOT NULL, key VARCHAR(255) NOT NULL, value TEXT NOT NULL, updated_at TIMESTAMPTZ(3) NOT NULL);
CREATE UNIQUE INDEX translations_locale_namespace_key_key ON translations(locale, namespace, key);
COMMIT;
