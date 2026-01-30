import { env } from '../env';
import { getSensors } from '../data-access';
import { iqAirService } from './iqair-service';
import { calculateAQI } from './aqi-engine';
import { generateAndStoreForecasts } from './forecast-service';
import { query } from '../db/index';

/**
 * Start the background job to fetch IQAir data
 */
export function startDataIngestion() {
    if (env.DATA_SOURCE !== 'iqair') {
        console.log('ℹ️ Data Source is not "iqair". Starting mock data ingestion.');
        console.log(`   Refresh Interval: ${env.SENSOR_DATA_REFRESH_INTERVAL}ms`);

        // Run on startup
        setTimeout(() => {
            fetchAndStoreMockData();
        }, 2000);

        // Schedule periodic runs - Use a safe default of 1 minute if env is too aggressive
        const interval = Math.max(env.SENSOR_DATA_REFRESH_INTERVAL, 60000);
        setInterval(fetchAndStoreMockData, interval);
        return;
    }

    console.log('🚀 Starting IQAir Data Ingestion Service...');
    console.log(`   Refresh Interval: ${env.SENSOR_DATA_REFRESH_INTERVAL}ms`);

    // Run on startup with a delay to prevent conflict/rate-limits
    setTimeout(() => {
        fetchAndStoreData();
    }, 10000);

    // Schedule periodic runs - Use a safe default of 5 minutes if env is too aggressive
    const interval = Math.max(env.SENSOR_DATA_REFRESH_INTERVAL, 300000);
    setInterval(fetchAndStoreData, interval);

    if (env.ENABLE_FORECASTING) {
        console.log('📈 Forecasting enabled. Scheduling forecast generation...');

        setTimeout(() => {
            generateAndStoreForecasts();
        }, 30000);

        const forecastInterval = Math.max(env.FORECAST_GENERATION_INTERVAL, 3600000);
        setInterval(generateAndStoreForecasts, forecastInterval);
    }
}


let isIngestionRunning = false;
let iqairCursor = 0;

function generateMockSensorReading(sensorId: number) {
    const now = new Date();
    const pm25 = Math.round(Math.random() * 120 + 5);
    const pm10 = Math.round(Math.random() * 180 + 10);
    const no2 = Math.round(Math.random() * 80 + 5);
    const co = Math.round((Math.random() * 2 + 0.2) * 10) / 10;
    const o3 = Math.round(Math.random() * 90 + 5);
    const so2 = Math.round(Math.random() * 50 + 2);
    const temperature = Math.round((Math.random() * 25 + 5) * 10) / 10;
    const humidity = Math.round(Math.random() * 60 + 20);
    const pressure = Math.round(Math.random() * 30 + 980);
    const wind_speed = Math.round((Math.random() * 8 + 1) * 10) / 10;

    return {
        sensor_id: sensorId,
        pm25,
        pm10,
        no2,
        co,
        o3,
        so2,
        temperature,
        humidity,
        pressure,
        wind_speed,
        timestamp: now.toISOString(),
    };
}

