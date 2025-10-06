import { create } from 'zustand';
import type { Task, Category, CreateTaskInput, UpdateTaskInput } from '../types';
import { taskService, categoryService } from '../services/api';

interface TodoStore {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  filterStatus: string | null;
  filterCategory: number | null;

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: number, task: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createCategory: (category: { name: string; color: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setFilterStatus: (status: string | null) => void;
  setFilterCategory: (categoryId: number | null) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: [],
  categories: [],
  loading: false,
  error: null,
  filterStatus: null,
  filterCategory: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { filterStatus, filterCategory } = get();
      const params: any = {};
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category_id = filterCategory;
      
      const tasks = await taskService.getTasks(params);
      set({ tasks, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch tasks', loading: false });
    }
  },

  createTask: async (taskData: CreateTaskInput) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskService.createTask(taskData);
      set(state => ({
        tasks: [...state.tasks, newTask],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create task', loading: false });
      throw error;
    }
  },

  updateTask: async (id: number, taskData: UpdateTaskInput) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      set(state => ({
        tasks: state.tasks.map(task => task.id === id ? updatedTask : task),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update task', loading: false });
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await taskService.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete task', loading: false });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await categoryService.getCategories();
      set({ categories });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories' });
    }
  },

  createCategory: async (categoryData: { name: string; color: string }) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      set(state => ({
        categories: [...state.categories, newCategory]
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create category' });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      set(state => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete category' });
      throw error;
    }
  },

  setFilterStatus: (status: string | null) => {
    set({ filterStatus: status });
    get().fetchTasks();
  },

  setFilterCategory: (categoryId: number | null) => {
    set({ filterCategory: categoryId });
    get().fetchTasks();
  },
}));
