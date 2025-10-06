import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// In-memory storage for MVP
interface Task {
  id: number;
  title: string;
  description?: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  category_id?: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

let tasks: Task[] = [
  {
    id: 1,
    title: 'Welcome to your Todo List!',
    description: 'Start by creating your first task. You can add descriptions, set priorities, and organize with categories.',
    priority: 1,
    status: 'pending',
    category_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Try editing a task',
    description: 'Click on a task to edit its details, change status, or update priority.',
    priority: 2,
    status: 'pending',
    category_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Complete a task',
    description: 'Mark tasks as complete when you finish them. Completed tasks will be visually distinct.',
    priority: 3,
    status: 'completed',
    category_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let categories: Category[] = [
  { id: 1, name: 'Personal', color: '#3b82f6' },
  { id: 2, name: 'Work', color: '#8b5cf6' },
  { id: 3, name: 'Shopping', color: '#10b981' }
];

let taskIdCounter = 4;
let categoryIdCounter = 4;

// Routes

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API is running' });
});

// Get all tasks
app.get('/api/tasks', (req: Request, res: Response) => {
  const { status, category_id } = req.query;
  
  let filteredTasks = [...tasks];
  
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  if (category_id) {
    filteredTasks = filteredTasks.filter(task => task.category_id === Number(category_id));
  }
  
  res.json({
    success: true,
    data: {
      tasks: filteredTasks,
      total: filteredTasks.length
    }
  });
});

// Get task by ID
app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  res.json({
    success: true,
    data: { task }
  });
});

// Create task
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description, priority, status, due_date, category_id } = req.body;
  
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }
  
  const newTask: Task = {
    id: taskIdCounter++,
    title,
    description: description || undefined,
    priority: priority || 1,
    status: status || 'pending',
    due_date: due_date || undefined,
    category_id: category_id || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    data: { task: newTask },
    message: 'Task created successfully'
  });
});

// Update task
app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex(t => t.id === Number(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const { title, description, priority, status, due_date, category_id } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    priority: priority !== undefined ? priority : tasks[taskIndex].priority,
    status: status !== undefined ? status : tasks[taskIndex].status,
    due_date: due_date !== undefined ? due_date : tasks[taskIndex].due_date,
    category_id: category_id !== undefined ? category_id : tasks[taskIndex].category_id,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: { task: tasks[taskIndex] },
    message: 'Task updated successfully'
  });
});

// Delete task
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex(t => t.id === Number(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  tasks.splice(taskIndex, 1);
  
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// Get all categories
app.get('/api/categories', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      categories,
      total: categories.length
    }
  });
});

// Create category
app.post('/api/categories', (req: Request, res: Response) => {
  const { name, color } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }
  
  const newCategory: Category = {
    id: categoryIdCounter++,
    name,
    color: color || '#6b7280'
  };
  
  categories.push(newCategory);
  
  res.status(201).json({
    success: true,
    data: { category: newCategory },
    message: 'Category created successfully'
  });
});

// Delete category
app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const categoryIndex = categories.findIndex(c => c.id === Number(req.params.id));
  
  if (categoryIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  
  categories.splice(categoryIndex, 1);
  
  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
