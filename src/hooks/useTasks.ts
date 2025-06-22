import { useApp } from '../contexts/AppContext';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types';
import { format, isToday, isPast, startOfDay } from 'date-fns';

export function useTasks() {
  const { state, dispatch } = useApp();

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    const updatedTask = {
      ...task,
      updatedAt: new Date(),
      completedAt: task.status === 'completed' ? new Date() : null
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const toggleTaskStatus = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
      updateTask({ ...task, status: newStatus });
    }
  };

  const getFilteredTasks = () => {
    let filtered = [...state.tasks];

    if (state.filters.category) {
      filtered = filtered.filter(task => task.category === state.filters.category);
    }
    if (state.filters.priority) {
      filtered = filtered.filter(task => task.priority === state.filters.priority);
    }
    if (state.filters.status) {
      filtered = filtered.filter(task => task.status === state.filters.status);
    }
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

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

  const getTaskStats = () => {
    const tasks = state.tasks;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
    const overdue = tasks.filter(t => 
      t.dueDate && isPast(startOfDay(t.dueDate)) && t.status !== 'completed'
    ).length;
    const totalTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const productivity = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return { completed, pending, overdue, totalTime, productivity };
  };

  const getTodayTasks = () => {
    return state.tasks.filter(task => 
      task.dueDate && isToday(task.dueDate) && task.status !== 'completed'
    );
  };

  return {
    tasks: state.tasks,
    filteredTasks: getFilteredTasks(),
    todayTasks: getTodayTasks(),
    stats: getTaskStats(),
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  };
}