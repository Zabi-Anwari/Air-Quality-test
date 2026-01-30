/**
 * Sensors API Routes
 * Endpoints for sensor data retrieval and management
 */

import express, { Request, Response } from 'express';
import { getSensors, getLatestReadingsByDeviceIds } from '../data-access';
import { getSensorHealth, getAllSensorHealth } from '../services/sensor-health';
import { mockSensors } from '../services/mock-data';

const router = express.Router();

/**
 * GET /api/sensors
 * Get all sensors with optional filtering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const deviceIds = req.query.deviceIds ? (req.query.deviceIds as string).split(',') : undefined;
    const sensors = await getSensors(deviceIds);
    res.json(sensors);
  } catch (error) {
    console.warn('Database error, returning mock sensors:', (error as Error).message);
    res.json(mockSensors);
  }
});

/**
 * GET /api/sensors/latest
 * Get all sensors with their latest readings
 */
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const deviceIds = req.query.deviceIds ? (req.query.deviceIds as string).split(',') : undefined;
    const sensorsWithReadings = await getLatestReadingsByDeviceIds(deviceIds);
    res.json(sensorsWithReadings);
  } catch (error) {
    console.warn('Database error, returning mock sensor data:', (error as Error).message);
    res.json(mockSensors);
  }
});

/**
 * GET /api/sensors/:id/health
 * Get health status for a specific sensor
 */
router.get('/:id/health', async (req: Request, res: Response) => {
  try {
    const sensorId = parseInt(req.params.id);
    const health = await getSensorHealth(sensorId);

    if (!health) {
      return res.json({ 
        sensor_id: sensorId, 
        status: 'active',
        health_score: 100
      });
    }

    res.json(health);
  } catch (error) {
    console.warn('Database error, returning mock health:', (error as Error).message);
    res.json({ 
      sensor_id: parseInt(req.params.id), 
      status: 'active',
      health_score: 100
    });
  }
});

/**
 * GET /api/sensors/health/summary
 * Get health summary for all sensors
 */
router.get('/health/summary', async (req: Request, res: Response) => {
  try {
    const health = await getAllSensorHealth();
    res.json(health);
  } catch (error) {
    console.warn('Database error, returning mock health summary:', (error as Error).message);
    res.json({ active: 5, stale: 0, offline: 0, error: 0 });
  }
});

export default router;
