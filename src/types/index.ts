export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  estimatedTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  tags: string[];
}

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'archived';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
  notifications: boolean;
}

export interface AIsuggestion {
  id: string;
  taskId: string;
  type: 'time-slot' | 'priority' | 'category';
  suggestion: string;
  confidence: number;
  reasoning: string;
  createdAt: Date;
}

export interface TaskStats {
  completed: number;
  pending: number;
  overdue: number;
  totalTime: number;
  productivity: number;
}

export interface FilterOptions {
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}