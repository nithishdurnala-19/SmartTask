import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../hooks/useTasks';
import { useApp } from '../../contexts/AppContext';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../../types';
import { 
  Filter, 
  Search, 
  SortAsc, 
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';

interface TaskListProps {
  filterType?: 'today' | 'overdue' | 'completed';
  onEditTask?: (task: Task) => void;
}

export function TaskList({ filterType, onEditTask }: TaskListProps) {
  const { state, dispatch } = useApp();
  const { tasks } = useTasks();
  const isDark = state.user?.preferences.theme === 'dark';
  
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '' as TaskCategory | '',
    priority: '' as TaskPriority | '',
    status: '' as TaskStatus | '',
    search: ''
  });

  // Get filtered tasks based on filterType and local filters
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply main filter type
    if (filterType === 'today') {
      const today = new Date();
      filtered = filtered.filter(task => 
        task.dueDate && 
        task.dueDate.toDateString() === today.toDateString() &&
        task.status !== 'completed'
      );
    } else if (filterType === 'overdue') {
      const now = new Date();
      filtered = filtered.filter(task => 
        task.dueDate && 
        task.dueDate < now && 
        task.status !== 'completed'
      );
    } else if (filterType === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    }

    // Apply local filters
    if (localFilters.category) {
      filtered = filtered.filter(task => task.category === localFilters.category);
    }
    if (localFilters.priority) {
      filtered = filtered.filter(task => task.priority === localFilters.priority);
    }
    if (localFilters.status) {
      filtered = filtered.filter(task => task.status === localFilters.status);
    }
    if (localFilters.search) {
      const search = localFilters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Sort tasks
    return filtered.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const filteredTasks = getFilteredTasks();

  const getTitle = () => {
    switch (filterType) {
      case 'today': return 'Today\'s Tasks';
      case 'overdue': return 'Overdue Tasks';
      case 'completed': return 'Completed Tasks';
      default: return 'All Tasks';
    }
  };

  const getIcon = () => {
    switch (filterType) {
      case 'today': return Calendar;
      case 'overdue': return AlertTriangle;
      case 'completed': return CheckCircle2;
      default: return CheckCircle2;
    }
  };

  const Icon = getIcon();

  const clearFilter = (filterKey: keyof typeof localFilters) => {
    setLocalFilters(prev => ({ ...prev, [filterKey]: '' }));
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            filterType === 'overdue' 
              ? 'bg-gradient-to-br from-red-500 to-red-600'
              : filterType === 'completed'
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : filterType === 'today'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
          }`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {getTitle()}
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? isDark
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
                : isDark
                  ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={`rounded-xl border p-6 transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={localFilters.search}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {localFilters.search && (
                <button
                  onClick={() => clearFilter('search')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={localFilters.category}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value as TaskCategory }))}
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">All Categories</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="other">Other</option>
              </select>
              {localFilters.category && (
                <button
                  onClick={() => clearFilter('category')}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={localFilters.priority}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {localFilters.priority && (
                <button
                  onClick={() => clearFilter('priority')}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={localFilters.status}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {localFilters.status && (
                <button
                  onClick={() => clearFilter('status')}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Active filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(localFilters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center space-x-1 px-3 py-1 text-sm rounded-full ${
                        isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="capitalize">{key}: {value}</span>
                      <button
                        onClick={() => clearFilter(key as keyof typeof localFilters)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className={`text-center py-20 rounded-xl border-2 border-dashed ${
          isDark 
            ? 'border-gray-600 text-gray-400' 
            : 'border-gray-300 text-gray-500'
        }`}>
          <Icon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium mb-2">No tasks found</p>
          <p className="text-sm">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more tasks.'
              : 'Your task list is empty. Start by creating your first task!'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEditTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}