import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

console.log('--- DB Debugger ---');
console.log('URL:', connectionString.replace(/:([^:@]+)@/, ':****@')); // Hide password

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Explicitly allow self-signed/pooler certs
    connectionTimeoutMillis: 5000,
});

pool.connect()
    .then(client => {
        console.log('✅ Connected successfully!');
        return client.query('SELECT NOW()')
            .then(res => {
                console.log('Time:', res.rows[0].now);
                client.release();
                process.exit(0);
            });
    })
    .catch(err => {
        console.error('❌ Connection Failed');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        console.error('Error Code:', err.code);
        if (err.routine) console.error('Routine:', err.routine);
        console.error('Full Error:', err);
        process.exit(1);
    });
