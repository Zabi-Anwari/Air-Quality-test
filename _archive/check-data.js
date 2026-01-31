import { query } from './lib/db/index';
import 'dotenv/config';

async function checkData() {
    console.log('Checking for recent sensor readings...');
    const res = await query(`
    SELECT count(*) as count, max(timestamp) as last_update 
    FROM sensor_readings
  `);
    console.log('Total Readings:', res.rows[0].count);
    console.log('Last Update:', res.rows[0].last_update);
    process.exit(0);
}

checkData();
