/**
 * Sensor Health Monitor Service
 * Tracks sensor status and data freshness
 * Monitors for offline, stale, or error states
 */

import { query } from '../db/index';
import { SensorHealthRow } from '../db/schema';

export type SensorStatus = 'active' | 'stale' | 'offline' | 'error';

/**
 * Update sensor health status
 */
export async function updateSensorHealth(
  sensor_id: number,
  status: SensorStatus,
  errorCount: number = 0
): Promise<SensorHealthRow> {
  const result = await query<SensorHealthRow>(
    `INSERT INTO sensor_health (sensor_id, status, error_count, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (sensor_id) DO UPDATE SET
       status = $2,
       error_count = $3,
       updated_at = NOW()
     RETURNING *`,
    [sensor_id, status, errorCount]
  );
  return result.rows[0];
}

/**
 * Check and update sensor health status based on latest readings
 */
export async function checkSensorHealth(sensor_id: number, staleThresholdMinutes: number = 15): Promise<SensorStatus> {
  try {
    // Get last reading timestamp
    const result = await query<{ last_reading: string | null }>(
      `SELECT MAX(timestamp) as last_reading FROM sensor_readings WHERE sensor_id = $1`,
      [sensor_id]
    );

    if (!result.rows[0] || !result.rows[0].last_reading) {
      await updateSensorHealth(sensor_id, 'offline', 1);
      return 'offline';
    }

    const lastReadingTime = new Date(result.rows[0].last_reading);
    const minutesSinceReading = (Date.now() - lastReadingTime.getTime()) / (1000 * 60);

    let status: SensorStatus = 'active';

    if (minutesSinceReading > staleThresholdMinutes * 2) {
      status = 'offline';
    } else if (minutesSinceReading > staleThresholdMinutes) {
      status = 'stale';
    }

    await updateSensorHealth(sensor_id, status, 0);
    return status;
  } catch (error) {
    console.error(`Error checking sensor health for sensor ${sensor_id}:`, error);
    await updateSensorHealth(sensor_id, 'error', 1);
    return 'error';
  }
}

/**
 * Get health status for a sensor
 */
export async function getSensorHealth(sensor_id: number): Promise<SensorHealthRow | null> {
  const result = await query<SensorHealthRow>(
    `SELECT * FROM sensor_health WHERE sensor_id = $1`,
    [sensor_id]
  );
  return result.rows[0] || null;
}

/**
 * Get health status for all sensors
 */
export async function getAllSensorHealth(): Promise<SensorHealthRow[]> {
  const result = await query<SensorHealthRow>(
    `SELECT * FROM sensor_health ORDER BY status DESC, updated_at DESC`
  );
  return result.rows;
}

/**
 * Get count of sensors by status
 */
export async function getSensorHealthSummary(): Promise<Record<SensorStatus, number>> {
  const result = await query<{ status: SensorStatus; count: string }>(
    `SELECT status, COUNT(*) as count FROM sensor_health GROUP BY status`
  );

  const summary: Record<SensorStatus, number> = {
    active: 0,
    stale: 0,
    offline: 0,
    error: 0,
  };

  for (const row of result.rows) {
    const status = row.status as SensorStatus;
    summary[status] = parseInt(row.count);
  }

  return summary;
}

/**
 * Check health for all sensors
 */
export async function checkAllSensorHealth(staleThresholdMinutes: number = 15): Promise<void> {
  try {
    // Get all sensors
    const sensorsResult = await query<{ id: number }>(
      `SELECT id FROM sensors WHERE is_active = true`
    );

    for (const sensor of sensorsResult.rows) {
      await checkSensorHealth(sensor.id, staleThresholdMinutes);
    }

    console.log(`Health check completed for ${sensorsResult.rows.length} sensors`);
  } catch (error) {
    console.error('Error checking all sensor health:', error);
  }
}
