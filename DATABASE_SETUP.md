# 🗄️ Database Setup Guide

## Option 1: PostgreSQL Cloud (Recommended for Quick Start)

### Using Neon (Free Tier)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host/database`)
4. Update `.env` file:
   ```
   DATABASE_URL=postgresql://your_user:your_password@your_host.neon.tech/your_db
   ```

### Using Railway (Free Tier)
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy connection string from variables
4. Update `.env` file with the connection string

### Using Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy PostgreSQL connection string
5. Update `.env` file

---

## Option 2: Docker (Local PostgreSQL)

### Prerequisites
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Setup PostgreSQL in Docker
```powershell
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name airquality-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=airquality `
  -p 5432:5432 `
  -v postgres_data:/var/lib/postgresql/data `
  -d postgres:15

# Create volume for persistence
docker volume create postgres_data
```

### Update .env file
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/airquality
```

### Verify Connection
```powershell
# Check if container is running
docker ps

# View logs
docker logs airquality-db
```

---

## Option 3: PostgreSQL Local Installation

### Windows Installation
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Choose version 15 or later
4. Set password for `postgres` user
5. Remember the password!
6. During installation, select port 5432 (default)

### After Installation
```powershell
# Create database
psql -U postgres -h localhost -p 5432

# In psql console, run:
CREATE DATABASE airquality;
\q  # Exit
```

### Update .env file
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/airquality
```

---

## Next Steps

### 1. Set DATABASE_URL in .env
Edit `.env` file with your connection string

### 2. Verify Connection
```powershell
npm run server
```

You should see:
```
Server running on port 3001
Database migrations completed
Health check: OK
```

### 3. Test API
```powershell
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T...",
  "version": "1.0.0"
}
```

---

## Troubleshooting

### ERROR: connect ECONNREFUSED 127.0.0.1:5432
- PostgreSQL service is not running
- Docker container not started
- Check connection string in `.env`

### ERROR: password authentication failed
- Wrong password in connection string
- Database user doesn't exist
- Reset PostgreSQL password if forgotten

### ERROR: database does not exist
- Run: `CREATE DATABASE airquality;`
- Check database name in connection string

---

## Quick Start (Docker Recommended)

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop

2. **Run PostgreSQL**:
```powershell
docker run --name airquality-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=airquality `
  -p 5432:5432 `
  -d postgres:15
```

3. **Verify .env has**:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/airquality
```

4. **Start server**:
```powershell
npm run server
```

Done! 🎉