async function fetchAndStoreData() {
    if (isIngestionRunning) {
        console.log(`[${new Date().toISOString()}] ⚠️ Ingestion job already running, skipping this interval.`);
        return;
    }

    isIngestionRunning = true;
    console.log(`[${new Date().toISOString()}] 🔄 Fetching latest air quality data...`);

    try {
        // 1. Get all active sensors
        const sensors = await getSensors();
        const activeSensors = sensors.filter((sensor) => sensor.is_active);
        console.log(`   Found ${activeSensors.length} sensors to update.`);

        if (activeSensors.length === 0) {
            console.log('   No active sensors found. Skipping.');
            return;
        }

        const maxSensors = Math.max(env.IQAIR_MAX_SENSORS_PER_CYCLE, 1);
        const requestDelay = Math.max(env.IQAIR_REQUEST_DELAY_MS, 15000);

        // Rotate through sensors in batches to avoid rate limits
        const batch: typeof activeSensors = [];
        for (let i = 0; i < Math.min(maxSensors, activeSensors.length); i++) {
            const index = (iqairCursor + i) % activeSensors.length;
            batch.push(activeSensors[index]);
        }
        iqairCursor = (iqairCursor + batch.length) % activeSensors.length;

        let successCount = 0;

        // 2. Iterate and fetch data for each
        for (const sensor of batch) {
            try {
                // Fetch from IQAir
                // @ts-ignore - Types are still propagating
                const iqData = await iqAirService.getNearestCityData(sensor.latitude, sensor.longitude);

                if (iqData) {
                    const reading = iqAirService.mapToSensorReading(sensor.id, iqData);

                    // 3. Insert into DB
                    await insertReading(reading);

                    // 4. Calculate and Insert AQI
                    const aqiResult = calculateAQI(reading);
                    await insertAQICalculation(reading.sensor_id, aqiResult);

                    successCount++;
                }

                // Delay between requests to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, requestDelay));
            } catch (err) {
                console.error(`   ❌ Failed to update sensor ${sensor.device_id}:`, (err as Error).message);

                // Even on error, wait a bit to avoid hammering API if it's a rate limit error
                await new Promise(resolve => setTimeout(resolve, requestDelay));
            }
        }

        console.log(`✅ Data Ingestion Complete. Updated ${successCount}/${batch.length} sensors in this cycle.`);

    } catch (error) {
        console.error('❌ Data Ingestion Job Failed:', error);
    } finally {
        isIngestionRunning = false;
    }
}

async function fetchAndStoreMockData() {
    if (isIngestionRunning) {
        console.log(`[${new Date().toISOString()}] ⚠️ Ingestion job already running, skipping this interval.`);
        return;
    }

    isIngestionRunning = true;
    console.log(`[${new Date().toISOString()}] 🔄 Generating mock air quality data...`);

    try {
        const sensors = await getSensors();
        console.log(`   Found ${sensors.length} sensors to update.`);

        let successCount = 0;
        for (const sensor of sensors) {
            if (!sensor.is_active) continue;

            const reading = generateMockSensorReading(sensor.id);
            await insertReading(reading);

            const aqiResult = calculateAQI(reading);
            await insertAQICalculation(reading.sensor_id, aqiResult);

            successCount++;
        }

        console.log(`✅ Mock ingestion complete. Updated ${successCount}/${sensors.length} sensors.`);
    } catch (error) {
        console.error('❌ Mock ingestion failed:', error);
    } finally {
        isIngestionRunning = false;
    }
}

async function insertReading(reading: any) {
    const sql = `
    INSERT INTO sensor_readings 
    (sensor_id, pm25, pm10, no2, co, o3, so2, temperature, humidity, pressure, wind_speed, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
  `;

    const params = [
        reading.sensor_id,
        // Use 0 or existing logic? DB now allows nulls, so let's stick to reading values.
        reading.pm25,
        reading.pm10,
        reading.no2,
        reading.co,
        reading.o3,
        reading.so2,
        reading.temperature,
        reading.humidity,
        reading.pressure,
        reading.wind_speed
    ];

    await query(sql, params);
}

async function insertAQICalculation(sensorId: number, aqiData: any) {
    const sql = `
    INSERT INTO aqi_calculations 
    (sensor_id, aqi_overall, pm25_aqi, pm10_aqi, no2_aqi, co_aqi, o3_aqi, dominant_pollutant, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  `;

    const params = [
        sensorId,
        aqiData.overall_aqi,
        aqiData.pollutant_breakdown.pm25?.aqi || null,
        aqiData.pollutant_breakdown.pm10?.aqi || null,
        aqiData.pollutant_breakdown.no2?.aqi || null,
        aqiData.pollutant_breakdown.co?.aqi || null,
        aqiData.pollutant_breakdown.o3?.aqi || null,
        aqiData.dominant_pollutant
    ];

    await query(sql, params);
}


