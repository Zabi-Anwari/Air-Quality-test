/**
 * Express API Server - Main entry point for backend REST API
 * Handles all HTTP routes and middleware setup
 */

// Load environment variables FIRST, before anything else
import { env } from './env';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { runMigrations } from './db/index';

// Import route handlers
import sensorRoutes from './routes/sensors';
import aqiRoutes from './routes/aqi';
import alertRoutes from './routes/alerts';
import forecastRoutes from './routes/forecast';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: 'demo'
  });
});

// Simple test endpoint
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working' });
});

// API Routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/forecast', forecastRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize server
const startServer = async () => {
  try {
    console.log('Running database migrations...');
    try {
      await runMigrations();
      console.log('✅ Database migrations completed');

      // Start Real Data Ingestion if enabled
      const { startDataIngestion } = await import('./services/scheduler');
      startDataIngestion();

    } catch (dbError) {
      console.warn('⚠️  Database connection failed, starting server in demo mode');
      console.warn(`   Error: ${(dbError as Error).message}`);
      console.warn('   API endpoints will return demo data');
    }

    const port = parseInt(PORT as string, 10) || 3001;
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${port}`);
      console.log(`✅ API Health Check: http://localhost:${port}/api/health`);
      console.log(`✅ API Docs: Check DEPLOYMENT.md for endpoint reference`);
    });

    server.on('error', (err: any) => {
      console.error('Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  process.exit(0);
});

export default app;
