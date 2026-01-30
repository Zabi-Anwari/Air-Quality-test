/**
 * Forecasting Service
 * Implements simple time-series forecasting for AQI predictions
 * Uses exponential moving average and autoregressive model
 */

import { query } from '../db/index';
import { ForecastRow, AqiCalculationRow, SensorReadingRow } from '../db/schema';
import { calculateAQI } from './aqi-engine';

export interface ForecastData {
  hour: number;
  predicted_aqi: number;
  confidence: number;
  valid_at: string;
}

const MODEL_VERSION = '1.0-simple-arima';

/**
 * Get historical AQI data for a sensor (last 48 hours)
 */
const getHistoricalAQI = async (sensor_id: number): Promise<AqiCalculationRow[]> => {
  const result = await query<AqiCalculationRow>(
    `SELECT * FROM aqi_calculations 
     WHERE sensor_id = $1 AND timestamp > NOW() - INTERVAL '48 hours'
     ORDER BY timestamp DESC
     LIMIT 48`,
    [sensor_id]
  );
  return result.rows.reverse();
};

const getHistoricalAQIFromReadings = async (sensor_id: number): Promise<AqiCalculationRow[]> => {
  const result = await query<SensorReadingRow>(
    `SELECT * FROM sensor_readings 
     WHERE sensor_id = $1 AND timestamp > NOW() - INTERVAL '48 hours'
     ORDER BY timestamp DESC
     LIMIT 48`,
    [sensor_id]
  );

  return result.rows.reverse().map((row) => {
    const aqi = calculateAQI({
      pm25: row.pm25,
      pm10: row.pm10,
      no2: row.no2,
      co: row.co,
      o3: row.o3,
      so2: null,
    });

    return {
      id: 0,
      sensor_id: row.sensor_id,
      aqi_overall: aqi.overall_aqi,
      pm25_aqi: aqi.pollutant_breakdown.pm25?.aqi || null,
      pm10_aqi: aqi.pollutant_breakdown.pm10?.aqi || null,
      no2_aqi: aqi.pollutant_breakdown.no2?.aqi || null,
      co_aqi: aqi.pollutant_breakdown.co?.aqi || null,
      o3_aqi: aqi.pollutant_breakdown.o3?.aqi || null,
      so2_aqi: null,
      dominant_pollutant: aqi.dominant_pollutant,
      timestamp: row.timestamp,
    };
  });
};

/**
 * Simple exponential smoothing for trend calculation
 */
function calculateExponentialSmoothing(values: number[], alpha: number = 0.3): number[] {
  if (values.length === 0) return [];

  const smoothed = [values[0]];
  for (let i = 1; i < values.length; i++) {
    smoothed.push(alpha * values[i] + (1 - alpha) * smoothed[i - 1]);
  }
  return smoothed;
}

/**
 * Calculate trend (simple linear regression on recent data)
 */
function calculateTrend(values: number[], hours: number = 12): number {
  if (values.length < 2) return 0;

  const recentValues = values.slice(-hours);
  const n = recentValues.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = recentValues.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * recentValues[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

/**
 * Calculate forecast confidence (inverse of variance)
 */
function calculateConfidence(values: number[]): number {
  if (values.length < 2) return 0.5;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Confidence is inverse of coefficient of variation
  const cv = stdDev / (mean || 1);
  return Math.max(0.1, Math.min(0.95, 1 - cv / 2));
}

/**
 * Generate AQI forecast for next 7 days (168 hours)
 */
export async function generateForecast(sensor_id: number): Promise<ForecastData[]> {
  try {
    let historicalData = await getHistoricalAQI(sensor_id);

    if (historicalData.length < 3) {
      historicalData = await getHistoricalAQIFromReadings(sensor_id);
    }

    if (historicalData.length < 3) {
      // Not enough data for forecast
      return [];
    }

    const aqiValues = historicalData.map((d) => d.aqi_overall);
    const smoothedValues = calculateExponentialSmoothing(aqiValues);
    const trend = calculateTrend(aqiValues);
    const confidence = calculateConfidence(aqiValues);

    const forecasts: ForecastData[] = [];
    const lastAQI = smoothedValues[smoothedValues.length - 1];
    const now = new Date();

    // Generate 7-day forecast (168 hours)
    for (let hour = 1; hour <= 168; hour++) {
      // Apply trend with dampening factor (trends weaken over time)
      // Use different dampening for short-term vs long-term
      let dampeningFactor;
      if (hour <= 24) {
        // First day: strong trend influence
        dampeningFactor = Math.max(0.5, 1 - hour * 0.02);
      } else if (hour <= 72) {
        // Days 2-3: moderate trend influence
        dampeningFactor = Math.max(0.3, 0.8 - (hour - 24) * 0.01);
      } else {
        // Days 4-7: weak trend influence, approaching baseline
        dampeningFactor = Math.max(0.1, 0.5 - (hour - 72) * 0.005);
      }

      const predictedAQI = Math.max(0, Math.round(lastAQI + trend * hour * dampeningFactor));

      // Confidence decreases with forecast horizon
      // More gradual decrease for longer forecasts
      const horizonConfidence = Math.max(0.3, confidence - hour * 0.002);

      const validAt = new Date(now.getTime() + hour * 60 * 60 * 1000);

      forecasts.push({
        hour,
        predicted_aqi: predictedAQI,
        confidence: Math.round(horizonConfidence * 100) / 100,
        valid_at: validAt.toISOString(),
      });
    }

    return forecasts;
  } catch (error) {
    console.error('Forecast generation error:', error);
    return [];
  }
}

/**
 * Store forecast in database
 */
export async function storeForecast(
  sensor_id: number,
  forecast: ForecastData
): Promise<ForecastRow> {
  const result = await query<ForecastRow>(
    `INSERT INTO forecasts 
     (sensor_id, forecast_hour, predicted_aqi, confidence, model_version, created_at, valid_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), $6)
     RETURNING *`,
    [sensor_id, forecast.hour, forecast.predicted_aqi, forecast.confidence, MODEL_VERSION, forecast.valid_at]
  );
  return result.rows[0];
}

/**
 * Get latest forecasts for a sensor
 */
export async function getLatestForecasts(sensor_id: number, hours: number = 6): Promise<ForecastRow[]> {
  const result = await query<ForecastRow>(
    `SELECT * FROM forecasts 
     WHERE sensor_id = $1 
     AND valid_at > NOW() 
     AND created_at = (SELECT MAX(created_at) FROM forecasts WHERE sensor_id = $1)
     ORDER BY forecast_hour ASC`,
    [sensor_id]
  );
  return result.rows;
}

/**
 * Clean up old forecasts (older than 7 days)
 */
export async function cleanupOldForecasts(): Promise<void> {
  await query(
    `DELETE FROM forecasts WHERE created_at < NOW() - INTERVAL '7 days'`
  );
}

/**
 * Generate and store forecasts for all active sensors
 */
export async function generateAndStoreForecasts(): Promise<void> {
  try {
    // Get all active sensors
    const sensorsResult = await query<{ id: number }>(
      `SELECT id FROM sensors WHERE is_active = true`
    );

    for (const sensor of sensorsResult.rows) {
      const forecasts = await generateForecast(sensor.id);
      for (const forecast of forecasts) {
        await storeForecast(sensor.id, forecast);
      }
    }

    console.log('Forecasts generated for all active sensors');
  } catch (error) {
    console.error('Error generating forecasts for all sensors:', error);
  }
}
