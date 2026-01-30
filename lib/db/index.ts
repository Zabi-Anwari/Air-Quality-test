import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { migrations } from './schema';
import { env } from '../env';

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please add it to your environment before using the database client.');
}

const ssl = process.env.PGSSLMODE === 'require' || connectionString.includes('sslmode=require') || !connectionString.includes('localhost')
  ? { rejectUnauthorized: false }
  : undefined;

const pool = new Pool({
  connectionString,
  max: Number(process.env.PGPOOL_MAX || 10),
  ssl,
  // Disable automatic connection attempts on pool creation
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Don't validate connections on pool creation

});

pool.on('error', (err: any) => {
  // Prevent pooled client errors from crashing the process.
  console.error('Unexpected PostgreSQL client error', err);
});

pool.on('connect', () => {
  console.log('Database connection established');
});

export const query = async <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export const withClient = async <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
};

export const runMigrations = async (): Promise<void> => {
  for (const statement of migrations) {
    await pool.query(statement);
  }
};

export const getPool = (): Pool => pool;
