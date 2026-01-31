
import { startDataIngestion } from '../lib/services/scheduler';

console.log('Triggering data ingestion...');
// We can't easily await startDataIngestion because it sets intervals, 
// but we can let it run for a bit then exit.
// However, startDataIngestion has a 10s delay.
// We will modify this script to import the internal function if possible, or just wait.
// Actually, let's just use the server or wait.
// Better: verify by running the actual scheduler logic via a slightly modified approach or just running the server for a minute.
// But for this script, let's just try to invoke it and keep process alive for 20s.

startDataIngestion();

setTimeout(() => {
    console.log('Time out reached, exiting...');
    process.exit(0);
}, 25000); // Wait 25s (10s delay + processing)
