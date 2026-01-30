import { query } from './db/index';
import { SensorRow } from './db/schema';

type LatestSensorRow = SensorRow & {
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
  recorded_at: string | null;
};

export type LatestSensorWithReading = SensorRow & {
  reading: {
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
    recorded_at: string;
  } | null;
};

export const getSensors = async (deviceIds?: string[]): Promise<SensorRow[]> => {
  const hasFilter = Array.isArray(deviceIds) && deviceIds.length > 0;
  const filterClause = hasFilter ? 'WHERE device_id = ANY($1)' : '';
  const params = hasFilter ? [deviceIds] : [];

  const result = await query<SensorRow>(
    `SELECT id, device_id, name, location_name, latitude, longitude, city, country, is_active, created_at
     FROM sensors
     ${filterClause}
     ORDER BY device_id ASC`,
    params,
  );

  return result.rows;
};

export const getLatestReadingsByDeviceIds = async (deviceIds?: string[]): Promise<LatestSensorWithReading[]> => {
  const hasFilter = Array.isArray(deviceIds) && deviceIds.length > 0;
  const filterClause = hasFilter ? 'WHERE s.device_id = ANY($1)' : '';
  const params = hasFilter ? [deviceIds] : [];

  const sql = `
    SELECT
      s.id AS id,
      s.id AS id,
      s.device_id,
      s.name,
      s.location_name,
      s.latitude,
      s.longitude,
      s.city,
      s.country,
      s.is_active,
      s.created_at,
      latest.pm1,
      latest.pm25,
      latest.pm10,
      latest.co2,
      latest.voc,
      latest.temp,
      latest.hum,
      latest.ch2o,
      latest.co,
      latest.o3,
      latest.no2,
      latest.timestamp AS recorded_at
    FROM sensors s
    LEFT JOIN LATERAL (
      SELECT
        sr.pm1,
        sr.pm25,
        sr.pm10,
        sr.co2,
        sr.voc,
        sr.temp,
        sr.hum,
        sr.ch2o,
        sr.co,
        sr.o3,
        sr.no2,
        sr."timestamp"
      FROM sensor_readings sr
      WHERE sr.sensor_id = s.id
      ORDER BY sr."timestamp" DESC
      LIMIT 1
    ) AS latest ON TRUE
    ${filterClause}
    ORDER BY s.device_id ASC;
  `;

  const result = await query<LatestSensorRow>(sql, params);

  return result.rows.map((row) => ({
    id: row.id,
    device_id: row.device_id,
    name: row.name,
    location_name: row.location_name,
    latitude: row.latitude,
    longitude: row.longitude,
    city: row.city,
    country: row.country,
    is_active: row.is_active,
    created_at: row.created_at,
    reading: row.recorded_at
      ? {
        pm1: row.pm1,
        pm25: row.pm25,
        pm10: row.pm10,
        co2: row.co2,
        voc: row.voc,
        temp: row.temp,
        hum: row.hum,
        ch2o: row.ch2o,
        co: row.co,
        o3: row.o3,
        no2: row.no2,
        recorded_at: row.recorded_at,
      }
      : null,
  }));
};
