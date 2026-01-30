import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const run = async () => {
  const res = await pool.query('select id, latitude, longitude from sensors order by id asc limit 1');
  const s = res.rows[0];
  console.log('sensor', s);

  const url = `http://api.airvisual.com/v2/nearest_city?lat=${s.latitude}&lon=${s.longitude}&key=${process.env.IQAIR_API_KEY}`;
  const resp = await fetch(url);
  console.log('iqair status', resp.status, resp.statusText);
  const data = await resp.json();
  console.log('iqair body', data);
  console.log('iqair pollution ts', data?.data?.current?.pollution?.ts);

  await pool.end();
};

run().catch((err) => {
  console.error('diagnose failed', err);
  process.exit(1);
});
