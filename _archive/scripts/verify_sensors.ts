
import { query, getPool } from '../lib/db/index';
// Ensure env is loaded
import 'dotenv/config';

async function verifySensors() {
    console.log('🔍 Verifying Sensors...');

    try {
        const result = await query('SELECT id, device_id, name, location_name, city, is_active FROM sensors');

        console.log(`Found ${result.rows.length} sensors:`);
        console.table(result.rows);

        const allAlmaty = result.rows.every((row: any) => row.city.includes('Almaty'));

        if (result.rows.length > 0 && allAlmaty) {
            console.log('✅ Verification Succcess: All sensors are in Almaty region!');
        } else {
            console.error('❌ Verification Failed: Found non-Almaty sensors or no sensors.');
        }
    } catch (error) {
        console.error('❌ Verification Error:', error);
    } finally {
        const pool = getPool();
        await pool.end();
    }
}

verifySensors();
