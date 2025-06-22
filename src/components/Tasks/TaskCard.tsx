import React from 'react';
import { 
  Calendar, 
  Clock, 
  Flag, 
  MoreVertical, 
  CheckCircle2, 
  Circle,
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import { Task } from '../../types';
import { format, isToday, isPast, startOfDay } from 'date-fns';
import { useApp } from '../../contexts/AppContext';
import { useTasks } from '../../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { state } = useApp();
  const { toggleTaskStatus, deleteTask } = useTasks();
  const isDark = state.user?.preferences.theme === 'dark';

  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-orange-600 bg-orange-100',
    urgent: 'text-red-600 bg-red-100'
  };

  const categoryColors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-purple-100 text-purple-800',
    health: 'bg-green-100 text-green-800',
    learning: 'bg-indigo-100 text-indigo-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const isOverdue = task.dueDate && isPast(startOfDay(task.dueDate)) && task.status !== 'completed';
  const isDueToday = task.dueDate && isToday(task.dueDate);

  return (
    <div className={`group relative rounded-xl border transition-all duration-300 hover:shadow-lg ${
      isDark
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
        : 'bg-white border-gray-200 hover:border-gray-300'
    } ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className="mt-1 transition-colors duration-200"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
              )}
            </button>
            <div className="flex-1">
              <h3 className={`font-semibold text-lg leading-tight ${
                task.status === 'completed' 
                  ? 'line-through text-gray-500' 
                  : isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-2 text-sm ${
                  task.status === 'completed'
                    ? 'line-through text-gray-400'
                    : isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit?.(task)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Priority */}
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              isDark ? 'bg-gray-700' : priorityColors[task.priority]
            }`}>
              <Flag className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </div>

            {/* Category */}
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              isDark ? 'bg-gray-700 text-gray-300' : categoryColors[task.category]
            }`}>
              <Tag className="w-3 h-3" />
              <span className="capitalize">{task.category}</span>
            </div>

            {/* Estimated Time */}
            <div className={`inline-flex items-center space-x-1 text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{task.estimatedTime}min</span>
            </div>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`inline-flex items-center space-x-1 text-xs ${
              isOverdue 
                ? 'text-red-500' 
                : isDueToday 
                  ? 'text-orange-500' 
                  : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>
                {isToday(task.dueDate) 
                  ? 'Today' 
                  : format(task.dueDate, 'MMM d')
                }
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-md ${
                  isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}