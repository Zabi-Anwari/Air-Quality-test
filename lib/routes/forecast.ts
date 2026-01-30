/**
 * Forecast API Routes
 * Endpoints for AQI predictions and forecasting
 */

import express, { Request, Response } from 'express';
import { generateForecast, storeForecast, getLatestForecasts, generateAndStoreForecasts } from '../services/forecast-service';
import { getMockForecasts } from '../services/mock-data';

const router = express.Router();

/**
 * GET /api/forecast/:sensorId
 * Get latest forecast for a specific sensor
 */
router.get('/:sensorId', async (req: Request, res: Response) => {
  try {
    const sensorId = parseInt(req.params.sensorId);
    let forecasts = await getLatestForecasts(sensorId);

    if (!forecasts.length) {
      const generated = await generateForecast(sensorId);
      if (!generated.length) {
        return res.json({
          sensor_id: sensorId,
          message: 'No forecasts available yet',
          forecasts: [],
        });
      }

      const stored = [];
      for (const forecast of generated) {
        const result = await storeForecast(sensorId, forecast);
        stored.push(result);
      }
      forecasts = stored;
    }

    res.json({
      sensor_id: sensorId,
      forecast_count: forecasts.length,
      generated_at: forecasts[0].created_at,
      forecasts: forecasts.map((f) => ({
        hour: f.forecast_hour,
        predicted_aqi: f.predicted_aqi,
        confidence: f.confidence,
        valid_at: f.valid_at,
      })),
    });
  } catch (error) {
    console.warn('Database error, returning mock forecast:', (error as Error).message);
    // Return mock forecasts in demo mode
    const sensorId = parseInt(req.params.sensorId);
    const mockForecasts = getMockForecasts(sensorId);
    res.json({
      sensor_id: sensorId,
      forecast_count: mockForecasts.length,
      generated_at: new Date().toISOString(),
      forecasts: mockForecasts.map((f) => ({
        hour: f.forecast_hour,
        predicted_aqi: f.predicted_aqi,
        confidence: f.confidence,
        valid_at: f.valid_at,
      })),
    });
  }
});

/**
 * POST /api/forecast/:sensorId/generate
 * Generate a new forecast for a sensor
 */
router.post('/:sensorId/generate', async (req: Request, res: Response) => {
  try {
    const sensorId = parseInt(req.params.sensorId);
    const forecasts = await generateForecast(sensorId);

    if (!forecasts.length) {
      return res.status(400).json({
        error: 'Could not generate forecast - insufficient historical data',
      });
    }

    // Store in database
    const stored = [];
    for (const forecast of forecasts) {
      const result = await storeForecast(sensorId, forecast);
      stored.push(result);
    }

    res.json({
      sensor_id: sensorId,
      forecasts_generated: stored.length,
      forecasts: stored.map((f) => ({
        hour: f.forecast_hour,
        predicted_aqi: f.predicted_aqi,
        confidence: f.confidence,
        valid_at: f.valid_at,
      })),
    });
  } catch (error) {
    console.error('Error generating forecast:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

/**
 * POST /api/forecast/generate-all
 * Generate forecasts for all active sensors
 */
router.post('/generate-all', async (req: Request, res: Response) => {
  try {
    await generateAndStoreForecasts();
    res.json({
      message: 'Forecasts generated for all active sensors',
    });
  } catch (error) {
    console.error('Error generating all forecasts:', error);
    res.status(500).json({ error: 'Failed to generate forecasts for all sensors' });
  }
});

export default router;
