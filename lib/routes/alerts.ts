/**
 * Alerts API Routes
 * Endpoints for alert management and retrieval
 */

import express, { Request, Response } from 'express';
import {
  getActiveAlerts,
  getAlerts,
  resolveAlert,
  checkAQIThreshold,
  checkPollutionSpike,
  checkSensorHealth,
  defaultAlertConfig,
} from '../services/alert-service';
import { getMockAlerts, getMockAlertConfig } from '../services/mock-data';

const router = express.Router();

/**
 * GET /api/alerts/active
 * Get all active alerts or alerts for a specific sensor
 */
router.get('/active', async (req: Request, res: Response) => {
  try {
    const sensorId = req.query.sensorId ? parseInt(req.query.sensorId as string) : undefined;
    const alerts = await getActiveAlerts(sensorId);

    res.json({
      active_alert_count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.warn('Database error, returning mock alerts:', (error as Error).message);
    const mockAlerts = getMockAlerts();
    res.json({
      active_alert_count: mockAlerts.length,
      alerts: mockAlerts,
    });
  }
});

/**
 * GET /api/alerts/history
 * Get alert history with optional time filter
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const sensorId = req.query.sensorId ? parseInt(req.query.sensorId as string) : undefined;
    const hoursBack = parseInt(req.query.hours as string || '24');

    const alerts = await getAlerts(sensorId, hoursBack);

    res.json({
      total_alerts: alerts.length,
      hours_back: hoursBack,
      alerts,
    });
  } catch (error) {
    console.error('Error fetching alert history:', error);
    res.status(500).json({ error: 'Failed to fetch alert history' });
  }
});

/**
 * PUT /api/alerts/:id/resolve
 * Resolve a specific alert
 */
router.put('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const alertId = parseInt(req.params.id);
    const resolved = await resolveAlert(alertId);

    res.json({
      message: 'Alert resolved',
      alert: resolved,
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

/**
 * POST /api/alerts/check/:sensorId
 * Manually trigger alert checks for a sensor
 */
router.post('/check/:sensorId', async (req: Request, res: Response) => {
  try {
    const sensorId = parseInt(req.params.sensorId);
    const currentAQI = req.body.aqi ? parseInt(req.body.aqi) : undefined;

    if (!currentAQI && currentAQI !== 0) {
      return res.status(400).json({ error: 'aqi parameter is required' });
    }

    // Run all alert checks
    await checkAQIThreshold(sensorId, currentAQI, defaultAlertConfig);
    await checkPollutionSpike(sensorId, currentAQI, defaultAlertConfig);
    await checkSensorHealth(sensorId, defaultAlertConfig);

    // Fetch updated alerts
    const alerts = await getActiveAlerts(sensorId);

    res.json({
      message: 'Alert checks completed',
      active_alerts: alerts.length,
      alerts,
    });
  } catch (error) {
    console.warn('Database error in alert check:', (error as Error).message);
    res.json({ 
      message: 'Alert check completed (demo mode)',
      alerts_triggered: 0
    });
  }
});

/**
 * GET /api/alerts/config
 * Get current alert configuration
 */
router.get('/config', (req: Request, res: Response) => {
  res.json({
    config: defaultAlertConfig,
  });
});

export default router;
