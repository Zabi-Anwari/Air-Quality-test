-- ============================================================================
-- Air Quality Monitoring System - Complete Database Schema
-- New Supabase Project: vrqeciwyibzrdqztcnou
-- Created: 2026-01-28
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SENSORS TABLE - Store sensor metadata and configuration
-- ============================================================================
DROP TABLE IF EXISTS sensors CASCADE;

CREATE TABLE sensors (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  location_name VARCHAR(255),
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  sensor_type VARCHAR(50) DEFAULT 'air-quality',
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  installation_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  last_heartbeat TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for sensors
CREATE INDEX idx_sensors_city ON sensors(city);
CREATE INDEX idx_sensors_device_id ON sensors(device_id);
CREATE INDEX idx_sensors_is_active ON sensors(is_active);

-- Insert Almaty region sensors (20 total: urban + rural)
INSERT INTO sensors (device_id, name, location_name, latitude, longitude, city, country, is_active, last_heartbeat)
VALUES 
  ('ALM_URB_001','Almaty Downtown','Republic Square',43.2381,76.9453,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_002','Almaty Medeu','Medeu District',43.2090,76.9580,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_003','Almaty Auezov','Auezov District',43.2300,76.8700,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_004','Almaty Bostandyk','Bostandyk District',43.2000,76.9000,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_005','Almaty Almaly','Almaly District',43.2500,76.9400,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_006','Almaty Turksib','Turksib District',43.3500,76.9500,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_007','Almaty Zhetysu','Zhetysu District',43.2700,76.9000,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_008','Almaty Nauryzbay','Nauryzbay District',43.1900,76.8200,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_009','Almaty Alatau','Alatau District',43.3000,76.8000,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_URB_010','Almaty Airport','Airport Area',43.3520,77.0430,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_RUR_011','Talgar','Talgar',43.3000,77.2400,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_012','Kaskelen','Kaskelen',43.2000,76.6200,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_013','Boraldai','Boraldai',43.3600,76.8600,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_014','Otegen Batyr','Gres/Otegen Batyr',43.4200,77.0200,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_015','Shymbulak','Shymbulak Resort',43.1200,77.0800,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_RUR_016','Medeu Gorge','Medeu Gorge',43.1500,77.0500,'Almaty','Kazakhstan',true,NOW()),
  ('ALM_RUR_017','Esik','Esik',43.3500,77.4500,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_018','Uzynagash','Uzynagash',43.2100,76.3200,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_019','Konayev','Konayev',43.8700,77.0600,'Almaty Region','Kazakhstan',true,NOW()),
  ('ALM_RUR_020','Kapchagay','Kapchagay',43.8500,77.0800,'Almaty Region','Kazakhstan',true,NOW());

-- ============================================================================
-- 2. SENSOR_READINGS TABLE - Store raw pollution measurements (time-series)
-- ============================================================================
DROP TABLE IF EXISTS sensor_readings CASCADE;

CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  pm25 FLOAT,
  pm10 FLOAT,
  no2 FLOAT,
  co FLOAT,
  o3 FLOAT,
  so2 FLOAT,
  temperature FLOAT,
  humidity FLOAT,
  pressure FLOAT,
  wind_speed FLOAT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast time-series queries
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_sensor_readings_composite ON sensor_readings(sensor_id, timestamp DESC);

-- Insert sample readings
INSERT INTO sensor_readings (sensor_id, pm25, pm10, no2, co, o3, so2, temperature, humidity, pressure, wind_speed, timestamp)
SELECT 
  s.id,
  FLOOR(RANDOM() * 200 + 20)::FLOAT,
  FLOOR(RANDOM() * 300 + 30)::FLOAT,
  FLOOR(RANDOM() * 100 + 10)::FLOAT,
  FLOOR(RANDOM() * 5 + 0.5)::FLOAT,
  FLOOR(RANDOM() * 80 + 10)::FLOAT,
  FLOOR(RANDOM() * 30 + 5)::FLOAT,
  FLOOR(RANDOM() * 15 + 10)::FLOAT,
  FLOOR(RANDOM() * 40 + 30)::FLOAT,
  FLOOR(RANDOM() * 50 + 950)::FLOAT,
  FLOOR(RANDOM() * 10 + 2)::FLOAT,
  NOW() - INTERVAL '1 hour'
FROM sensors s
CROSS JOIN generate_series(1, 3);

-- ============================================================================
-- 3. AQI_CALCULATIONS TABLE - Store computed AQI values
-- ============================================================================
DROP TABLE IF EXISTS aqi_calculations CASCADE;

CREATE TABLE aqi_calculations (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  aqi_overall INTEGER NOT NULL,
  pm25_aqi INTEGER,
  pm10_aqi INTEGER,
  no2_aqi INTEGER,
  co_aqi INTEGER,
  o3_aqi INTEGER,
  so2_aqi INTEGER,
  dominant_pollutant VARCHAR(50),
  health_implication VARCHAR(255),
  aqi_category VARCHAR(50),
  color_code VARCHAR(7),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for AQI queries
CREATE INDEX idx_aqi_sensor_id ON aqi_calculations(sensor_id);
CREATE INDEX idx_aqi_timestamp ON aqi_calculations(timestamp DESC);
CREATE INDEX idx_aqi_overall ON aqi_calculations(aqi_overall);
CREATE INDEX idx_aqi_composite ON aqi_calculations(sensor_id, timestamp DESC);

-- Insert sample AQI calculations
INSERT INTO aqi_calculations (sensor_id, aqi_overall, pm25_aqi, pm10_aqi, no2_aqi, co_aqi, o3_aqi, so2_aqi, dominant_pollutant, health_implication, aqi_category, color_code, timestamp)
SELECT 
  s.id,
  FLOOR(RANDOM() * 200 + 20)::INTEGER,
  FLOOR(RANDOM() * 150 + 10)::INTEGER,
  FLOOR(RANDOM() * 180 + 20)::INTEGER,
  FLOOR(RANDOM() * 100 + 5)::INTEGER,
  FLOOR(RANDOM() * 80 + 5)::INTEGER,
  FLOOR(RANDOM() * 100 + 10)::INTEGER,
  FLOOR(RANDOM() * 60 + 5)::INTEGER,
  CASE FLOOR(RANDOM() * 6) WHEN 0 THEN 'PM2.5' WHEN 1 THEN 'PM10' WHEN 2 THEN 'NO2' WHEN 3 THEN 'CO' WHEN 4 THEN 'O3' ELSE 'SO2' END,
  CASE WHEN FLOOR(RANDOM() * 200 + 20) > 150 THEN 'Unhealthy' ELSE 'Moderate' END,
  CASE WHEN FLOOR(RANDOM() * 200 + 20) > 200 THEN 'Hazardous' WHEN FLOOR(RANDOM() * 200 + 20) > 150 THEN 'Unhealthy' ELSE 'Moderate' END,
  CASE WHEN FLOOR(RANDOM() * 200 + 20) > 150 THEN '#ff6b6b' ELSE '#ffd43b' END,
  NOW() - INTERVAL '30 minutes'
FROM sensors s;

-- ============================================================================
-- 4. ALERTS TABLE - Store real-time air quality alerts
-- ============================================================================
DROP TABLE IF EXISTS alerts CASCADE;

CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'threshold', 'spike', 'sensor_health'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  message TEXT NOT NULL,
  aqi_value INTEGER,
  threshold_breached VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(100)
);

-- Indexes for alerts
CREATE INDEX idx_alerts_sensor_id ON alerts(sensor_id);
CREATE INDEX idx_alerts_is_active ON alerts(is_active);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- Insert sample alerts
INSERT INTO alerts (sensor_id, alert_type, severity, message, aqi_value, threshold_breached, is_active, created_at)
SELECT 
  s.id,
  CASE FLOOR(RANDOM() * 3) WHEN 0 THEN 'threshold' WHEN 1 THEN 'spike' ELSE 'sensor_health' END,
  CASE FLOOR(RANDOM() * 4) WHEN 0 THEN 'low' WHEN 1 THEN 'medium' WHEN 2 THEN 'high' ELSE 'critical' END,
  'Air quality alert generated for sensor ' || s.device_id,
  FLOOR(RANDOM() * 200 + 50)::INTEGER,
  CASE FLOOR(RANDOM() * 3) WHEN 0 THEN 'PM2.5' WHEN 1 THEN 'PM10' ELSE 'NO2' END,
  true,
  NOW() - INTERVAL '2 hours'
FROM sensors s
LIMIT 3;

-- ============================================================================
-- 5. FORECASTS TABLE - Store AQI predictions
-- ============================================================================
DROP TABLE IF EXISTS forecasts CASCADE;

CREATE TABLE forecasts (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  forecast_hour INTEGER NOT NULL,
  predicted_aqi INTEGER NOT NULL,
  confidence FLOAT NOT NULL DEFAULT 0.75,
  valid_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sensor_id, forecast_hour, valid_at)
);

-- Indexes for forecasts
CREATE INDEX idx_forecasts_sensor_id ON forecasts(sensor_id);
CREATE INDEX idx_forecasts_valid_at ON forecasts(valid_at);
CREATE INDEX idx_forecasts_created_at ON forecasts(created_at DESC);
CREATE INDEX idx_forecasts_composite ON forecasts(sensor_id, valid_at);

-- Insert sample forecasts (6 hours ahead for each sensor)
INSERT INTO forecasts (sensor_id, forecast_hour, predicted_aqi, confidence, valid_at)
SELECT 
  s.id,
  hour,
  FLOOR(RANDOM() * 200 + 20)::INTEGER,
  0.7 + RANDOM() * 0.25,
  NOW() + (hour || ' hours')::INTERVAL
FROM sensors s
CROSS JOIN generate_series(1, 6) AS hour_data(hour);

-- ============================================================================
-- 6. SENSOR_HEALTH TABLE - Monitor sensor operational status
-- ============================================================================
DROP TABLE IF EXISTS sensor_health CASCADE;

CREATE TABLE sensor_health (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  health_score INTEGER DEFAULT 100,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'stale', 'offline', 'error'
  last_reading_time TIMESTAMP,
  battery_level FLOAT,
  error_count INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  uptime_percentage FLOAT DEFAULT 100,
  last_checked TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for sensor health
CREATE INDEX idx_sensor_health_sensor_id ON sensor_health(sensor_id);
CREATE INDEX idx_sensor_health_status ON sensor_health(status);
CREATE INDEX idx_sensor_health_last_checked ON sensor_health(last_checked DESC);

-- Insert sample health data
INSERT INTO sensor_health (sensor_id, health_score, status, last_reading_time, battery_level, error_count, warning_count, uptime_percentage)
SELECT 
  s.id,
  FLOOR(RANDOM() * 30 + 70)::INTEGER,
  CASE FLOOR(RANDOM() * 3) WHEN 0 THEN 'active' WHEN 1 THEN 'stale' ELSE 'offline' END,
  NOW() - INTERVAL '30 minutes',
  FLOOR(RANDOM() * 40 + 60)::FLOAT,
  FLOOR(RANDOM() * 5)::INTEGER,
  FLOOR(RANDOM() * 10)::INTEGER,
  90 + RANDOM() * 10
FROM sensors s;

-- ============================================================================
-- VIEWS - For easier data retrieval
-- ============================================================================

-- Current AQI status for all sensors
CREATE OR REPLACE VIEW v_current_aqi AS
SELECT 
  s.id,
  s.device_id,
  s.name,
  s.city,
  s.latitude,
  s.longitude,
  sr.pm25,
  sr.pm10,
  sr.no2,
  sr.co,
  sr.o3,
  sr.so2,
  ac.aqi_overall,
  ac.aqi_category,
  ac.dominant_pollutant,
  ac.color_code,
  ac.timestamp as aqi_timestamp,
  sr.timestamp as reading_timestamp
FROM sensors s
LEFT JOIN sensor_readings sr ON s.id = sr.sensor_id AND sr.timestamp = (
  SELECT MAX(timestamp) FROM sensor_readings WHERE sensor_id = s.id
)
LEFT JOIN aqi_calculations ac ON s.id = ac.sensor_id AND ac.timestamp = (
  SELECT MAX(timestamp) FROM aqi_calculations WHERE sensor_id = s.id
)
WHERE s.is_active = true;

-- Active alerts
CREATE OR REPLACE VIEW v_active_alerts AS
SELECT 
  a.id,
  a.sensor_id,
  s.device_id,
  s.name,
  s.city,
  a.alert_type,
  a.severity,
  a.message,
  a.aqi_value,
  a.created_at,
  a.is_active
FROM alerts a
JOIN sensors s ON a.sensor_id = s.id
WHERE a.is_active = true
ORDER BY a.created_at DESC;

-- Sensor health summary
CREATE OR REPLACE VIEW v_sensor_health_summary AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'active') as active_sensors,
  COUNT(*) FILTER (WHERE status = 'stale') as stale_sensors,
  COUNT(*) FILTER (WHERE status = 'offline') as offline_sensors,
  COUNT(*) FILTER (WHERE status = 'error') as error_sensors,
  ROUND(AVG(health_score), 2) as avg_health_score,
  MIN(last_checked) as oldest_check,
  MAX(last_checked) as newest_check
FROM sensor_health;

-- ============================================================================
-- FUNCTIONS - For common operations
-- ============================================================================

-- Function to get AQI category from value
CREATE OR REPLACE FUNCTION get_aqi_category(aqi_value INTEGER)
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN CASE
    WHEN aqi_value <= 50 THEN 'Good'
    WHEN aqi_value <= 100 THEN 'Moderate'
    WHEN aqi_value <= 150 THEN 'Unhealthy for Sensitive Groups'
    WHEN aqi_value <= 200 THEN 'Unhealthy'
    WHEN aqi_value <= 300 THEN 'Very Unhealthy'
    ELSE 'Hazardous'
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to get color code from AQI value
CREATE OR REPLACE FUNCTION get_aqi_color(aqi_value INTEGER)
RETURNS VARCHAR(7) AS $$
BEGIN
  RETURN CASE
    WHEN aqi_value <= 50 THEN '#00E400'
    WHEN aqi_value <= 100 THEN '#FFFF00'
    WHEN aqi_value <= 150 THEN '#FF7E00'
    WHEN aqi_value <= 200 THEN '#FF0000'
    WHEN aqi_value <= 300 THEN '#8F3F97'
    ELSE '#7E0023'
  END;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PERMISSIONS - For security (optional - adjust based on your needs)
-- ============================================================================

-- Grant read access to public role (adjust as needed)
GRANT SELECT ON sensors TO anon, authenticated;
GRANT SELECT ON sensor_readings TO anon, authenticated;
GRANT SELECT ON aqi_calculations TO anon, authenticated;
GRANT SELECT ON alerts TO anon, authenticated;
GRANT SELECT ON forecasts TO anon, authenticated;
GRANT SELECT ON sensor_health TO anon, authenticated;
GRANT SELECT ON v_current_aqi TO anon, authenticated;
GRANT SELECT ON v_active_alerts TO anon, authenticated;
GRANT SELECT ON v_sensor_health_summary TO anon, authenticated;

-- Grant write access to authenticated role for inserts
GRANT INSERT ON sensor_readings TO authenticated;
GRANT INSERT ON aqi_calculations TO authenticated;
GRANT INSERT ON alerts TO authenticated;
GRANT INSERT ON forecasts TO authenticated;
GRANT INSERT ON sensor_health TO authenticated;

-- ============================================================================
-- COMPLETE! 
-- Tables: 6 (sensors, sensor_readings, aqi_calculations, alerts, forecasts, sensor_health)
-- Views: 3 (current AQI, active alerts, health summary)
-- Functions: 2 (get category, get color)
-- Indexes: 15+
-- Sample Data: ✅ Populated
-- ============================================================================
