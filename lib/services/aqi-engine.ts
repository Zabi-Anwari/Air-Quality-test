/**
 * AQI Calculation Engine
 * Implements standard EPA/WHO AQI calculation methodology
 * Computes pollutant-level AQI and overall AQI (maximum rule)
 */

// AQI breakpoints and concentration ranges (EPA/WHO standards)
const AQI_BREAKPOINTS = {
  pm25: [
    { aqi_low: 0, aqi_high: 50, conc_low: 0, conc_high: 12.0, level: 'Good' },
    { aqi_low: 51, aqi_high: 100, conc_low: 12.1, conc_high: 35.4, level: 'Moderate' },
    { aqi_low: 101, aqi_high: 150, conc_low: 35.5, conc_high: 55.4, level: 'Unhealthy for Sensitive Groups' },
    { aqi_low: 151, aqi_high: 200, conc_low: 55.5, conc_high: 150.4, level: 'Unhealthy' },
    { aqi_low: 201, aqi_high: 300, conc_low: 150.5, conc_high: 250.4, level: 'Very Unhealthy' },
    { aqi_low: 301, aqi_high: 500, conc_low: 250.5, conc_high: 500, level: 'Hazardous' },
  ],
  pm10: [
    { aqi_low: 0, aqi_high: 50, conc_low: 0, conc_high: 54, level: 'Good' },
    { aqi_low: 51, aqi_high: 100, conc_low: 55, conc_high: 154, level: 'Moderate' },
    { aqi_low: 101, aqi_high: 150, conc_low: 155, conc_high: 254, level: 'Unhealthy for Sensitive Groups' },
    { aqi_low: 151, aqi_high: 200, conc_low: 255, conc_high: 354, level: 'Unhealthy' },
    { aqi_low: 201, aqi_high: 300, conc_low: 355, conc_high: 424, level: 'Very Unhealthy' },
    { aqi_low: 301, aqi_high: 500, conc_low: 425, conc_high: 604, level: 'Hazardous' },
  ],
  no2: [
    { aqi_low: 0, aqi_high: 50, conc_low: 0, conc_high: 53, level: 'Good' },
    { aqi_low: 51, aqi_high: 100, conc_low: 54, conc_high: 100, level: 'Moderate' },
    { aqi_low: 101, aqi_high: 150, conc_low: 101, conc_high: 360, level: 'Unhealthy for Sensitive Groups' },
    { aqi_low: 151, aqi_high: 200, conc_low: 361, conc_high: 649, level: 'Unhealthy' },
    { aqi_low: 201, aqi_high: 300, conc_low: 650, conc_high: 1249, level: 'Very Unhealthy' },
    { aqi_low: 301, aqi_high: 500, conc_low: 1250, conc_high: 2049, level: 'Hazardous' },
  ],
  co: [
    { aqi_low: 0, aqi_high: 50, conc_low: 0, conc_high: 4.4, level: 'Good' },
    { aqi_low: 51, aqi_high: 100, conc_low: 4.5, conc_high: 9.4, level: 'Moderate' },
    { aqi_low: 101, aqi_high: 150, conc_low: 9.5, conc_high: 12.4, level: 'Unhealthy for Sensitive Groups' },
    { aqi_low: 151, aqi_high: 200, conc_low: 12.5, conc_high: 15.4, level: 'Unhealthy' },
    { aqi_low: 201, aqi_high: 300, conc_low: 15.5, conc_high: 30.4, level: 'Very Unhealthy' },
    { aqi_low: 301, aqi_high: 500, conc_low: 30.5, conc_high: 40.4, level: 'Hazardous' },
  ],
  o3: [
    { aqi_low: 0, aqi_high: 50, conc_low: 0, conc_high: 54, level: 'Good' },
    { aqi_low: 51, aqi_high: 100, conc_low: 55, conc_high: 70, level: 'Moderate' },
    { aqi_low: 101, aqi_high: 150, conc_low: 71, conc_high: 85, level: 'Unhealthy for Sensitive Groups' },
    { aqi_low: 151, aqi_high: 200, conc_low: 86, conc_high: 105, level: 'Unhealthy' },
    { aqi_low: 201, aqi_high: 300, conc_low: 106, conc_high: 200, level: 'Very Unhealthy' },
    { aqi_low: 301, aqi_high: 500, conc_low: 201, conc_high: 604, level: 'Hazardous' },
  ],
  so2: [
    { aqi_low: 0, aqi_high: 50, conc_low: 0, conc_high: 35, level: 'Good' },
    { aqi_low: 51, aqi_high: 100, conc_low: 36, conc_high: 75, level: 'Moderate' },
    { aqi_low: 101, aqi_high: 150, conc_low: 76, conc_high: 185, level: 'Unhealthy for Sensitive Groups' },
    { aqi_low: 151, aqi_high: 200, conc_low: 186, conc_high: 304, level: 'Unhealthy' },
    { aqi_low: 201, aqi_high: 300, conc_low: 305, conc_high: 604, level: 'Very Unhealthy' },
    { aqi_low: 301, aqi_high: 500, conc_low: 605, conc_high: 804, level: 'Hazardous' },
  ],
};

interface PollutantAQI {
  pollutant: string;
  concentration: number | null;
  aqi: number | null;
  level: string | null;
}

interface AQICalculationResult {
  overall_aqi: number;
  dominant_pollutant: string;
  pollutant_breakdown: Record<string, PollutantAQI>;
  health_implication: string;
  recommendation: string;
}

/**
 * Calculate AQI for a single pollutant
 * Linear interpolation between breakpoints
 */
