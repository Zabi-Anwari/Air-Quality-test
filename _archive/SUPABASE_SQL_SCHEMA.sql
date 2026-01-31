-- Air Quality Monitoring System - Database Schema for Supabase
-- Copy and paste this entire script into your Supabase SQL Editor

-- ============================================================================
-- CLEANUP: Drop existing tables (if any) to start fresh
-- ============================================================================
DROP TABLE IF EXISTS forecasts CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS aqi_calculations CASCADE;
DROP TABLE IF EXISTS sensor_readings CASCADE;
DROP TABLE IF EXISTS sensor_health CASCADE;
DROP TABLE IF EXISTS sensors CASCADE;

-- ============================================================================
-- 1. SENSORS TABLE - Store sensor metadata and configuration
-- ============================================================================
CREATE TABLE sensors (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  location_name VARCHAR(255),
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  sensor_type VARCHAR(50) DEFAULT 'PM2.5/PM10',
  manufacturer VARCHAR(100),
  installation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_reading_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for common queries
CREATE INDEX idx_sensors_city ON sensors(city);
CREATE INDEX idx_sensors_active ON sensors(is_active);
CREATE INDEX idx_sensors_device_id ON sensors(device_id);

-- ============================================================================
-- 2. SENSOR READINGS TABLE - Store raw pollution measurements
-- ============================================================================
CREATE TABLE sensor_readings (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  pm25 DECIMAL(8, 2),
  pm10 DECIMAL(8, 2),
  no2 DECIMAL(8, 2),
  co DECIMAL(8, 2),
  o3 DECIMAL(8, 2),
  so2 DECIMAL(8, 2),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  pressure DECIMAL(8, 2),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time-series indexes for efficient querying
CREATE INDEX idx_sensor_readings_sensor_time ON sensor_readings(sensor_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);

-- ============================================================================
-- 3. AQI CALCULATIONS TABLE - Store computed AQI values
-- ============================================================================
CREATE TABLE aqi_calculations (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  aqi_overall INTEGER NOT NULL,
  pm25_aqi INTEGER,
  pm10_aqi INTEGER,
  no2_aqi INTEGER,
  co_aqi INTEGER,
  o3_aqi INTEGER,
  so2_aqi INTEGER,
  dominant_pollutant VARCHAR(50),
  health_implication VARCHAR(100),
  recommendation TEXT,
  color_code VARCHAR(7),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time-series indexes
CREATE INDEX idx_aqi_calculations_sensor_time ON aqi_calculations(sensor_id, timestamp DESC);
CREATE INDEX idx_aqi_calculations_timestamp ON aqi_calculations(timestamp DESC);
CREATE INDEX idx_aqi_calculations_aqi ON aqi_calculations(aqi_overall);

-- ============================================================================
-- 4. ALERTS TABLE - Store real-time air quality alerts
-- ============================================================================
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  aqi_value INTEGER,
  pollutant_name VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  acknowledged_at TIMESTAMP
);

-- Indexes for alert queries
CREATE INDEX idx_alerts_sensor_active ON alerts(sensor_id, is_active);
CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- ============================================================================
-- 5. FORECASTS TABLE - Store AQI predictions
-- ============================================================================
CREATE TABLE forecasts (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  forecast_hour INTEGER NOT NULL,
  predicted_aqi INTEGER NOT NULL,
  confidence DECIMAL(3, 2) NOT NULL,
  model_version VARCHAR(50) DEFAULT '1.0',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_at TIMESTAMP NOT NULL
);

-- Indexes for forecast queries
CREATE INDEX idx_forecasts_sensor_valid ON forecasts(sensor_id, valid_at DESC);
CREATE INDEX idx_forecasts_valid_at ON forecasts(valid_at DESC);
CREATE INDEX idx_forecasts_created_at ON forecasts(created_at DESC);

-- ============================================================================
-- 6. SENSOR HEALTH TABLE - Monitor sensor status and connectivity
-- ============================================================================
CREATE TABLE sensor_health (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL UNIQUE REFERENCES sensors(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  last_reading_at TIMESTAMP,
  last_check_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_count INTEGER DEFAULT 0,
  consecutive_failures INTEGER DEFAULT 0,
  health_score DECIMAL(5, 2) DEFAULT 100.0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for health queries
CREATE INDEX idx_sensor_health_status ON sensor_health(status);
CREATE INDEX idx_sensor_health_sensor_id ON sensor_health(sensor_id);

-- ============================================================================
-- SAMPLE DATA - Insert test sensors
-- ============================================================================
INSERT INTO sensors (device_id, name, location_name, latitude, longitude, city, country, is_active)
VALUES
  ('SENSOR_ALM_001', 'Almaty Downtown', 'Republic Square', 43.2381, 76.9453, 'Almaty', 'Kazakhstan', TRUE),
  ('SENSOR_ALM_002', 'Almaty Airport', 'Near Airport', 43.4377, 77.4036, 'Almaty', 'Kazakhstan', TRUE),
  ('SENSOR_ALM_003', 'Almaty Hills', 'Assy Plateau', 43.1598, 77.0309, 'Almaty', 'Kazakhstan', TRUE),
  ('SENSOR_BEI_001', 'Beijing CBD', 'Chaoyang District', 39.9042, 116.4074, 'Beijing', 'China', TRUE),
  ('SENSOR_NYC_001', 'New York Manhattan', 'Times Square', 40.7580, -73.9855, 'New York', 'USA', TRUE);

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
