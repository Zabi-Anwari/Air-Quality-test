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
│   ├── AQIDashboard.jsx       # Real-time monitoring
│   ├── AQIHistoryChart.jsx    # Historical charts
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
- `lib/data-access.ts` exposes the SQL that fetches sensor metadata plus most recent readings so the UI keeps working when a real API replaces the simulated data.
- `migrations/001_create_readings.sql` defines the `readings` table and supporting indexes referenced by the helpers.
- `scripts/setup_db.sh` can provision Postgres for you: it optionally starts a Docker container (`aq-postgres` by default), applies the SQL migration, and prints the `DATABASE_URL` to drop back into `.env.local`.
- Use `scripts/check_db.sh` to confirm the connection string in `.env.local` actually reaches Postgres.
- If you rotate credentials, `scripts/change_db_password.sh` updates the Docker or host Postgres user and rewrites the `DATABASE_URL` in `.env.local` with URL-encoded values.

## Deploying & Docker
When handing this repo to someone else for deployment, share these steps:

1. **Share the repo and env values.** Ask the recipient to clone the repo, copy `.env.local` locally (never commit it), and set `VITE_GOOGLE_MAPS_API_KEY` plus a working `DATABASE_URL`. Mention `PGPOOL_MAX` and `PGSSLMODE` if the target database requires them.
2. **Provision the database.** Point them to `scripts/setup_db.sh`—it can launch Postgres inside Docker, apply `migrations/001_create_readings.sql`, and echo the connection string. They can also use an existing Postgres instance, just make sure `DATABASE_URL` matches.
3. **Run the app.** After `npm install`, run `npm run dev` for local testing or `npm run build` for production artifacts. Host the `dist` folder on any static server (Netlify, Vercel, Cloudflare) or inside a container that serves the built files.
4. **Optional Docker deployment.** You can serve the front end from a Docker image (build with `npm run build` and serve `dist` with `nginx`, `http-server`, etc.) and connect it to the Postgres container started by `scripts/setup_db.sh` by sharing the same `DATABASE_URL`.

Document these points when sharing the GitHub repo so the next person knows how to install, wire the env vars, bring up Postgres via Docker (or supply their own), and run the usual Vite commands.