function calculatePollutantAQI(
  concentration: number | null,
  breakpoints: Array<{ aqi_low: number; aqi_high: number; conc_low: number; conc_high: number; level: string }>
): { aqi: number | null; level: string | null } {
  if (concentration === null || concentration === undefined) {
    return { aqi: null, level: null };
  }

  for (const bp of breakpoints) {
    if (concentration >= bp.conc_low && concentration <= bp.conc_high) {
      const aqi =
        ((bp.aqi_high - bp.aqi_low) / (bp.conc_high - bp.conc_low)) * (concentration - bp.conc_low) + bp.aqi_low;
      return { aqi: Math.round(aqi), level: bp.level };
    }
  }

  // Beyond highest breakpoint
  const lastBp = breakpoints[breakpoints.length - 1];
  if (concentration > lastBp.conc_high) {
    return { aqi: lastBp.aqi_high + 100, level: lastBp.level };
  }

  return { aqi: null, level: null };
}

/**
 * Calculate comprehensive AQI from all pollutant readings
 * Uses EPA's maximum pollutant rule
 */
export function calculateAQI(reading: {
  pm25?: number | null;
  pm10?: number | null;
  no2?: number | null;
  co?: number | null;
  o3?: number | null;
  so2?: number | null;
}): AQICalculationResult {
  const pollutantAQIs: Record<string, PollutantAQI> = {};
  let maxAQI = 0;
  let dominantPollutant = 'Unknown';

  // Calculate AQI for each available pollutant
  if (reading.pm25 !== null && reading.pm25 !== undefined) {
    const { aqi, level } = calculatePollutantAQI(reading.pm25, AQI_BREAKPOINTS.pm25);
    pollutantAQIs.pm25 = { pollutant: 'PM2.5', concentration: reading.pm25, aqi, level };
    if (aqi && aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = 'PM2.5';
    }
  }

  if (reading.pm10 !== null && reading.pm10 !== undefined) {
    const { aqi, level } = calculatePollutantAQI(reading.pm10, AQI_BREAKPOINTS.pm10);
    pollutantAQIs.pm10 = { pollutant: 'PM10', concentration: reading.pm10, aqi, level };
    if (aqi && aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = 'PM10';
    }
  }

  if (reading.no2 !== null && reading.no2 !== undefined) {
    const { aqi, level } = calculatePollutantAQI(reading.no2, AQI_BREAKPOINTS.no2);
    pollutantAQIs.no2 = { pollutant: 'NO₂', concentration: reading.no2, aqi, level };
    if (aqi && aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = 'NO₂';
    }
  }

  if (reading.co !== null && reading.co !== undefined) {
    const { aqi, level } = calculatePollutantAQI(reading.co, AQI_BREAKPOINTS.co);
    pollutantAQIs.co = { pollutant: 'CO', concentration: reading.co, aqi, level };
    if (aqi && aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = 'CO';
    }
  }

  if (reading.o3 !== null && reading.o3 !== undefined) {
    const { aqi, level } = calculatePollutantAQI(reading.o3, AQI_BREAKPOINTS.o3);
    pollutantAQIs.o3 = { pollutant: 'O₃', concentration: reading.o3, aqi, level };
    if (aqi && aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = 'O₃';
    }
  }

  if (reading.so2 !== null && reading.so2 !== undefined) {
    const { aqi, level } = calculatePollutantAQI(reading.so2, AQI_BREAKPOINTS.so2);
    pollutantAQIs.so2 = { pollutant: 'SO₂', concentration: reading.so2, aqi, level };
    if (aqi && aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = 'SO₂';
    }
  }

  // Determine health implications based on overall AQI
  const getHealthInfo = (aqi: number): { implication: string; recommendation: string } => {
    if (aqi <= 50) {
      return {
        implication: 'Good - Air quality is satisfactory',
        recommendation: 'No health impacts expected; enjoy outdoor activities',
      };
    } else if (aqi <= 100) {
      return {
        implication: 'Moderate - Air quality is acceptable',
        recommendation: 'Some sensitive groups (children, elderly) may experience minor impacts',
      };
    } else if (aqi <= 150) {
      return {
        implication: 'Unhealthy for Sensitive Groups',
        recommendation: 'Sensitive groups should limit prolonged outdoor exertion',
      };
    } else if (aqi <= 200) {
      return {
        implication: 'Unhealthy - Health alert issued',
        recommendation: 'General public may experience health effects; avoid outdoor activities',
      };
    } else if (aqi <= 300) {
      return {
        implication: 'Very Unhealthy - Health warning',
        recommendation: 'Everyone should avoid outdoor activities; consider staying indoors',
      };
    } else {
      return {
        implication: 'Hazardous - Health emergency',
        recommendation: 'Avoid all outdoor activities; wear N95 masks if venturing outside',
      };
    }
  };

  const { implication, recommendation } = getHealthInfo(maxAQI);

  return {
    overall_aqi: maxAQI,
    dominant_pollutant: dominantPollutant,
    pollutant_breakdown: pollutantAQIs,
    health_implication: implication,
    recommendation,
  };
}

/**
 * Get AQI color for UI visualization
 */
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00E400'; // Green
  if (aqi <= 100) return '#FFFF00'; // Yellow
  if (aqi <= 150) return '#FF7E00'; // Orange
  if (aqi <= 200) return '#FF0000'; // Red
  if (aqi <= 300) return '#8F3F97'; // Purple
  return '#7E0023'; // Maroon
}

/**
 * Get AQI category name
 */
export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export { PollutantAQI, AQICalculationResult };
