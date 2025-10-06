export interface Task {
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

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  category_id?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  category_id?: number;
}
