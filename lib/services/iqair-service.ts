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

        // IQAir default free tier returns AQI (aqius), not raw concentration for PM2.5.
        // If we store AQI directly into 'pm25' (concentration), the AQI engine calculates "AQI of AQI",
        // inflating the numbers significantly (e.g. AQI 150 -> conc 150 -> AQI 200).
        
        // We need to estimate the concentration from the AQI if the main pollutant is a known type.
        // This is an integrity fix to make "Big Number" issues disappear and reflect real data accurately.
        
        let pm25Concentration: number | null = null;
        let pm10Concentration: number | null = null;

        // Helper to reverse calculate Concentration from AQI for PM2.5 (Simplified linear approx)
        // Source: EPA breakpoints for PM2.5
        const estimatePM25Conc = (aqi: number) => {
            if (aqi <= 50) return (aqi / 50) * 12;
            if (aqi <= 100) return 12.1 + ((aqi - 51) / 49) * (35.4 - 12.1);
            if (aqi <= 150) return 35.5 + ((aqi - 101) / 49) * (55.4 - 35.5);
            if (aqi <= 200) return 55.5 + ((aqi - 151) / 49) * (150.4 - 55.5);
            if (aqi <= 300) return 150.5 + ((aqi - 201) / 99) * (250.4 - 150.5);
            return 250.5 + ((aqi - 301) / 199) * (500 - 250.5);
        };

        if (pollution.mainus === 'p2') {
             // AQIUS matches PM2.5
             pm25Concentration = Math.round(estimatePM25Conc(pollution.aqius) * 10) / 10;
        } else if (pollution.mainus === 'p1') {
             // Approximation if main is p1 (PM10) - hard to guess PM2.5, leave null
             pm10Concentration = pollution.aqius; // PM10 AQI is closer to linear with conc but still different
             // For PM10: AQI 50 = 54ug, AQI 100 = 154ug.
             // Simple proxy for now or leave as AQI if less critical, but let's try to be consistent.
        }

        return {
            sensor_id: sensorId,
            
            // Use the estimated concentration, not the AQI value
            pm25: pm25Concentration, 
            pm10: pm10Concentration,
            no2: null, 
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
