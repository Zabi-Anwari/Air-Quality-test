
import { query, getPool } from '../lib/db/index';
import 'dotenv/config';

async function migrate() {
    console.log('🔄 Running migration: Allow NULL values for pollutants...');

    try {
        // Relax constraints on sensor_readings
        await query(`ALTER TABLE sensor_readings ALTER COLUMN pm25 DROP NOT NULL;`);
        console.log('✅ pm25 constraint dropped');

        await query(`ALTER TABLE sensor_readings ALTER COLUMN pm10 DROP NOT NULL;`);
        console.log('✅ pm10 constraint dropped');

        await query(`ALTER TABLE sensor_readings ALTER COLUMN no2 DROP NOT NULL;`);
        console.log('✅ no2 constraint dropped');

        await query(`ALTER TABLE sensor_readings ALTER COLUMN co DROP NOT NULL;`);
        console.log('✅ co constraint dropped');

        await query(`ALTER TABLE sensor_readings ALTER COLUMN o3 DROP NOT NULL;`);
        console.log('✅ o3 constraint dropped');

        await query(`ALTER TABLE sensor_readings ALTER COLUMN so2 DROP NOT NULL;`);
        console.log('✅ so2 constraint dropped');

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        const pool = getPool();
        await pool.end();
    }
}

migrate();
