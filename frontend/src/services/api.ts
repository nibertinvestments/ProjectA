import axios from 'axios';
import type { Task, Category, CreateTaskInput, UpdateTaskInput } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  async getTasks(params?: { status?: string; category_id?: number }): Promise<Task[]> {
    const response = await api.get('/tasks', { params });
    return response.data.data.tasks;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data.task;
  },

  async createTask(task: CreateTaskInput): Promise<Task> {
    const response = await api.post('/tasks', task);
    return response.data.data.task;
  },

  async updateTask(id: number, task: UpdateTaskInput): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data.data.task;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.data.categories;
  },

  async createCategory(category: { name: string; color: string }): Promise<Category> {
    const response = await api.post('/categories', category);
    return response.data.data.category;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
