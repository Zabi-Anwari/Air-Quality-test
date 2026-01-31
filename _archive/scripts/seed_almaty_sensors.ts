
import { query, getPool } from '../lib/db/index';
// Ensure env is loaded if not already by lib/db/index
import 'dotenv/config';

const almatySensors = [
    // City Districts
    { device_id: 'alm-001', name: 'Almaly District (Central)', location_name: 'Almaly', lat: 43.25, lng: 76.93, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-002', name: 'Medeu District (City)', location_name: 'Medeu City', lat: 43.23, lng: 76.96, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-003', name: 'Bostandyk District (Residential)', location_name: 'Bostandyk', lat: 43.21, lng: 76.91, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-004', name: 'Auezov District (West)', location_name: 'Auezov', lat: 43.24, lng: 76.85, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-005', name: 'Alatau District (North West)', location_name: 'Alatau', lat: 43.30, lng: 76.80, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-006', name: 'Jetysu District (North Central)', location_name: 'Jetysu', lat: 43.32, lng: 76.94, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-007', name: 'Turksib District (North, Industrial)', location_name: 'Turksib', lat: 43.35, lng: 76.98, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'alm-008', name: 'Nauryzbay District (New West)', location_name: 'Nauryzbay', lat: 43.19, lng: 76.82, city: 'Almaty', country: 'Kazakhstan' },

    // Rural & Surroundings
    { device_id: 'rut-001', name: 'Talgar (East Satellite)', location_name: 'Talgar', lat: 43.30, lng: 77.24, city: 'Almaty Region', country: 'Kazakhstan' },
    { device_id: 'rut-002', name: 'Kaskelen (West Satellite)', location_name: 'Kaskelen', lat: 43.20, lng: 76.62, city: 'Almaty Region', country: 'Kazakhstan' },
    { device_id: 'rut-003', name: 'Boraldai (North Rural)', location_name: 'Boraldai', lat: 43.36, lng: 76.86, city: 'Almaty Region', country: 'Kazakhstan' },
    { device_id: 'rut-004', name: 'Gres (Otegen Batyr)', location_name: 'Otegen Batyr', lat: 43.42, lng: 77.02, city: 'Almaty Region', country: 'Kazakhstan' },
    { device_id: 'rut-005', name: 'Medeu (Mountain Resort)', location_name: 'Medeu Mountain', lat: 43.15, lng: 77.05, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'rut-006', name: 'Shymbulak (Mountain Resort)', location_name: 'Shymbulak', lat: 43.12, lng: 77.08, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'rut-007', name: 'Airport Area', location_name: 'Airport', lat: 43.35, lng: 77.03, city: 'Almaty', country: 'Kazakhstan' },
    { device_id: 'rut-008', name: 'Esik (Far East)', location_name: 'Esik', lat: 43.35, lng: 77.45, city: 'Almaty Region', country: 'Kazakhstan' },
    { device_id: 'rut-009', name: 'Uzynagash (Far West)', location_name: 'Uzynagash', lat: 43.21, lng: 76.32, city: 'Almaty Region', country: 'Kazakhstan' },
    { device_id: 'rut-010', name: 'Kapchagay (Konayev)', location_name: 'Konayev', lat: 43.87, lng: 77.06, city: 'Almaty Region', country: 'Kazakhstan' },
];

async function seedSensors() {
    console.log('🌱 Starting Almaty Sensors Seed...');

    try {
        // 1. Delete existing readings to avoid constraint violations if not cascaded (safest bet)
        // Note: If you want to keep history, you'd need a more complex migration or just add new sensors.
        // The requirement was "remove other places", implying a clean slate or focus on Almaty.
        // For this implementation, we will CLEAR existing sensors to ensure only Almaty exists.

        console.log('Element: Deleting existing sensor readings...');
        await query('DELETE FROM sensor_readings');
        await query('DELETE FROM aqi_calculations');
        await query('DELETE FROM alerts');

        console.log('🗑️  Deleting existing sensors...');
        await query('DELETE FROM sensors');

        // 2. Insert new sensors
        console.log(`📦 Inserting ${almatySensors.length} new sensors...`);

        for (const sensor of almatySensors) {
            await query(
                `INSERT INTO sensors (device_id, name, location_name, latitude, longitude, city, country, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
                [sensor.device_id, sensor.name, sensor.location_name, sensor.lat, sensor.lng, sensor.city, sensor.country]
            );
        }

        console.log('✅ Seed completed successfully!');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    } finally {
        const pool = getPool();
        await pool.end();
    }
}

seedSensors();
