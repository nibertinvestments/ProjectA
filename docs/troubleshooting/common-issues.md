# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the Smart To-Do List Application.

## Quick Diagnosis

### Check System Status

1. **Frontend Status**
   ```bash
   # Check if frontend is running
   curl http://localhost:5173
   ```

2. **Backend Status**
   ```bash
   # Check if backend is running
   curl http://localhost:3001/api/health
   ```

3. **Database Connection**
   ```bash
   # Test database connection
   psql -h localhost -U todoapp -d smarttodolist -c "SELECT version();"
   ```

4. **Google Cloud Authentication**
   ```bash
   # Check authentication
   gcloud auth list
   gcloud auth application-default print-access-token
   ```

## Common Issues

### Installation Issues

#### Node.js Version Problems

**Problem**: Wrong Node.js version causing build failures
```
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

#### Dependency Installation Failures

**Problem**: npm install fails with permission errors
```
npm ERR! EACCES: permission denied
```

**Solution**:
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm

# Or use nvm to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### PostgreSQL Installation Issues

**Problem**: PostgreSQL service won't start
```
could not connect to server: Connection refused
```

**Solution**:
```bash
# Ubuntu/Debian
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS
brew services start postgresql

# Windows - check Windows Services
```

### Development Issues

#### Frontend Build Errors

**Problem**: Vite build fails with module errors
```
Failed to resolve import "some-module"
```

**Solution**:
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npx vite --force
```

#### TypeScript Compilation Errors

**Problem**: TypeScript type errors during build
```
Type 'string' is not assignable to type 'number'
```

**Solution**:
1. Check type definitions in `src/types/`
2. Ensure imports are correct
3. Update type annotations
4. Clear TypeScript cache:
   ```bash
   # Clear TypeScript cache
   npx tsc --build --clean
   ```

#### Backend Server Won't Start

**Problem**: Express server fails to start
```
Error: listen EADDRINUSE :::3001
```

**Solution**:
```bash
# Check what's using port 3001
lsof -i :3001
netstat -tulpn | grep 3001

# Kill the process
kill -9 <PID>

# Or use different port
export PORT=3002
```

### Database Issues

#### Connection Refused Errors

**Problem**: Cannot connect to PostgreSQL database
```
connection to server at "localhost" (127.0.0.1), port 5432 failed
```

**Solution**:
1. **Check PostgreSQL is running**:
   ```bash
   sudo systemctl status postgresql
   ```

2. **Check connection settings**:
   ```bash
   # Verify .env file
   cat backend/.env | grep DB_
   ```

3. **Test connection manually**:
   ```bash
   psql -h localhost -U todoapp -d smarttodolist
   ```

4. **Check PostgreSQL configuration**:
   ```bash
   # Edit postgresql.conf
   sudo nano /etc/postgresql/14/main/postgresql.conf
   # Ensure: listen_addresses = 'localhost'
   
   # Edit pg_hba.conf
   sudo nano /etc/postgresql/14/main/pg_hba.conf
   # Add: local all todoapp md5
   ```

#### Authentication Failed

**Problem**: Database authentication errors
```
FATAL: password authentication failed for user "todoapp"
```

**Solution**:
```bash
# Reset user password
sudo -u postgres psql
ALTER USER todoapp PASSWORD 'SecurePassword123!';
\q

# Or recreate user
DROP USER IF EXISTS todoapp;
CREATE USER todoapp WITH PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE smarttodolist TO todoapp;
```

#### Database Schema Issues

**Problem**: Tables don't exist or schema is outdated
```
relation "tasks" does not exist
```

**Solution**:
```bash
# Run schema creation
psql -h localhost -U todoapp -d smarttodolist -f backend/src/database/schema.sql

# Or check if tables exist
psql -h localhost -U todoapp -d smarttodolist -c "\dt"
```

### Google Cloud Issues

#### Authentication Problems

**Problem**: Google Cloud authentication failures
```
Error: Could not load the default credentials
```

**Solution**:
1. **Re-authenticate**:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

