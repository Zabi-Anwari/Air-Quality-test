# Air Quality Intelligence Platform

**A production-ready, scalable, real-time air quality monitoring and forecasting system for smart cities.**

## 🌟 Features

### Core Monitoring
- ✅ Real-time AQI calculations (EPA/WHO standards)
- ✅ Multi-pollutant tracking (PM2.5, PM10, NO₂, CO, O₃, SO₂)
- ✅ Sensor health monitoring and failure detection
- ✅ Time-series data storage with proper indexing

### Intelligent Alerts
- ✅ Threshold-based alerts (AQI > 150/200)
- ✅ Pollution spike detection (25%+ increase in 15 min)
- ✅ Sensor offline/stale detection
- ✅ Customizable severity levels

### Advanced Analytics
- ✅ 6-hour AQI forecasting (exponential smoothing + regression)
- ✅ Historical data queries (24h, 7d, 30d views)
- ✅ Statistical analysis (min/max/avg/stddev)
- ✅ Trend visualization

### User Experience  
- ✅ Modern, responsive dashboard
- ✅ Interactive geospatial map
- ✅ Historical data charts
- ✅ Health recommendations
- ✅ Real-time alert notifications

## 📊 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+

### Installation & Run

```bash
# Install
npm install

# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server

# Open: http://localhost:5173
```

## 🏗 Architecture

```
lib/ (Backend - Express + TypeScript)
├── services/
│   ├── aqi-engine.ts          # AQI calculations
│   ├── alert-service.ts       # Alert management
│   ├── forecast-service.ts    # Time-series forecasting
│   └── sensor-health.ts       # Sensor monitoring
├── routes/
│   ├── aqi.ts                 # AQI endpoints
│   ├── alerts.ts              # Alert endpoints
│   ├── forecast.ts            # Forecast endpoints
│   └── sensors.ts             # Sensor endpoints
└── config/
    └── city-config.ts         # Multi-city support

src/ (Frontend - React + Vite)
├── components/
│   ├── AQIDashboard.tsx       # Real-time monitoring
│   ├── AQIHistoryChart.tsx    # Historical charts
│   ├── air-quality-map.tsx    # Geospatial map
│   └── HomePage.jsx           # Main page
```

## 📡 API Endpoints

```
GET  /api/health                           # Health check
GET  /api/aqi/current                      # Current AQI
GET  /api/aqi/history?sensorId=1&hours=24 # Historical data
GET  /api/forecast/:sensorId               # AQI forecast
GET  /api/alerts/active                    # Active alerts
GET  /api/sensors/latest                   # Sensor readings
```

👉 **Full API Reference**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 Configuration

### Environment

Create `.env`:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/airquality
PORT=3001
CITY_ID=almaty
NODE_ENV=development
ENABLE_ALERTS=true
ENABLE_FORECASTING=true
```

### Multi-City Support

Edit `lib/config/city-config.ts` to add cities and customize:
- Coordinates and map bounds
- AQI thresholds
- Alert sensitivity
- Measurement units
- Language preferences

## 💡 Key Technologies

- **Backend**: Express.js, TypeScript, PostgreSQL
- **Frontend**: React 18, Tailwind CSS, Leaflet
- **Build**: Vite, ESBuild
- **Real-Time**: Polling + Alerts

## 🚀 Deployment

### Development
```bash
npm run dev       # Frontend
npm run server    # Backend
```

### Production
```bash
npm run build
NODE_ENV=production npm run server
```

## 📚 Documentation

- [**DEPLOYMENT.md**](./DEPLOYMENT.md) - Full technical guide
- [**API Reference**](./DEPLOYMENT.md#-rest-api-endpoints) - All endpoints
- [**Architecture**](./DEPLOYMENT.md#-architecture-changes) - System design

## 📝 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/airquality

# Server
PORT=3001
NODE_ENV=production

# City Configuration
CITY_ID=almaty

# Features
ENABLE_ALERTS=true
ENABLE_FORECASTING=true
ENABLE_SENSOR_HEALTH_MONITORING=true

# Update Intervals (milliseconds)
SENSOR_DATA_REFRESH_INTERVAL=60000
AQI_CALCULATION_INTERVAL=300000
FORECAST_GENERATION_INTERVAL=3600000
```

You can also tune `PGPOOL_MAX` (default 10) or set `PGSSLMODE=require` when connecting to managed Postgres instances.

## Tech stack
- **Vite + React**: Fast single-page experience; `src/App.jsx` manages hash-aware navigation without a router.
- **Leaflet + react-leaflet**: Map panels in `HomePage` and `air-quality-map.tsx` that do not load Google Maps.
- **Tailwind + PostCSS**: Styling via `tailwind.config.js` and `postcss.config.js`.
- **pg driver**: Direct Postgres access in `lib/db`, kept lightweight so future APIs can reuse the same helper.

## Data access & database helpers
- `lib/db/index.ts` keeps a `pg` pool that honors `DATABASE_URL`, `PGPOOL_MAX`, and `PGSSLMODE` while providing query helpers and a migration runner.
- `lib/data-access.ts` exposes the SQL that fetches sensor metadata plus most recent readings.
- `lib/db/schema.ts` contains the SQL schema definitions and migration configurations.
- `migrations/001_create_readings.sql` provides the raw SQL reference for the initial database structure.

**Note:** The application attempts to automatically run migrations defined in `lib/db/schema.ts` when the server starts. Ensure your database user has sufficient privileges to create tables.

## Deployment Guidelines

### Database Provisioning
You need a PostgreSQL instance (local or cloud).
1. Create a database (e.g., `airquality`).
2. Set the `DATABASE_URL` in your `.env` file.
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/airquality
   ```
3. Start the server (`npm run server`). The application will initialize the database schema automatically.

### Production Build
1. **Frontend:** Build the frontend assets.
   ```bash
   npm run build
   ```
   Deploy the contents of the `dist/` directory to a static host (Netlify, Vercel, S3) or serve with a web server like Nginx.

2. **Backend:** Run the API server.
   ```bash
   NODE_ENV=production npm run server
   ```
   Ensure the environnment variables (`DATABASE_URL`, `PORT`, etc.) are set in the production environment.
