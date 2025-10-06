# Smart Todo List - Quick Start Guide

A beautiful, fully functional todo list application built with React, TypeScript, Node.js, and Express.

## 🎨 Features

- ✨ Beautiful modern UI with gradient backgrounds and smooth animations
- 📝 Create, edit, and delete tasks with rich descriptions
- ✅ Mark tasks as complete/incomplete with visual feedback
- 🎯 Set priority levels (1-5) with color-coded badges
- 🏷️ Organize tasks with categories
- 🔍 Filter tasks by status (All, Pending, In Progress, Completed)
- 📊 Real-time statistics dashboard
- 📅 Optional due dates for tasks
- 🎨 Color-coded categories (Personal, Work, Shopping)
- 💾 RESTful API backend with in-memory storage

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/nibertinvestments/ProjectA.git
   cd ProjectA
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # From the root directory, start both frontend and backend
   npm run dev
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## 📁 Project Structure

```
ProjectA/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── TaskItem.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── store/           # Zustand state management
│   │   │   └── todoStore.ts
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   └── package.json
├── backend/                  # Express TypeScript API
│   ├── src/
│   │   └── server.ts        # API server with routes
│   ├── .env                 # Environment variables
│   └── package.json
└── package.json             # Root package.json with scripts
```

## 🎯 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/:id` - Delete a category

### Health Check
- `GET /api/health` - API health check

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe server development
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 🎨 Usage

### Creating a Task
1. Click the "New Task" button in the header
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (1-5)
   - **Status** (Pending, In Progress, Completed, Cancelled)
   - **Category** (Personal, Work, Shopping, or none)
   - **Due Date** (optional)
3. Click "Create" to add the task

### Editing a Task
1. Hover over a task to reveal edit and delete buttons
2. Click the edit icon (pencil)
3. Modify the task details
4. Click "Update" to save changes

### Completing a Task
- Click the circle icon next to any task to toggle its completion status
- Completed tasks will appear with a checkmark and reduced opacity

### Filtering Tasks
- Use the filter buttons to view tasks by status:
  - **All** - Show all tasks
  - **Pending** - Show only pending tasks
  - **In Progress** - Show tasks in progress
  - **Completed** - Show completed tasks

### Deleting a Task
1. Hover over a task to reveal the delete button
2. Click the trash icon
3. Confirm the deletion

## 📊 Features Explained

### Task Priorities
Tasks can have priority levels from 1 to 5:
- **1** - Low (Green badge)
- **2** - Medium (Blue badge)
- **3** - Normal (Yellow badge)
- **4** - High (Orange badge)
- **5** - Urgent (Red badge)

### Task Statuses
- **Pending** - Task not yet started
- **In Progress** - Task currently being worked on
- **Completed** - Task finished
- **Cancelled** - Task no longer needed

### Categories
Pre-configured categories with color coding:
- **Personal** - Blue (#3b82f6)
- **Work** - Purple (#8b5cf6)
- **Shopping** - Green (#10b981)

## 🔧 Development

### Available Scripts

From the root directory:
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both applications
- `npm run build:frontend` - Build frontend
- `npm run build:backend` - Build backend

### Backend Development
The backend uses **nodemon** for hot reload during development:
```bash
cd backend
npm run dev
```

### Frontend Development
The frontend uses **Vite** for instant HMR:
```bash
cd frontend
npm run dev
```

## 🎨 Customization

### Adding New Categories
Edit `backend/src/server.ts` and add to the `categories` array:
```typescript
let categories: Category[] = [
  { id: 4, name: 'Your Category', color: '#ff5733' }
];
```

### Modifying Styles
The application uses Tailwind CSS. Edit component files in `frontend/src/components/` to customize the appearance.

### Changing Port Numbers
Edit the `.env` files:
- **Backend**: `backend/.env` - Change `PORT` variable
- **Frontend**: Uses Vite default (5173)

## 🚀 Future Enhancements

This MVP version uses in-memory storage. Future enhancements could include:
- PostgreSQL database integration
- User authentication with JWT
- Google OAuth integration
- Real-time synchronization with WebSockets
- File attachments for tasks
- Task reminders and notifications
- Mobile responsive design improvements
- Dark mode theme
- Task search functionality
- Drag-and-drop task reordering
- Task templates
- Export tasks to CSV/JSON
- Calendar view for tasks with due dates

## 📝 Notes

- The current version uses **in-memory storage**, so data will be lost when the backend restarts
- Default tasks are created on server start to demonstrate functionality
- CORS is configured to allow requests from `http://localhost:5173`

## 🤝 Contributing

This is an MVP implementation. Contributions are welcome! Please refer to the existing documentation in the `docs/` directory for detailed development guidelines.

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using React, TypeScript, and Express**
