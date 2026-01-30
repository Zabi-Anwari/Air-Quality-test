/**
 * AQI API Routes
 * Endpoints for AQI calculations, historical data, and analytics
 */

import express, { Request, Response } from 'express';
import { query } from '../db/index';
import { AqiCalculationRow, SensorReadingRow } from '../db/schema';
import { calculateAQI, getAQIColor, getAQICategory } from '../services/aqi-engine';
import { getMockCurrentAQI, getMockForecasts } from '../services/mock-data';

const router = express.Router();

/**
 * GET /api/aqi/current
 * Get current AQI for all or specific sensors
 */
router.get('/current', async (req: Request, res: Response) => {
  try {
    const sensorId = req.query.sensorId ? parseInt(req.query.sensorId as string) : undefined;

    let sql = `
      SELECT 
        sr.sensor_id,
        s.device_id,
        s.location_name as site,
        s.latitude as lat,
        s.longitude as lng,
        sr.pm25,
        sr.pm10,
        sr.no2,
        sr.co,
        sr.o3,
        sr.timestamp,
        ac.aqi_overall,
        ac.dominant_pollutant
      FROM sensor_readings sr
      JOIN sensors s ON sr.sensor_id = s.id
      LEFT JOIN aqi_calculations ac ON sr.sensor_id = ac.sensor_id 
        AND ac.timestamp = (SELECT MAX(timestamp) FROM aqi_calculations WHERE sensor_id = sr.sensor_id)
      WHERE sr.timestamp = (SELECT MAX(timestamp) FROM sensor_readings WHERE sensor_id = sr.sensor_id)
    `;

    const params: any[] = [];
    if (sensorId) {
      sql += ` AND sr.sensor_id = $${params.length + 1}`;
      params.push(sensorId);
    }

    const result = await query<any>(sql, params);

    const data = result.rows.map((row: any) => {
      const computedAqi = (row.aqi_overall === null || row.aqi_overall === undefined)
        ? calculateAQI({
            pm25: row.pm25,
            pm10: row.pm10,
            no2: row.no2,
            co: row.co,
            o3: row.o3,
          })
        : null;

      const overallAqi = typeof row.aqi_overall === 'number'
        ? row.aqi_overall
        : computedAqi?.overall_aqi ?? 0;

      const dominantPollutant = row.dominant_pollutant || computedAqi?.dominant_pollutant || 'Unknown';

      return {
        sensor_id: row.sensor_id,
        device_id: row.device_id,
        site: row.site,
        location: { lat: row.lat, lng: row.lng },
        current_aqi: overallAqi,
        dominant_pollutant: dominantPollutant,
        aqi_category: getAQICategory(overallAqi),
        aqi_color: getAQIColor(overallAqi),
        pollutants: {
          pm25: row.pm25,
          pm10: row.pm10,
          no2: row.no2,
          co: row.co,
          o3: row.o3,
        },
        timestamp: row.timestamp,
      };
    });

    res.json(data);
  } catch (error) {
    console.warn('Database error, returning mock data:', (error as Error).message);
    // Return mock data in demo mode
    const mockData = getMockCurrentAQI();
    res.json(mockData);
  }
});

