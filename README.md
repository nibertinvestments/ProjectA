# Smart To-Do List Application

A full-stack intelligent to-do list application built with React, Node.js, and Google Cloud Platform.

## Quick Start

This project includes comprehensive copilot instructions for building the application from scratch. See [.copilot-instructions.md](./.copilot-instructions.md) for detailed setup and development guidelines.

## Features

- 🧠 Smart task categorization and prioritization
- 🔄 Real-time synchronization across devices  
- 🤖 AI-powered task suggestions and scheduling
- 📱 Mobile-responsive web interface
- ☁️ Cloud-based data storage and backup
- 🔐 Secure user authentication

## Technology Stack

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Google Cloud SQL (PostgreSQL)
- **Cloud**: Google App Engine, Cloud Storage
- **Authentication**: Google OAuth2 with JWT

## Service Account

This application uses the Google Cloud service account: `smartlist@smart-todolist-471817.iam.gserviceaccount.com`

## Getting Started

1. Follow the complete setup instructions in [.copilot-instructions.md](./.copilot-instructions.md)
2. Set up your Google Cloud project and enable required APIs
3. Configure the service account and download credentials
4. Run the local development environment

## Project Structure

```
smart-todolist/
├── frontend/                 # React application
├── backend/                  # Express.js API
├── shared/                   # Shared TypeScript types
├── infrastructure/           # Cloud deployment configs
├── docs/                     # Documentation
└── .copilot-instructions.md  # Complete development guide
```

For detailed instructions, see the [copilot instructions](./.copilot-instructions.md).