2. **Check service account**:
   ```bash
   # Verify service account file exists
   ls -la infrastructure/service-account-key.json
   
   # Set environment variable
   export GOOGLE_APPLICATION_CREDENTIALS="./infrastructure/service-account-key.json"
   ```

3. **Verify project settings**:
   ```bash
   gcloud config get-value project
   gcloud config set project smart-todolist-471817
   ```

#### Cloud SQL Connection Issues

**Problem**: Cannot connect to Cloud SQL instance
```
connection failed: timeout expired
```

**Solution**:
1. **Check instance status**:
   ```bash
   gcloud sql instances describe todolist-db
   ```

2. **Use Cloud SQL Proxy**:
   ```bash
   # Install Cloud SQL Proxy
   curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
   chmod +x cloud_sql_proxy
   
   # Start proxy
   ./cloud_sql_proxy -instances=smart-todolist-471817:us-central1:todolist-db=tcp:5432
   ```

3. **Check firewall rules**:
   ```bash
   gcloud sql instances describe todolist-db --format="value(ipConfiguration.authorizedNetworks)"
   ```

#### Storage Access Issues

**Problem**: Google Cloud Storage permission errors
```
Error: Insufficient Permission
```

**Solution**:
1. **Check bucket permissions**:
   ```bash
   gsutil iam get gs://smart-todolist-files
   ```

2. **Grant service account access**:
   ```bash
   gsutil iam ch serviceAccount:smartlist@smart-todolist-471817.iam.gserviceaccount.com:objectAdmin gs://smart-todolist-files
   ```

3. **Test bucket access**:
   ```bash
   gsutil ls gs://smart-todolist-files
   echo "test" | gsutil cp - gs://smart-todolist-files/test.txt
   ```

### Runtime Issues

#### Memory Issues

**Problem**: Application running out of memory
```
JavaScript heap out of memory
```

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json scripts
"dev": "NODE_OPTIONS='--max-old-space-size=4096' npm run start"
```

#### Performance Issues

**Problem**: Slow page load times or API responses

**Solution**:
1. **Check database queries**:
   ```sql
   -- Enable query logging in PostgreSQL
   SET log_statement = 'all';
   SET log_min_duration_statement = 100;
   ```

2. **Monitor database performance**:
   ```sql
   -- Check slow queries
   SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC;
   ```

3. **Check frontend bundle size**:
   ```bash
   cd frontend
   npm run build -- --analyze
   ```

#### CORS Issues

**Problem**: Cross-origin request blocked
```
Access to fetch at 'api...' has been blocked by CORS policy
```

**Solution**:
1. **Check CORS configuration** in `backend/src/app.ts`:
   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
     credentials: true
   }));
   ```

2. **Update environment variable**:
   ```bash
   # In backend/.env
   CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.com
   ```

### Deployment Issues

#### App Engine Deployment Failures

**Problem**: gcloud app deploy fails
```
ERROR: (gcloud.app.deploy) Error Response: [13] An internal error occurred
```

**Solution**:
1. **Check app.yaml configuration**:
   ```yaml
   # Ensure valid runtime
   runtime: nodejs18
   
   # Check environment variables
   env_variables:
     NODE_ENV: "production"
   ```

2. **Check project quotas**:
   ```bash
   gcloud compute project-info describe --project=smart-todolist-471817
   ```

3. **Enable required APIs**:
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

#### Build Failures in CI/CD

**Problem**: Automated builds failing

**Solution**:
1. **Check build logs**:
   ```bash
   gcloud builds list --limit=5
   gcloud builds log <BUILD_ID>
   ```

2. **Verify dependencies**:
   ```bash
   # Check for package-lock.json conflicts
   npm ci --production
   ```

3. **Environment variable issues**:
   ```bash
   # Ensure all required env vars are set in Cloud Build
   gcloud builds submit --substitutions=_ENV_VAR=value
   ```

## Debugging Tools

### Backend Debugging

