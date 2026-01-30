export type SensorRow = {
  id: number;
  device_id: string;
  name: string;
  location_name: string | null;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  is_active: boolean;
  created_at: string;
};

export type SensorReadingRow = {
  id: number;
  sensor_id: number;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  co2: number | null;
  voc: number | null;
  temp: number | null;
  hum: number | null;
  ch2o: number | null;
  co: number | null;
  o3: number | null;
  no2: number | null;
  timestamp: string;
};

export type AqiCalculationRow = {
  id: number;
  sensor_id: number;
  aqi_overall: number;
  pm25_aqi: number | null;
  pm10_aqi: number | null;
  no2_aqi: number | null;
  co_aqi: number | null;
  o3_aqi: number | null;
  so2_aqi: number | null;
  dominant_pollutant: string | null;
  timestamp: string;
};

export type AlertRow = {
  id: number;
  sensor_id: number;
  alert_type: 'threshold' | 'spike' | 'sensor_health';
  aqi_level: number | null;
  pollutant: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  is_active: boolean;
  created_at: string;
  resolved_at: string | null;
};

export type ForecastRow = {
  id: number;
  sensor_id: number;
  forecast_hour: number;
  predicted_aqi: number;
  confidence: number | null;
  model_version: string | null;
  created_at: string;
  valid_at: string;
};

export type SensorHealthRow = {
  id: number;
  sensor_id: number;
  last_reading_at: string | null;
  status: 'active' | 'stale' | 'offline' | 'error';
  error_count: number;
  updated_at: string;
};

export const createSensorsTable = `
CREATE TABLE IF NOT EXISTS sensors (
  id SERIAL PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  site TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export const createSensorReadingsTable = `
CREATE TABLE IF NOT EXISTS sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  pm1 DOUBLE PRECISION,
  pm25 DOUBLE PRECISION,
  pm10 DOUBLE PRECISION,
  co2 DOUBLE PRECISION,
  voc DOUBLE PRECISION,
  temp DOUBLE PRECISION,
  hum DOUBLE PRECISION,
  ch2o DOUBLE PRECISION,
  co DOUBLE PRECISION,
  o3 DOUBLE PRECISION,
  no2 DOUBLE PRECISION,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export const createAqiCalculationsTable = `
CREATE TABLE IF NOT EXISTS aqi_calculations (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  aqi_overall INTEGER NOT NULL,
  pm25_aqi INTEGER,
  pm10_aqi INTEGER,
  no2_aqi INTEGER,
  co_aqi INTEGER,
  o3_aqi INTEGER,
  so2_aqi INTEGER,
  dominant_pollutant TEXT,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export const createAlertsTable = `
CREATE TABLE IF NOT EXISTS alerts (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('threshold', 'spike', 'sensor_health')),
  aqi_level INTEGER,
  pollutant TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
`;

export const createForecastsTable = `
CREATE TABLE IF NOT EXISTS forecasts (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  forecast_hour INTEGER NOT NULL,
  predicted_aqi INTEGER NOT NULL,
  confidence DOUBLE PRECISION,
  model_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_at TIMESTAMPTZ NOT NULL
);
`;

export const createSensorHealthTable = `
CREATE TABLE IF NOT EXISTS sensor_health (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  last_reading_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('active', 'stale', 'offline', 'error')),
  error_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export const createIndexes = `
CREATE INDEX IF NOT EXISTS idx_sensors_device_id ON sensors(device_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_time ON sensor_readings(sensor_id, "timestamp" DESC);
CREATE INDEX IF NOT EXISTS idx_aqi_calculations_sensor_time ON aqi_calculations(sensor_id, "timestamp" DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_sensor_active ON alerts(sensor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forecasts_sensor_valid ON forecasts(sensor_id, valid_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_health_status ON sensor_health(status);
`;

export const migrations: string[] = [
  createSensorsTable,
  createSensorReadingsTable,
  createAqiCalculationsTable,
  createAlertsTable,
  createForecastsTable,
  createSensorHealthTable,
  createIndexes,
];
