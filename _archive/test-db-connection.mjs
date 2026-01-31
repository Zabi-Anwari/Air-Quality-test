#!/usr/bin/env node
/**
 * Database Connection Diagnostic Tool
 * Run this to test your Supabase connection
 */

import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

console.log('🔍 Supabase Connection Diagnostic\n');
console.log('━'.repeat(60));

if (!connectionString) {
  console.log('❌ ERROR: DATABASE_URL not found in .env');
  process.exit(1);
}

// Parse connection string
try {
  const url = new URL(connectionString);
  console.log('✅ Connection string is valid URL format');
  console.log('\n📊 Connection Details:');
  console.log(`   Protocol: ${url.protocol}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port}`);
  console.log(`   Database: ${url.pathname}`);
  console.log(`   SSL Mode: ${url.searchParams.get('sslmode') || 'not set'}`);

  console.log('\n🌐 Checking hostname resolution...');

  // Try to resolve the hostname
  import('dns').then(({ resolve4 }) => {
    resolve4(url.hostname, (err, addresses) => {
      if (err) {
        console.log(`❌ DNS Resolution Failed: ${err.message}`);
        console.log(`\n⚠️  Cannot resolve: ${url.hostname}`);
        console.log('\n💡 Possible causes:');
        console.log('   1. Internet connection issue');
        console.log('   2. Wrong Supabase project ID');
        console.log('   3. Supabase region not accessible');
        console.log('   4. DNS server issues');
        console.log('\n🔧 Solutions:');
        console.log('   1. Check internet: ping google.com');
        console.log('   2. Verify project ID in Supabase Dashboard');
        console.log('   3. Check Supabase project status (not suspended)');
        console.log('   4. Try again in a few moments');
      } else {
        console.log(`✅ DNS Resolution Success: ${addresses[0]}`);
        console.log('\n🎉 Connection string appears valid!');
        console.log('\nTrying to connect to database...');

        // Try connecting
        import('pg').then(({ Pool }) => {
          // Explicitly disable strict SSL verification for testing
          // This matches the app's behavior in lib/db/index.ts
          const pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false }
          });
          pool.query('SELECT NOW()', (err, result) => {
            if (err) {
              console.log(`❌ Database Connection Failed: ${err.message}`);
            } else {
              console.log('✅ Database Connection Successful!');
              console.log(`   Server Time: ${result.rows[0].now}`);
              console.log('\n🚀 You can now run: npm run server');
            }
            pool.end();
          });
        });
      }
    });
  });

} catch (err) {
  console.log(`❌ Invalid connection string format: ${err.message}`);
  console.log(`\nYour DATABASE_URL: ${connectionString}`);
}
