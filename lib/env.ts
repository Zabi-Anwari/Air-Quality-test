/**
 * Environment configuration loader
 * Must be imported at the very start of the application
 */

import 'dotenv/config';

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CITY_ID: process.env.CITY_ID || 'almaty',

  // Data Source
  DATA_SOURCE: process.env.DATA_SOURCE || 'mock',
  IQAIR_API_KEY: process.env.IQAIR_API_KEY,
  IQAIR_MAX_SENSORS_PER_CYCLE: parseInt(process.env.IQAIR_MAX_SENSORS_PER_CYCLE || '3'),
  IQAIR_REQUEST_DELAY_MS: parseInt(process.env.IQAIR_REQUEST_DELAY_MS || '60000'),

  // Supabase
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,

  // Feature flags
  ENABLE_REAL_TIME_UPDATES: process.env.ENABLE_REAL_TIME_UPDATES !== 'false',
  ENABLE_ALERTS: process.env.ENABLE_ALERTS !== 'false',
  ENABLE_FORECASTING: process.env.ENABLE_FORECASTING !== 'false',
  ENABLE_SENSOR_HEALTH_MONITORING: process.env.ENABLE_SENSOR_HEALTH_MONITORING !== 'false',

  // Intervals
  SENSOR_DATA_REFRESH_INTERVAL: parseInt(process.env.SENSOR_DATA_REFRESH_INTERVAL || '60000'),
  AQI_CALCULATION_INTERVAL: parseInt(process.env.AQI_CALCULATION_INTERVAL || '300000'),
  FORECAST_GENERATION_INTERVAL: parseInt(process.env.FORECAST_GENERATION_INTERVAL || '3600000'),
  ALERT_CHECK_INTERVAL: parseInt(process.env.ALERT_CHECK_INTERVAL || '300000'),
  SENSOR_HEALTH_CHECK_INTERVAL: parseInt(process.env.SENSOR_HEALTH_CHECK_INTERVAL || '600000'),
};

// Validate critical env vars
if (!env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL environment variable is not set. Please check your .env file.');
}

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️  Supabase variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. Some features may not work.');
}


console.log('✅ Environment variables loaded successfully');
