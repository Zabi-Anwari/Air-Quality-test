# 🔍 How to Get the Correct Supabase Connection String

## Step 1: Go to Your Supabase Project
1. Log in to https://supabase.com
2. Select your project from the dashboard

## Step 2: Navigate to Database Settings
1. Click **Settings** (bottom left sidebar)
2. Click **Database** tab
3. Scroll down to **Connection String**

## Step 3: Copy the Connection String
You should see multiple options:
- **URI** (Recommended) - Click the copy icon
- **Connection Parameters** - Alternative format
- **JDBC** - For Java

## Step 4: Important Notes for Windows/Node.js
The connection string should look like:
```
postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

### Common Issues:

**Issue 1: Special Characters in Password**
If your password contains special characters like `?`, `$`, `&`, etc., they must be URL-encoded:
- `?` → `%3F`
- `$` → `%24`
- `&` → `%26`
- `:` → `%3A`
- `@` → `%40`

Example: If password is `Pass?word$123`:
- Encoded: `Pass%3Fword%24123`

**Issue 2: Wrong Hostname**
Make sure you're using:
```
db.YOUR_PROJECT_ID.supabase.co
```
NOT just the project name or other variations.

**Issue 3: SSL Mode**
Supabase requires SSL, so the connection string should include:
```
?sslmode=require
```

## Step 5: Update Your .env File
```
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD_ENCODED@db.YOUR_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

## Step 6: Test the Connection
```powershell
npm run server
```

---

## Alternative: Use Supabase Connection Parameters
If the full URI doesn't work, you can construct it from individual parameters:

1. From Supabase Settings > Database > Connection Parameters, you'll see:
   - Host: `db.YOUR_PROJECT_ID.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres.YOUR_PROJECT_ID`
   - Password: `YOUR_PASSWORD`

2. Construct the URL:
```
postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD_ENCODED@db.YOUR_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

---

## Troubleshooting Network Issues

If you get `ENOTFOUND` error:

1. **Check Internet Connection**
   ```powershell
   ping google.com
   ```

2. **Check DNS Resolution**
   ```powershell
   nslookup db.YOUR_PROJECT_ID.supabase.co
   ```

3. **Test Connection with psql** (if installed)
   ```powershell
   psql "postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres?sslmode=require"
   ```

4. **Verify Credentials**
   - Log into Supabase dashboard
   - Confirm project is active (not suspended)
   - Confirm credentials in Settings > Database

5. **Try Without SSL (Last Resort)**
   Change connection string to:
   ```
   postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD_ENCODED@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
   ```

---

## Need Help?

Please provide:
1. Your Supabase project ID (visible in connection string as `YOUR_PROJECT_ID`)
2. Your current DATABASE_URL (with password masked if needed)
3. The exact error you're seeing

Then I can help debug the connection issue.