/**
 * GET /api/aqi/history
 * Get historical AQI data with time range filtering
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const sensorId = parseInt(req.query.sensorId as string || '0');
    const hours = parseInt(req.query.hours as string || '24');
    const limit = parseInt(req.query.limit as string || '100');

    if (!sensorId) {
      return res.status(400).json({ error: 'sensorId parameter is required' });
    }

    const result = await query<AqiCalculationRow>(
      `SELECT * FROM aqi_calculations 
       WHERE sensor_id = $1 AND timestamp > NOW() - INTERVAL '${hours} hours'
       ORDER BY timestamp DESC
       LIMIT $2`,
      [sensorId, limit]
    );

    const data = result.rows.reverse().map((row: any) => ({
      timestamp: row.timestamp,
      aqi_overall: row.aqi_overall,
      pollutants: {
        pm25_aqi: row.pm25_aqi,
        pm10_aqi: row.pm10_aqi,
        no2_aqi: row.no2_aqi,
        co_aqi: row.co_aqi,
        o3_aqi: row.o3_aqi,
        so2_aqi: row.so2_aqi,
      },
      dominant_pollutant: row.dominant_pollutant,
      category: getAQICategory(row.aqi_overall),
      color: getAQIColor(row.aqi_overall),
    }));

    res.json({
      sensor_id: sensorId,
      hours_back: hours,
      data_points: data.length,
      data,
    });
  } catch (error) {
    console.error('Error fetching AQI history:', error);
    res.status(500).json({ error: 'Failed to fetch AQI history' });
  }
});

/**
 * GET /api/aqi/stats
 * Get AQI statistics for a given time period
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const sensorId = parseInt(req.query.sensorId as string || '0');
    const hours = parseInt(req.query.hours as string || '24');

    if (!sensorId) {
      return res.status(400).json({ error: 'sensorId parameter is required' });
    }

    const result = await query<any>(
      `SELECT 
        MIN(aqi_overall) as min_aqi,
        MAX(aqi_overall) as max_aqi,
        AVG(aqi_overall) as avg_aqi,
        STDDEV(aqi_overall) as stddev_aqi,
        COUNT(*) as data_points
      FROM aqi_calculations 
      WHERE sensor_id = $1 AND timestamp > NOW() - INTERVAL '${hours} hours'`,
      [sensorId]
    );

    const stats = result.rows[0];

    res.json({
      sensor_id: sensorId,
      hours_back: hours,
      min_aqi: Math.round(stats.min_aqi || 0),
      max_aqi: Math.round(stats.max_aqi || 0),
      avg_aqi: Math.round(stats.avg_aqi || 0),
      stddev: Math.round((stats.stddev_aqi || 0) * 100) / 100,
      data_points: stats.data_points,
    });
  } catch (error) {
    console.error('Error fetching AQI stats:', error);
    res.status(500).json({ error: 'Failed to fetch AQI statistics' });
  }
});

/**
 * POST /api/aqi/calculate
 * Manually trigger AQI calculation for latest readings
 */
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const sensorId = req.body.sensorId ? parseInt(req.body.sensorId) : undefined;

    let sql = `
      SELECT sr.sensor_id, sr.pm25, sr.pm10, sr.no2, sr.co, sr.o3, sr.timestamp
      FROM sensor_readings sr
      WHERE sr.timestamp = (SELECT MAX(timestamp) FROM sensor_readings WHERE sensor_id = sr.sensor_id)
    `;

    const params: any[] = [];
    if (sensorId) {
      sql += ` AND sr.sensor_id = $${params.length + 1}`;
      params.push(sensorId);
    }

    const result = await query<SensorReadingRow>(sql, params);

    const aqiResults = [];
    for (const reading of result.rows) {
      const aqiData = calculateAQI({
        pm25: reading.pm25,
        pm10: reading.pm10,
        no2: reading.no2,
        co: reading.co,
        o3: reading.o3,
      });

      // Store in database
      await query(
        `INSERT INTO aqi_calculations 
         (sensor_id, aqi_overall, pm25_aqi, pm10_aqi, no2_aqi, co_aqi, o3_aqi, dominant_pollutant, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          reading.sensor_id,
          aqiData.overall_aqi,
          aqiData.pollutant_breakdown.pm25?.aqi || null,
          aqiData.pollutant_breakdown.pm10?.aqi || null,
          aqiData.pollutant_breakdown.no2?.aqi || null,
          aqiData.pollutant_breakdown.co?.aqi || null,
          aqiData.pollutant_breakdown.o3?.aqi || null,
          aqiData.dominant_pollutant,
        ]
      );

      aqiResults.push({
        sensor_id: reading.sensor_id,
        ...aqiData,
      });
    }

    res.json({ calculated: aqiResults.length, data: aqiResults });
  } catch (error) {
    console.error('Error calculating AQI:', error);
    res.status(500).json({ error: 'Failed to calculate AQI' });
  }
});

export default router;
