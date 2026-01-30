/**
 * City Configuration System
 * Enables dynamic configuration and replicability across different cities
 * Centralizes city-specific settings, thresholds, and sensor lists
 */

export interface CityConfig {
  id: string;
  name: string;
  displayName: string;
  country: string;
  region: string;
  timezone: string;
  center: {
    lat: number;
    lng: number;
  };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  aqi_thresholds: {
    good_max: number;
    moderate_max: number;
    unhealthy_sensitive_max: number;
    unhealthy_max: number;
    very_unhealthy_max: number;
  };
  alert_config: {
    critical_aqi: number;
    high_aqi: number;
    spike_threshold_percent: number;
    stale_data_minutes: number;
  };
  default_pollutants: string[];
  units: {
    pm: 'µg/m³' | 'mg/m³';
    gas: 'ppb' | 'ppm';
    temp: 'celsius' | 'fahrenheit';
  };
  language: string;
  contact_email?: string;
  website?: string;
}

/**
 * Default city configurations
 */
export const citiesConfig: Record<string, CityConfig> = {
  almaty: {
    id: 'almaty',
    name: 'almaty',
    displayName: 'Almaty, Kazakhstan',
    country: 'Kazakhstan',
    region: 'Almaty Region',
    timezone: 'Asia/Almaty',
    center: {
      lat: 43.2567,
      lng: 76.9286,
    },
    bounds: {
      north: 43.4,
      south: 43.1,
      east: 77.2,
      west: 76.7,
    },
    aqi_thresholds: {
      good_max: 50,
      moderate_max: 100,
      unhealthy_sensitive_max: 150,
      unhealthy_max: 200,
      very_unhealthy_max: 300,
    },
    alert_config: {
      critical_aqi: 200,
      high_aqi: 150,
      spike_threshold_percent: 25,
      stale_data_minutes: 15,
    },
    default_pollutants: ['PM2.5', 'PM10', 'NO2', 'CO', 'O3', 'SO2'],
    units: {
      pm: 'µg/m³',
      gas: 'ppb',
      temp: 'celsius',
    },
    language: 'kk',
    contact_email: 'almaty-air@example.com',
    website: 'https://almaty-air-quality.kz',
  },
};

/**
 * Get city configuration by ID
 */
export function getCityConfig(cityId: string): CityConfig | null {
  return citiesConfig[cityId] || null;
}

/**
 * Get all available cities
 */
export function getAllCities(): CityConfig[] {
  return Object.values(citiesConfig);
}

/**
 * Add or update city configuration
 */
export function updateCityConfig(cityId: string, config: CityConfig): void {
  citiesConfig[cityId] = config;
}

/**
 * Get current city from environment or default to Almaty
 */
export function getCurrentCityConfig(): CityConfig {
  const cityId = process.env.CITY_ID || 'almaty';
  return getCityConfig(cityId) || citiesConfig.almaty;
}
