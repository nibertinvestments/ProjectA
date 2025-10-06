import { useState } from 'react';
import { CheckCircle2, Circle, Edit2, Trash2, Calendar } from 'lucide-react';
import type { Task, Category } from '../types';

interface TaskItemProps {
  task: Task;
  categories: Category[];
  onUpdate: (id: number, updates: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, categories, onUpdate, onDelete, onEdit }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const category = categories.find(c => c.id === task.category_id);

  const handleToggleComplete = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await onUpdate(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const priorityColors = {
    1: 'bg-green-100 text-green-800 border-green-200',
    2: 'bg-blue-100 text-blue-800 border-blue-200',
    3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    4: 'bg-orange-100 text-orange-800 border-orange-200',
    5: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div
      className={`group bg-white rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        task.status === 'completed' ? 'opacity-60' : ''
      } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className="mt-1 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
          title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`font-semibold text-gray-900 ${
                task.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                  borderColor: `${category.color}40`,
                  borderWidth: '1px',
                }}
              >
                {category.name}
              </span>
            )}

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                priorityColors[task.priority as keyof typeof priorityColors] || priorityColors[1]
              }`}
            >
              Priority {task.priority}
            </span>

            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
