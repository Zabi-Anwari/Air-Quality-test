
import { query } from '../lib/db/index';
import { env } from '../lib/env';

async function diagnose() {
    try {
        console.log('--- DB DIAGNOSIS ---');
        const sensors = await query('SELECT id, name, location_name, device_id FROM sensors');
        console.log(`Sensors Count: ${sensors.rows.length}`);
        if (sensors.rows.length > 0) {
            console.table(sensors.rows);
        }

        const readings = await query('SELECT COUNT(*) as count FROM sensor_readings');
        console.log(`Readings Count: ${readings.rows[0].count}`);

        const calculations = await query('SELECT COUNT(*) as count FROM aqi_calculations');
        console.log(`AQI Calculations Count: ${calculations.rows[0].count}`);

        // Check for duplicates in sensors
        const duplicates = await query('SELECT name, COUNT(*) FROM sensors GROUP BY name HAVING COUNT(*) > 1');
        if (duplicates.rows.length > 0) {
            console.log('DUPLICATE SENSORS FOUND:');
            console.table(duplicates.rows);
        } else {
            console.log('No duplicate sensors by name.');
        }

    } catch (err) {
        console.error('Diagnosis failed:', err);
    }
}

diagnose();
