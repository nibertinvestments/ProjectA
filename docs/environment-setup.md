# Environment Configuration Template

Copy this file to `.env` in the backend directory and fill in your actual values.

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarttodolist
DB_USER=todoapp
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=../infrastructure/service-account-key.json
GCS_BUCKET_NAME=smart-todolist-files
GOOGLE_CLOUD_PROJECT_ID=smart-todolist-471817

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Optional: Redis Cache (if using Cloud Memorystore)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Optional: Email Service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Production Environment Variables

For App Engine deployment, set these in `app.yaml` env_variables section:

- `DB_HOST`: Use Cloud SQL connection string
- `NODE_ENV`: Set to "production"
- `JWT_SECRET`: Use a strong, unique secret
- All Google Cloud configurations should reference Cloud resources

## Security Notes

- Never commit `.env` files to version control
- Use Google Secret Manager for sensitive production values
- Rotate secrets regularly
- Use strong, unique passwords for database users