#### Express Server Debugging
```typescript
// Add debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Enable debug logging
export DEBUG=app:* npm start
```

#### Database Query Debugging
```typescript
// Log all database queries
import pool from './database/connection';

const originalQuery = pool.query;
pool.query = function(text, params, callback) {
  console.log('Executing query:', text, params);
  return originalQuery.call(this, text, params, callback);
};
```

### Frontend Debugging

#### React DevTools
```bash
# Install React DevTools browser extension
# Available for Chrome, Firefox, and Edge
```

#### Network Debugging
```javascript
// Add request interceptor
import axios from 'axios';

axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);
```

#### State Debugging
```typescript
// Enable Zustand devtools
import { devtools } from 'zustand/middleware';

export const useTodoStore = create<TodoStore>()(
  devtools(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: 'todo-store'
    }
  )
);
```

## Log Analysis

### Finding Logs

#### Local Development
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend console
# Open browser DevTools > Console

# Database logs (PostgreSQL)
tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Production (Google Cloud)
```bash
# App Engine logs
gcloud logs read "resource.type=gae_app" --limit=50

# Cloud SQL logs
gcloud logs read "resource.type=cloudsql_database" --limit=50

# Cloud Storage logs
gcloud logs read "resource.type=gcs_bucket" --limit=50
```

### Common Log Patterns

#### Error Patterns to Look For
```bash
# Application errors
grep -i "error\|exception\|failed" app.log

# Authentication issues
grep -i "unauthorized\|forbidden\|token" app.log

# Database issues
grep -i "connection\|timeout\|deadlock" app.log

# Performance issues
grep -i "slow\|timeout\|memory" app.log
```

## Performance Monitoring

### Frontend Performance
```javascript
// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Backend Performance
```typescript
// Add response time middleware
import responseTime from 'response-time';

app.use(responseTime((req, res, time) => {
  console.log(`${req.method} ${req.url} - ${time}ms`);
}));
```

### Database Performance
```sql
-- Monitor database performance
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

## Emergency Procedures

### System Down Recovery

1. **Immediate Response**
   ```bash
   # Check system status
   curl -f http://your-app.appspot.com/health || echo "System is down"
   
   # Check App Engine instances
   gcloud app instances list
   
   # Check database
   gcloud sql instances list
   ```

2. **Rollback Procedure**
   ```bash
   # Rollback App Engine deployment
   gcloud app versions list
   gcloud app services set-traffic default --splits=PREVIOUS_VERSION=100
   ```

3. **Database Recovery**
   ```bash
   # Restore from backup
   gcloud sql backups list --instance=todolist-db
   gcloud sql backups restore BACKUP_ID --restore-instance=todolist-db
   ```

### Data Recovery

1. **Database Backup**
   ```bash
   # Create manual backup
   gcloud sql backups create --instance=todolist-db
   
   # Export database
   gcloud sql export sql todolist-db gs://backup-bucket/db-backup.sql --database=smarttodolist
   ```

2. **File Recovery**
   ```bash
   # List Cloud Storage versions
   gsutil ls -a gs://smart-todolist-files/
   
   # Restore file version
   gsutil cp gs://smart-todolist-files/file.ext#GENERATION ./restored-file.ext
   ```

## Getting Additional Help

### Support Channels

1. **Technical Issues**
   - Create GitHub issue with debugging information
   - Include error logs and reproduction steps
   - Tag with appropriate labels

2. **Emergency Support**
   - Contact system administrators
   - Use emergency contact procedures
   - Document incident for post-mortem

### Information to Include

When seeking help, provide:
- **Environment**: Development, staging, or production
- **Error Messages**: Complete error text and stack traces
- **Steps to Reproduce**: Detailed reproduction steps
- **System Information**: OS, browser, Node.js version
- **Recent Changes**: Any recent code or configuration changes
- **Logs**: Relevant log excerpts

---

For additional troubleshooting resources, see:
- [FAQ](./faq.md)
- [Error Codes](./error-codes.md)
- [Debug Guide](./debugging.md)