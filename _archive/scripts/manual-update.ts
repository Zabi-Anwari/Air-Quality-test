import 'dotenv/config'; // Load env vars first
import { getSensors } from '../lib/data-access';
import { iqAirService } from '../lib/services/iqair-service';
import { query } from '../lib/db/index';

async function run() {
    console.log('🔄 Manually fetching IQAir data...');
    const sensors = await getSensors();
    console.log(`Found ${sensors.length} sensors.`);

    // Update just the first 3 active sensors to save quota/time
    let count = 0;
    for (const sensor of sensors) {
        if (!sensor.is_active) continue;
        if (count >= 3) break;

        try {
            console.log(`Fetching for ${sensor.city} (${sensor.latitude}, ${sensor.longitude})...`);
            const iqData = await iqAirService.getNearestCityData(sensor.latitude, sensor.longitude);

            if (iqData) {
                const reading = iqAirService.mapToSensorReading(sensor.id, iqData);
                await insertReading(reading);
                console.log(`✅ Updated ${sensor.city}: AQI ${reading.pm25} (approx)`);
                count++;
                // Delay to avoid rate limit
                await new Promise(r => setTimeout(r, 12000));
            }
        } catch (e) {
            console.error(`❌ Failed: ${e.message}`);
        }
    }
    console.log('Done.');
    process.exit(0);
}

async function insertReading(reading: any) {
    const sql = `
    INSERT INTO sensor_readings 
    (sensor_id, pm25, pm10, no2, co, o3, so2, temperature, humidity, pressure, wind_speed, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `;
    const params = [
        reading.sensor_id, reading.pm25, reading.pm10, reading.no2, reading.co, reading.o3, reading.so2,
        reading.temperature, reading.humidity, reading.pressure, reading.wind_speed, reading.timestamp
    ];
    await query(sql, params);
}

run();
