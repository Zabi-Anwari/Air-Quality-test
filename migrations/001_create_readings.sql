-- migrations/001_create_readings.sql
CREATE TABLE IF NOT EXISTS readings (
  id SERIAL PRIMARY KEY,
  device_id TEXT,
  site TEXT,
  pm1 DOUBLE PRECISION,
  pm25 DOUBLE PRECISION,
  pm10 DOUBLE PRECISION,
  co2 INTEGER,
  voc DOUBLE PRECISION,
  temp DOUBLE PRECISION,
  hum DOUBLE PRECISION,
  ch2o DOUBLE PRECISION,
  co DOUBLE PRECISION,
  o3 DOUBLE PRECISION,
  no2 DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_device ON readings (device_id);
