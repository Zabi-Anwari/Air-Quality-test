/**
 * Alert Service
 * Manages alert creation, evaluation, and resolution
 * Detects AQI thresholds, pollution spikes, and sensor health issues
 */

import { query } from '../db/index';
import { AlertRow } from '../db/schema';

export interface AlertConfig {
  thresholdCritical: number; // AQI > 200
  thresholdHigh: number; // AQI > 150
  spikeThreshold: number; // % increase in AQI
  staleDataMinutes: number; // Minutes before marking sensor stale
}

export const defaultAlertConfig: AlertConfig = {
  thresholdCritical: 200,
  thresholdHigh: 150,
  spikeThreshold: 25, // 25% spike
  staleDataMinutes: 15,
};

/**
 * Create a new alert in the database
 */
export const createAlert = async (
  sensor_id: number,
  alert_type: 'threshold' | 'spike' | 'sensor_health',
  severity: 'low' | 'medium' | 'high' | 'critical',
  message: string,
  aqi_level?: number,
  pollutant?: string
): Promise<AlertRow> => {
  const result = await query<AlertRow>(
    `INSERT INTO alerts 
     (sensor_id, alert_type, severity, message, aqi_level, pollutant, is_active, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
     RETURNING *`,
    [sensor_id, alert_type, severity, message, aqi_level || null, pollutant || null]
  );
  return result.rows[0];
};

/**
 * Get active alerts for a sensor
 */
export const getActiveAlerts = async (sensor_id?: number): Promise<AlertRow[]> => {
  const filterClause = sensor_id ? 'WHERE sensor_id = $1 AND is_active = true' : 'WHERE is_active = true';
  const params = sensor_id ? [sensor_id] : [];

  const result = await query<AlertRow>(
    `SELECT * FROM alerts ${filterClause} ORDER BY created_at DESC LIMIT 100`,
    params
  );
  return result.rows;
};

/**
 * Get all alerts with optional time filter
 */
export const getAlerts = async (
  sensor_id?: number,
  hoursBack: number = 24
): Promise<AlertRow[]> => {
  let filterClause = `WHERE created_at > NOW() - INTERVAL '${hoursBack} hours'`;
  const params: any[] = [];

  if (sensor_id) {
    filterClause += ` AND sensor_id = $${params.length + 1}`;
    params.push(sensor_id);
  }

  const result = await query<AlertRow>(
    `SELECT * FROM alerts ${filterClause} ORDER BY created_at DESC`,
    params
  );
  return result.rows;
};

/**
 * Resolve an alert
 */
export const resolveAlert = async (alert_id: number): Promise<AlertRow> => {
  const result = await query<AlertRow>(
    `UPDATE alerts SET is_active = false, resolved_at = NOW() WHERE id = $1 RETURNING *`,
    [alert_id]
  );
  return result.rows[0];
};

/**
 * Evaluate if AQI crosses threshold
 */
export const checkAQIThreshold = async (
  sensor_id: number,
  current_aqi: number,
  config: AlertConfig = defaultAlertConfig
): Promise<void> => {
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let shouldAlert = false;
  let message = '';

  if (current_aqi >= config.thresholdCritical) {
    severity = 'critical';
    shouldAlert = true;
    message = `CRITICAL: AQI has reached ${current_aqi} - Air quality is hazardous`;
  } else if (current_aqi >= config.thresholdHigh) {
    severity = 'high';
    shouldAlert = true;
    message = `WARNING: AQI has reached ${current_aqi} - Air quality is unhealthy`;
  }

  if (shouldAlert) {
    // Check if alert already exists
    const existing = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM alerts 
       WHERE sensor_id = $1 AND is_active = true AND alert_type = 'threshold'`,
      [sensor_id]
    );

    if (parseInt(existing.rows[0].count) === 0) {
      await createAlert(sensor_id, 'threshold', severity, message, current_aqi);
    }
  }
};

/**
 * Detect sudden pollution spikes
 */
export const checkPollutionSpike = async (
  sensor_id: number,
  current_aqi: number,
  config: AlertConfig = defaultAlertConfig
): Promise<void> => {
  // Get previous AQI reading from 15 minutes ago
  const result = await query<{ aqi: number }>(
    `SELECT aqi_overall as aqi FROM aqi_calculations 
     WHERE sensor_id = $1 AND timestamp > NOW() - INTERVAL '20 minutes'
     ORDER BY timestamp DESC LIMIT 2`,
    [sensor_id]
  );

  if (result.rows.length >= 2) {
    const previousAqi = result.rows[1].aqi;
    const percentageChange = ((current_aqi - previousAqi) / previousAqi) * 100;

    if (percentageChange > config.spikeThreshold) {
      const message = `POLLUTION SPIKE: AQI increased by ${percentageChange.toFixed(1)}% (from ${previousAqi} to ${current_aqi})`;
      await createAlert(sensor_id, 'spike', 'high', message, current_aqi);
    }
  }
};

/**
 * Check sensor health status
 */
export const checkSensorHealth = async (
  sensor_id: number,
  config: AlertConfig = defaultAlertConfig
): Promise<void> => {
  const result = await query<{ last_reading: string }>(
    `SELECT MAX(timestamp) as last_reading FROM sensor_readings WHERE sensor_id = $1`,
    [sensor_id]
  );

  if (result.rows.length > 0) {
    const lastReading = result.rows[0].last_reading;
    if (!lastReading) {
      await createAlert(
        sensor_id,
        'sensor_health',
        'critical',
        'No readings received from sensor',
        undefined,
        undefined
      );
      return;
    }

    const lastReadingTime = new Date(lastReading);
    const now = new Date();
    const minutesSinceReading = (now.getTime() - lastReadingTime.getTime()) / (1000 * 60);

    if (minutesSinceReading > config.staleDataMinutes) {
      const severity = minutesSinceReading > config.staleDataMinutes * 2 ? 'critical' : 'medium';
      const message = `Sensor offline: No reading for ${Math.round(minutesSinceReading)} minutes`;
      await createAlert(sensor_id, 'sensor_health', severity, message, undefined, undefined);
    }
  }
};

/**
 * Auto-resolve thresholds when AQI improves
 */
export const autoResolveThresholdAlerts = async (sensor_id: number, current_aqi: number): Promise<void> => {
  // Resolve threshold alerts if AQI drops below threshold + buffer
  const result = await query<AlertRow>(
    `SELECT * FROM alerts 
     WHERE sensor_id = $1 AND is_active = true AND alert_type = 'threshold'`,
    [sensor_id]
  );

  for (const alert of result.rows) {
    if (current_aqi < defaultAlertConfig.thresholdHigh - 20) {
      await resolveAlert(alert.id);
    }
  }
};
