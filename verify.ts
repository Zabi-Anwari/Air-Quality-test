
import { query } from './lib/db/index';
import { env } from './lib/env';

async function checkDataAuthenticity() {
    console.log("🔍 Diagnostic Report: Air Quality Data Authenticity");
    console.log("==================================================");
    
    // 1. Check Configuration
    console.log(`\n1. Environment Configuration:`);
    console.log(`   DATA_SOURCE: ${env.DATA_SOURCE} (Default is 'mock' if undefined)`);
    console.log(`   IQAIR_API_KEY: ${env.IQAIR_API_KEY ? '****** (Set)' : 'Not Set'}`);
    
    // 2. Check Database Patterns
    console.log(`\n2. Database Data Analysis:`);
    try {
        const result = await query(`
            SELECT pm25, pm10, temperature, timestamp 
            FROM sensor_readings 
            ORDER BY timestamp DESC 
            LIMIT 10
        `);
        
        console.log(`   Last 10 Readings:`);
        if (result.rows.length === 0) {
            console.log("   No readings found.");
        } else {
            result.rows.forEach((row, i) => {
                console.log(`   Reading ${i+1}: PM2.5=${row.pm25}, Temp=${row.temperature}, Time=${new Date(row.timestamp).toISOString()}`);
            });
            
            // basic heuristic for randomness
            const values = result.rows.map(r => r.pm25);
            const distinct = new Set(values).size;
            console.log(`   Distinct PM2.5 values in last 10 readings: ${distinct}/10`);
            
            if (distinct > 8 && env.DATA_SOURCE !== 'iqair') {
                 console.log("\n   ⚠️  Observation: Data is highly variable but DATA_SOURCE is not 'iqair'. This confirms Mock Data generation.");
            }
        }
    } catch (err) {
        console.error("   Error querying database:", err.message);
    }

    console.log("\n==================================================");
    console.log("CONCLUSION:");
    if (env.DATA_SOURCE === 'iqair' && env.IQAIR_API_KEY) {
         console.log("✅ The system is configured for Real Live Data (IQAir).");
    } else {
         console.log("❌ The system is currently running on SIMULATED (MOCK) DATA.");
         console.log("   Reason: DATA_SOURCE env variable is not set to 'iqair' or API key is missing.");
    }
    process.exit(0);
}

checkDataAuthenticity();
