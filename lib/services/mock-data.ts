/**
 * Mock Data Generator for Development/Demo Mode
 * Used when database is not available
 */

export interface MockSensor {
  id: number;
  device_id: string;
  name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface MockReading {
  sensor_id: number;
  aqi_overall: number;
  pm25_aqi: number;
  pm10_aqi: number;
  no2_aqi: number;
  co_aqi: number;
  o3_aqi: number;
  so2_aqi: number;
  dominant_pollutant: string;
  health_implication: string;
  color_code: string;
  timestamp: string;
}

export const mockSensors: MockSensor[] = [
  // ALMATY - South Kazakhstan
  {
    id: 1,
    device_id: 'SENSOR_ALM_001',
    name: 'Almaty Downtown',
    location_name: 'Republic Square',
    latitude: 43.2381,
    longitude: 76.9453,
    city: 'Almaty',
    country: 'Kazakhstan',
  },
  {
    id: 2,
    device_id: 'SENSOR_ALM_002',
    name: 'Almaty Airport',
    location_name: 'Near International Airport',
    latitude: 43.4377,
    longitude: 77.4036,
    city: 'Almaty',
    country: 'Kazakhstan',
  },
  {
    id: 3,
    device_id: 'SENSOR_ALM_003',
    name: 'Almaty South-East',
    location_name: 'Turgen Gorge',
    latitude: 43.1000,
    longitude: 77.2000,
    city: 'Almaty',
    country: 'Kazakhstan',
  },
  {
    id: 4,
    device_id: 'SENSOR_ALM_004',
    name: 'Almaty Medeu',
    location_name: 'Medeu Valley',
    latitude: 43.1492,
    longitude: 77.0505,
    city: 'Almaty',
    country: 'Kazakhstan',
  },
  {
    id: 5,
    device_id: 'SENSOR_ALM_005',
    name: 'Almaty North',
    location_name: 'Turksib District',
    latitude: 43.2800,
    longitude: 76.8500,
    city: 'Almaty',
    country: 'Kazakhstan',
  },

  // ASTANA - Capital City
  {
    id: 6,
    device_id: 'SENSOR_AST_001',
    name: 'Astana Downtown',
    location_name: 'Bayterek Monument',
    latitude: 51.1694,
    longitude: 71.4700,
    city: 'Astana',
    country: 'Kazakhstan',
  },
  {
    id: 7,
    device_id: 'SENSOR_AST_002',
    name: 'Astana North',
    location_name: 'North Business District',
    latitude: 51.2000,
    longitude: 71.4700,
    city: 'Astana',
    country: 'Kazakhstan',
  },
  {
    id: 8,
    device_id: 'SENSOR_AST_003',
    name: 'Astana Alatau District',
    location_name: 'Alatau Residential',
    latitude: 51.0900,
    longitude: 71.5200,
    city: 'Astana',
    country: 'Kazakhstan',
  },

  // KARAGANDA - Central Kazakhstan
  {
    id: 9,
    device_id: 'SENSOR_KAR_001',
    name: 'Karaganda Downtown',
    location_name: 'City Center',
    latitude: 49.8047,
    longitude: 72.7864,
    city: 'Karaganda',
    country: 'Kazakhstan',
  },
  {
    id: 10,
    device_id: 'SENSOR_KAR_002',
    name: 'Karaganda Industrial',
    location_name: 'Industrial Zone',
    latitude: 49.7700,
    longitude: 72.6500,
    city: 'Karaganda',
    country: 'Kazakhstan',
  },

  // SHYMKENT - South Kazakhstan
  {
    id: 11,
    device_id: 'SENSOR_SHY_001',
    name: 'Shymkent Center',
    location_name: 'City Center',
    latitude: 42.3084,
    longitude: 69.5853,
    city: 'Shymkent',
    country: 'Kazakhstan',
  },
  {
    id: 12,
    device_id: 'SENSOR_SHY_002',
    name: 'Shymkent North',
    location_name: 'North District',
    latitude: 42.3500,
    longitude: 69.5900,
    city: 'Shymkent',
    country: 'Kazakhstan',
  },

  // AKTOBE - West Kazakhstan
  {
    id: 13,
    device_id: 'SENSOR_AKT_001',
    name: 'Aktobe Downtown',
    location_name: 'City Center',
    latitude: 50.2839,
    longitude: 57.1700,
    city: 'Aktobe',
    country: 'Kazakhstan',
  },
  {
    id: 14,
    device_id: 'SENSOR_AKT_002',
    name: 'Aktobe Industrial',
    location_name: 'Oil Processing District',
    latitude: 50.2500,
    longitude: 57.2500,
    city: 'Aktobe',
    country: 'Kazakhstan',
  },

  // PAVLODAR - East Kazakhstan
  {
    id: 15,
    device_id: 'SENSOR_PAV_001',
    name: 'Pavlodar Center',
    location_name: 'City Center',
    latitude: 52.2856,
    longitude: 76.9369,
    city: 'Pavlodar',
    country: 'Kazakhstan',
  },
  {
    id: 16,
    device_id: 'SENSOR_PAV_002',
    name: 'Pavlodar Industrial',
    location_name: 'Industrial Area',
    latitude: 52.2500,
    longitude: 76.8800,
    city: 'Pavlodar',
    country: 'Kazakhstan',
  },

  // SEMEY - East Kazakhstan
  {
    id: 17,
    device_id: 'SENSOR_SEM_001',
    name: 'Semey Center',
    location_name: 'City Center',
    latitude: 50.4166,
    longitude: 80.2558,
    city: 'Semey',
    country: 'Kazakhstan',
  },
  {
    id: 18,
    device_id: 'SENSOR_SEM_002',
    name: 'Semey North',
    location_name: 'Northern Residential',
    latitude: 50.4500,
    longitude: 80.2800,
    city: 'Semey',
    country: 'Kazakhstan',
  },

  // ATYRAU - West Kazakhstan
  {
    id: 19,
    device_id: 'SENSOR_ATY_001',
    name: 'Atyrau Downtown',
    location_name: 'City Center',
    latitude: 43.6614,
    longitude: 51.3619,
    city: 'Atyrau',
    country: 'Kazakhstan',
  },
  {
    id: 20,
    device_id: 'SENSOR_ATY_002',
    name: 'Atyrau Oil Port',
    location_name: 'Caspian Port Area',
    latitude: 43.6800,
    longitude: 51.3900,
    city: 'Atyrau',
    country: 'Kazakhstan',
  },

  // URALSK - West Kazakhstan
  {
    id: 21,
    device_id: 'SENSOR_URA_001',
    name: 'Uralsk Center',
    location_name: 'City Center',
    latitude: 51.2222,
    longitude: 51.3658,
    city: 'Uralsk',
    country: 'Kazakhstan',
  },

  // KYZYLORDA - South Kazakhstan
  {
    id: 22,
    device_id: 'SENSOR_KYZ_001',
    name: 'Kyzylorda Center',
    location_name: 'City Center',
    latitude: 44.8472,
    longitude: 65.2819,
    city: 'Kyzylorda',
    country: 'Kazakhstan',
  },

  // TARAZ - South Kazakhstan
  {
    id: 23,
    device_id: 'SENSOR_TAR_001',
    name: 'Taraz Downtown',
    location_name: 'Historic City Center',
    latitude: 42.8971,
    longitude: 71.3789,
    city: 'Taraz',
    country: 'Kazakhstan',
  },

  // ORAL - West Kazakhstan
  {
    id: 24,
    device_id: 'SENSOR_ORA_001',
    name: 'Oral (Uralsk Region)',
    location_name: 'City Center',
    latitude: 51.3950,
    longitude: 51.9194,
    city: 'Oral',
    country: 'Kazakhstan',
  },

  // KOSTANAY - North Kazakhstan
  {
    id: 25,
    device_id: 'SENSOR_KOS_001',
    name: 'Kostanay Center',
    location_name: 'City Center',
    latitude: 53.2142,
    longitude: 63.6292,
    city: 'Kostanay',
    country: 'Kazakhstan',
  },

  // AKMOLA REGION
  {
    id: 26,
    device_id: 'SENSOR_AKM_001',
    name: 'Akmola Regional',
    location_name: 'Regional Center',
    latitude: 52.5311,
    longitude: 71.4625,
    city: 'Akmola Region',
    country: 'Kazakhstan',
  },

  // MANGYSTAU REGION
  {
    id: 27,
    device_id: 'SENSOR_MAN_001',
    name: 'Mangystau Regional',
    location_name: 'Ustyurt Plateau',
    latitude: 43.7000,
    longitude: 51.3619,
    city: 'Mangystau Region',
    country: 'Kazakhstan',
  },

  // TURKESTAN REGION
  {
    id: 28,
    device_id: 'SENSOR_TUR_001',
    name: 'Turkestan Regional',
    location_name: 'Regional Center',
    latitude: 43.2722,
    longitude: 68.7633,
    city: 'Turkestan Region',
    country: 'Kazakhstan',
  },

  // ZHAMBYL REGION
  {
    id: 29,
    device_id: 'SENSOR_ZHA_001',
    name: 'Zhambyl Regional',
    location_name: 'Regional Center',
    latitude: 42.8000,
    longitude: 71.3500,
    city: 'Zhambyl Region',
    country: 'Kazakhstan',
  },

  // EASTERN KAZAKHSTAN REGION
  {
    id: 30,
    device_id: 'SENSOR_EKR_001',
    name: 'Eastern Kazakhstan Regional',
    location_name: 'Regional Center',
    latitude: 50.4200,
    longitude: 80.2500,
    city: 'Eastern Kazakhstan',
    country: 'Kazakhstan',
  },

  // KARAGANDA REGION RURAL
  {
    id: 31,
    device_id: 'SENSOR_KAR_003',
    name: 'Karaganda Rural',
    location_name: 'Steppe Area',
    latitude: 49.5000,
    longitude: 72.5000,
    city: 'Karaganda Region',
    country: 'Kazakhstan',
  },

  // WEST KAZAKHSTAN REGION RURAL
  {
    id: 32,
    device_id: 'SENSOR_WKR_001',
    name: 'West Kazakhstan Rural',
    location_name: 'Agricultural Area',
    latitude: 50.6000,
    longitude: 57.0000,
    city: 'West Kazakhstan',
    country: 'Kazakhstan',
  },

  // NORTH KAZAKHSTAN REGION
  {
    id: 33,
    device_id: 'SENSOR_NKR_001',
    name: 'North Kazakhstan Regional',
    location_name: 'Regional Center',
    latitude: 53.1944,
    longitude: 63.6292,
    city: 'North Kazakhstan',
    country: 'Kazakhstan',
  },

  // SOUTH KAZAKHSTAN REGION ADDITIONAL
  {
    id: 34,
    device_id: 'SENSOR_SKR_001',
    name: 'South Kazakhstan Regional',
    location_name: 'Regional Area',
    latitude: 42.5000,
    longitude: 69.5000,
    city: 'South Kazakhstan',
    country: 'Kazakhstan',
  },
];

export function generateMockReading(sensorId: number): MockReading {
  const now = new Date();
  const aqi = Math.floor(Math.random() * 200) + 20;
  
  return {
    sensor_id: sensorId,
    aqi_overall: aqi,
    pm25_aqi: Math.floor(Math.random() * aqi),
    pm10_aqi: Math.floor(Math.random() * aqi),
    no2_aqi: Math.floor(Math.random() * aqi),
    co_aqi: Math.floor(Math.random() * aqi),
    o3_aqi: Math.floor(Math.random() * aqi),
    so2_aqi: Math.floor(Math.random() * aqi),
    dominant_pollutant: aqi > 150 ? 'PM2.5' : 'PM10',
    health_implication: aqi > 150 ? 'Unhealthy' : 'Moderate',
    color_code: aqi > 150 ? '#ff6b6b' : '#ffd43b',
    timestamp: now.toISOString(),
  };
}

export function getMockCurrentAQI() {
  return mockSensors.map(sensor => {
    const reading = generateMockReading(sensor.id);
    const { sensor_id: _, ...readingWithoutId } = reading;
    return {
      sensor_id: sensor.id,
      sensor_name: sensor.name,
      device_id: sensor.device_id,
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      city: sensor.city,
      ...readingWithoutId,
    };
  });
}

export function getMockAlerts() {
  return [
    {
      id: 1,
      sensor_id: 1,
      alert_type: 'threshold',
      severity: 'medium',
      message: 'AQI exceeded 100',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];
}

export function getMockAlertConfig() {
  return {
    thresholdCritical: 200,
    thresholdHigh: 150,
    spikeThreshold: 25,
    staleDataMinutes: 15,
  };
}

export function getMockForecasts(sensorId: number) {
  const forecasts = [];
  const now = new Date();
  
  // Generate 7-day forecast (168 hours)
  for (let hour = 1; hour <= 168; hour++) {
    const futureTime = new Date(now.getTime() + hour * 3600000);
    
    // Add some realistic patterns: higher during work hours, lower at night/weekends
    const hourOfDay = futureTime.getHours();
    const dayOfWeek = futureTime.getDay();
    
    let baseAQI = 50; // Base AQI
    
    // Work day patterns
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday-Friday
      if (hourOfDay >= 7 && hourOfDay <= 9) baseAQI += 30; // Morning rush
      if (hourOfDay >= 17 && hourOfDay <= 19) baseAQI += 25; // Evening rush
    }
    
    // Weekend patterns (generally cleaner)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseAQI -= 15;
    }
    
    // Add random variation
    const variation = (Math.random() - 0.5) * 40;
    const predictedAQI = Math.max(10, Math.min(300, Math.round(baseAQI + variation)));
    
    // Confidence decreases over time
    const confidence = Math.max(0.4, 0.85 - (hour / 168) * 0.4);
    
    forecasts.push({
      sensor_id: sensorId,
      forecast_hour: hour,
      predicted_aqi: predictedAQI,
      confidence: Math.round(confidence * 100) / 100,
      valid_at: futureTime.toISOString(),
    });
  }
  
  return forecasts;
}
