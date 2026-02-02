
import { iqAirService } from '../lib/services/iqair-service';
import { env } from '../lib/env';

async function testLiveIQAirData() {
    console.log("🔍 Checking Live Data from IQAir...");
    
    // Almaty Coordinates (Republic Square approx)
    const lat = 43.238949; 
    const lon = 76.889709;

    if (!env.IQAIR_API_KEY) {
        console.error("❌ No API Key found in env!");
        return;
    }

    try {
        console.log(`📡 Fetching data for Lat: ${lat}, Lon: ${lon}...`);
        console.log(`🔑 Using Key starts with: ${env.IQAIR_API_KEY.substring(0, 4)}...`);
        
        // Call the service method directly found in lib/services/iqair-service.ts
        // But since we can't easily import the internal fetch without running the server context sometimes,
        // let's just reproduce the fetch here to see the RAW JSON.
        
        const url = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${env.IQAIR_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("\n⬇️  RAW RESPONSE FROM IQAIR API:");
        console.log(JSON.stringify(data, null, 2));

        if (data.status === 'success') {
            const aqius = data.data.current.pollution.aqius;
            console.log(`\n✅ OFFICIAL AIRVISUAL AQI for this location: ${aqius}`);
            
            if (aqius > 150) {
                console.log("⚠️  CONFIRMED: The air quality is genuinely reported as UNHEALTHY/VERY UNHEALTHY by the data provider.");
                console.log("   The high numbers you see in the dashboard are ACCURATE relative to the source.");
            } else {
                console.log("❓ MISMATCH: The API reports low numbers, but Dashboard shows high. This would indicate a bug.");
            }
        } else {
            console.log("❌ API Verification Failed:", data.data.message);
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testLiveIQAirData();
