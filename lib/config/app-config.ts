/**
 * Environment Configuration
 * Centralized configuration management for the application
 */

export interface AppConfig {
  // Server
  port: number;
  environment: 'development' | 'production' | 'test';
  
  // Database
  databaseUrl: string;
  dbPoolMax: number;
  
  // City
  currentCity: string;
  
  // Data update intervals (milliseconds)
  sensorDataRefreshInterval: number;
  aqiCalculationInterval: number;
  forecastGenerationInterval: number;
  alertCheckInterval: number;
  sensorHealthCheckInterval: number;
  
  // Features
  enableRealTimeUpdates: boolean;
  enableAlerts: boolean;
  enableForecasting: boolean;
  enableSensorHealthMonitoring: boolean;
  
  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Load and validate configuration from environment
 */
export function loadConfig(): AppConfig {
  const config: AppConfig = {
    // Server
    port: parseInt(process.env.PORT || '3001'),
    environment: (process.env.NODE_ENV as any) || 'development',
    
    // Database
    databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/airquality',
    dbPoolMax: parseInt(process.env.PGPOOL_MAX || '10'),
    
    // City
    currentCity: process.env.CITY_ID || 'almaty',
    
    // Data update intervals
    sensorDataRefreshInterval: parseInt(process.env.SENSOR_DATA_REFRESH_INTERVAL || '60000'), // 1 minute
    aqiCalculationInterval: parseInt(process.env.AQI_CALCULATION_INTERVAL || '300000'), // 5 minutes
    forecastGenerationInterval: parseInt(process.env.FORECAST_GENERATION_INTERVAL || '3600000'), // 1 hour
    alertCheckInterval: parseInt(process.env.ALERT_CHECK_INTERVAL || '300000'), // 5 minutes
    sensorHealthCheckInterval: parseInt(process.env.SENSOR_HEALTH_CHECK_INTERVAL || '600000'), // 10 minutes
    
    // Features
    enableRealTimeUpdates: process.env.ENABLE_REAL_TIME_UPDATES !== 'false',
    enableAlerts: process.env.ENABLE_ALERTS !== 'false',
    enableForecasting: process.env.ENABLE_FORECASTING !== 'false',
    enableSensorHealthMonitoring: process.env.ENABLE_SENSOR_HEALTH_MONITORING !== 'false',
    
    // Logging
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
  };
  
  return config;
}

/**
 * Validate critical configuration
 */
export function validateConfig(config: AppConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.databaseUrl) {
    errors.push('DATABASE_URL is required');
  }
  
  if (config.port < 1 || config.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }
  
  if (!config.currentCity) {
    errors.push('CITY_ID is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get configuration as object for API response
 */
export function getConfigForResponse(config: AppConfig): Record<string, any> {
  return {
    environment: config.environment,
    currentCity: config.currentCity,
    features: {
      realTimeUpdates: config.enableRealTimeUpdates,
      alerts: config.enableAlerts,
      forecasting: config.enableForecasting,
      sensorHealthMonitoring: config.enableSensorHealthMonitoring,
    },
    intervals: {
      sensorDataRefresh: config.sensorDataRefreshInterval,
      aqiCalculation: config.aqiCalculationInterval,
      forecastGeneration: config.forecastGenerationInterval,
      alertCheck: config.alertCheckInterval,
      sensorHealthCheck: config.sensorHealthCheckInterval,
    },
  };
}
