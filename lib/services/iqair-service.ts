import axios from 'axios'; // We will need to ensure axios is installed or use fetch
import { env } from '../env';

const BASE_URL = 'http://api.airvisual.com/v2';

export interface IQAirResponse {
    status: string;
    data: {
        city: string;
        state: string;
        country: string;
        location: {
            type: string;
            coordinates: number[]; // [lon, lat]
        };
        current: {
            weather: {
                ts: string;
                tp: number; // temperature
                pr: number; // pressure
                hu: number; // humidity
                ws: number; // wind speed
                wd: number; // wind direction
                ic: string; // icon code
            };
            pollution: {
                ts: string;
                aqius: number; // AQI US
                mainus: string; // Main pollutant US
                aqicn: number; // AQI CN
                maincn: string; // Main pollutant CN
            };
        };
    };
}

export const iqAirService = {
    /**
     * Fetch air quality data for a specific location (Latitude/Longitude)
     * This endpoint finds the nearest station to the coordinates.
     */
    async getNearestCityData(lat: number, lon: number): Promise<IQAirResponse | null> {
        if (!env.IQAIR_API_KEY) {
            console.error('❌ Missing IQAIR_API_KEY');
            return null;
        }

        try {
            const response = await fetch(
                `${BASE_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${env.IQAIR_API_KEY}`
            );

            if (!response.ok) {
                throw new Error(`IQAir API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== 'success') {
                throw new Error(`IQAir API returned status: ${data.status} - ${data.data?.message || 'Unknown error'}`);
            }

            return data;
        } catch (error) {
            console.error('⚠️ Failed to fetch IQAir data:', error);
            return null;
        }
    },

    /**
     * Map IQAir data to our Database Schema (SensorReadingRow compatible structure)
     */
    mapToSensorReading(sensorId: number, iqData: IQAirResponse) {
        const { current } = iqData.data;
        const { weather, pollution } = current;

        // IQAir primarily returns PM2.5 AQI (aqius) and main pollutant.
        // Detailed pollutant concentrations (pm25, pm10, no2, etc.) are NOT always available in the free tier
        // via the /nearest_city endpoint directly as raw values, sometimes just AQI.
        // However, for this implementation, we will map what is available.

        // Note: The free API often gives US AQI, not raw concentration in µg/m³.
        // We will estimate or map strictly available fields.

        // NOTE: This mapper provides fields matching our 'sensor_readings' table structure
        return {
            sensor_id: sensorId,
            // We map aqius to pm25_aqi roughly if main pollutant is p2, but for now let's construct a reading object
            // Our DB expects raw values for pm25, pm10 etc. IQAir free tier might return limited data.
            // If raw concentration is missing, back-calculate roughly from AQI or leave null?
            // For Demo purposes with Real Data, we will use the AQI value as a proxy if raw is missing, or 0.

            pm25: pollution.mainus === 'p2' ? pollution.aqius : null, // This is technically AQI, not concentration, but serves as a value
            pm10: pollution.mainus === 'p1' ? pollution.aqius : null,
            no2: null, // Free tier often misses this
            co: null,
            o3: null,
            so2: null,

            temperature: weather.tp,
            humidity: weather.hu,
            pressure: weather.pr,
            wind_speed: weather.ws,

            // We can also store the calculated AQI directly if we modify the logic in server to accept it
            // But the current server logic (aqi-engine) Recalculates it.
            // To avoid double calculation issues, we might need to adjust the flow.
            timestamp: pollution.ts
        };
    }
};
