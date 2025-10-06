# Quick Setup Guide

This guide will help you get the Smart Todo List application running locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

From the project root directory, run:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

cd ..
```

### 2. Build the Application

```bash
# Build both frontend and backend
npm run build
```

### 3. Run in Development Mode

```bash
# Start both frontend and backend servers
npm run dev
```

This will start:
- Frontend development server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

## Individual Commands

You can also run frontend and backend separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

## Troubleshooting

### CSS Not Loading

If Tailwind CSS styles are not applying, make sure you have installed all dependencies:
```bash
cd frontend
npm install
```

### Build Errors

If you encounter TypeScript or build errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear any build caches: `rm -rf frontend/dist backend/dist`

### Port Already in Use

If port 5173 or 3001 is already in use, you'll need to stop the other process or change the port in the configuration.

## Next Steps

- See [Installation Guide](./docs/installation-guide.md) for detailed setup with database and cloud services
- Check [User Manual](./docs/user-guides/user-manual.md) for how to use the application
- Read [Contributing Guidelines](./docs/contributing/README.md) if you want to contribute
