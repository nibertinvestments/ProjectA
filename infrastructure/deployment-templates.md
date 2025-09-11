# Google Cloud Deployment Templates

## Backend App Engine Configuration

Save as `backend/app.yaml`:

```yaml
runtime: nodejs18

env_variables:
  # Database connection for Cloud SQL
  DB_HOST: "/cloudsql/smart-todolist-471817:us-central1:todolist-db"
  DB_NAME: "smarttodolist"
  DB_USER: "todoapp"
  DB_PASSWORD: "YOUR_PRODUCTION_PASSWORD"
  
  # Application settings
  NODE_ENV: "production"
  JWT_SECRET: "YOUR_PRODUCTION_JWT_SECRET"
  
  # Google Cloud settings
  GCS_BUCKET_NAME: "smart-todolist-files"
  GOOGLE_CLOUD_PROJECT_ID: "smart-todolist-471817"
  
  # CORS settings
  CORS_ORIGIN: "https://your-frontend-url.appspot.com"

# Cloud SQL connection
beta_settings:
  cloud_sql_instances: smart-todolist-471817:us-central1:todolist-db

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10

handlers:
- url: /.*
  script: auto
  secure: always
```

## Frontend App Engine Configuration

Save as `frontend/app.yaml`:

```yaml
runtime: nodejs18

handlers:
# Handle static assets
- url: /assets
  static_dir: dist/assets
  secure: always

# Handle all other routes with index.html (for SPA routing)
- url: /.*
  static_files: dist/index.html
  upload: dist/index.html
  secure: always

automatic_scaling:
  min_instances: 1
  max_instances: 5

resources:
  cpu: 0.5
  memory_gb: 0.25
```

## Cloud SQL Setup Commands

```bash
# Create PostgreSQL instance
gcloud sql instances create todolist-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# Create database
gcloud sql databases create smarttodolist --instance=todolist-db

# Create database user
gcloud sql users create todoapp \
  --instance=todolist-db \
  --password=YOUR_SECURE_PASSWORD

# Set up IAM access for service account
gcloud projects add-iam-policy-binding smart-todolist-471817 \
  --member="serviceAccount:smartlist@smart-todolist-471817.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## Storage Bucket Setup

```bash
# Create bucket
gsutil mb gs://smart-todolist-files

# Set bucket permissions
gsutil iam ch serviceAccount:smartlist@smart-todolist-471817.iam.gserviceaccount.com:objectAdmin gs://smart-todolist-files

# Enable CORS for web access
gsutil cors set cors-config.json gs://smart-todolist-files
```

## CORS Configuration for Storage

Save as `infrastructure/cors-config.json`:

```json
[
  {
    "origin": ["https://your-frontend-url.appspot.com", "http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

## Service Account Permissions

Required IAM roles for `smartlist@smart-todolist-471817.iam.gserviceaccount.com`:

- `roles/cloudsql.client` - Cloud SQL access
- `roles/storage.objectAdmin` - Cloud Storage access
- `roles/appengine.appAdmin` - App Engine deployment
- `roles/secretmanager.secretAccessor` - Secret Manager access (optional)

## Deployment Commands

```bash
# Deploy backend
cd backend
gcloud app deploy --version=v1

# Deploy frontend
cd frontend
npm run build
gcloud app deploy --version=v1

# Set traffic routing (if needed)
gcloud app services set-traffic default --splits=v1=100
```