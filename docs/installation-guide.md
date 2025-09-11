# Installation Guide

This guide provides detailed installation instructions for the Smart To-Do List Application.

## Prerequisites

Before installing the application, ensure you have the following prerequisites installed:

### Required Software
- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **Google Cloud CLI** (`gcloud`) - [Install gcloud CLI](https://cloud.google.com/sdk/docs/install)
- **PostgreSQL** (for local development) - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Optional Software
- **Docker** (for containerized development) - [Download Docker](https://www.docker.com/get-started)
- **Visual Studio Code** (recommended IDE) - [Download VS Code](https://code.visualstudio.com/)

## System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.14, or Ubuntu 18.04+
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Network**: Internet connection for Google Cloud services

### Recommended Requirements
- **OS**: Latest version of Windows, macOS, or Ubuntu
- **RAM**: 8GB or more
- **Storage**: 5GB free space
- **Network**: Stable internet connection

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/nibertinvestments/ProjectA.git
cd ProjectA
```

### 2. Google Cloud Setup

#### 2.1 Authenticate with Google Cloud
```bash
# Login to Google Cloud
gcloud auth login

# Set project ID
gcloud config set project smart-todolist-471817

# Authenticate application default credentials
gcloud auth application-default login
```

#### 2.2 Enable Required APIs
```bash
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

#### 2.3 Service Account Setup
```bash
# Create infrastructure directory if it doesn't exist
mkdir -p infrastructure

# Download service account key
gcloud iam service-accounts keys create ./infrastructure/service-account-key.json \
  --iam-account=smartlist@smart-todolist-471817.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./infrastructure/service-account-key.json"
```

### 3. Project Structure Setup

```bash
# Create main project directory
mkdir smart-todolist
cd smart-todolist

# Initialize root package.json
npm init -y

# Create frontend with Vite + React + TypeScript
npm create vite@latest frontend -- --template react-ts

# Create backend directory
mkdir backend
cd backend
npm init -y
cd ..

# Create shared types directory
mkdir shared
cd shared
npm init -y
cd ..
```

### 4. Backend Setup

#### 4.1 Install Backend Dependencies
```bash
cd backend

# Production dependencies
npm install express cors helmet morgan dotenv jsonwebtoken bcryptjs pg @google-cloud/storage multer

# Development dependencies
npm install -D @types/express @types/cors @types/helmet @types/morgan @types/jsonwebtoken @types/bcryptjs @types/node @types/pg @types/multer typescript ts-node nodemon

cd ..
```

#### 4.2 Configure TypeScript for Backend
Create `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Frontend Setup

#### 5.1 Install Frontend Dependencies
```bash
cd frontend

# Install base dependencies
npm install

# Install additional UI dependencies
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install lucide-react date-fns axios react-hook-form @hookform/resolvers zod
npm install zustand react-router-dom

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer @types/node

# Initialize Tailwind CSS
npx tailwindcss init -p

cd ..
```

#### 5.2 Configure Tailwind CSS
Update `frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 6. Database Setup

#### 6.1 Create Cloud SQL Instance
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
  --password=SecurePassword123!
```

#### 6.2 Set Up Local PostgreSQL (Development)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Windows - Download installer from PostgreSQL website
```

Create local database:
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE smarttodolist;
CREATE USER todoapp WITH PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE smarttodolist TO todoapp;
\q
```

### 7. Environment Configuration

#### 7.1 Backend Environment
Copy and configure environment file:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your actual values:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarttodolist
DB_USER=todoapp
DB_PASSWORD=SecurePassword123!

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=../infrastructure/service-account-key.json
GCS_BUCKET_NAME=smart-todolist-files
GOOGLE_CLOUD_PROJECT_ID=smart-todolist-471817

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 8. Cloud Storage Setup

```bash
# Create bucket for file storage
gsutil mb gs://smart-todolist-files

# Set bucket permissions
gsutil iam ch serviceAccount:smartlist@smart-todolist-471817.iam.gserviceaccount.com:objectAdmin gs://smart-todolist-files

# Create CORS configuration
cat > cors-config.json << EOF
[
  {
    "origin": ["http://localhost:5173", "https://*.appspot.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

# Apply CORS configuration
gsutil cors set cors-config.json gs://smart-todolist-files
```

### 9. Build Scripts Configuration

Update root `package.json`:
```json
{
  "name": "smart-todolist",
  "private": true,
  "scripts": {
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "deploy": "npm run deploy:backend && npm run deploy:frontend",
    "deploy:backend": "cd backend && gcloud app deploy",
    "deploy:frontend": "cd frontend && npm run build && gcloud app deploy",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

Install root dependencies:
```bash
npm install
```

### 10. Verify Installation

#### 10.1 Test Database Connection
```bash
# Test local PostgreSQL connection
psql -h localhost -U todoapp -d smarttodolist -c "SELECT version();"

# Test Cloud SQL connection (if configured)
cloud_sql_proxy -instances=smart-todolist-471817:us-central1:todolist-db=tcp:5432 &
psql -h 127.0.0.1 -U todoapp -d smarttodolist -c "SELECT version();"
```

#### 10.2 Test Google Cloud Authentication
```bash
# Test service account
gcloud auth list

# Test storage access
gsutil ls gs://smart-todolist-files
```

#### 10.3 Start Development Servers
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Troubleshooting

### Common Issues

#### PostgreSQL Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Google Cloud Authentication Issues
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login

# Check current project
gcloud config get-value project
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Use Node Version Manager (nvm) to install correct version
nvm install 18
nvm use 18
```

### Getting Help

If you encounter issues during installation:

1. Check the [Troubleshooting Guide](./troubleshooting/common-issues.md)
2. Review the [FAQ](./troubleshooting/faq.md)
3. Consult the [Debug Guide](./troubleshooting/debugging.md)
4. Create an issue in the repository with detailed error information

## Next Steps

After successful installation:

1. Review the [Architecture Overview](./architecture/overview.md)
2. Follow the [Quick Start Checklist](./quick-start-checklist.md)
3. Read the [Contributing Guidelines](./contributing/README.md)
4. Explore the [API Documentation](./api/README.md)

---

*For detailed development instructions, see [Copilot Instructions](../.copilot-instructions.md)*