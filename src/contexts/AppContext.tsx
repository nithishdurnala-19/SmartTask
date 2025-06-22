import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, User, AIsuggestion, TaskStats, FilterOptions } from '../types';
import { PersonStandingIcon } from 'lucide-react';

interface AppState {
  user: User | null;
  tasks: Task[];
  aiSuggestions: AIsuggestion[];
  stats: TaskStats;
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_AI_SUGGESTIONS'; payload: AIsuggestion[] }
  | { type: 'SET_STATS'; payload: TaskStats }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  user: {
    id: '1',
    name: 'Nitish Durnala',
    email: 'nitish@practice.com',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAFM_xyIubtJwKiuFsU3IsBZqxlRbneCKvei3_rifJE098371NG05Ptm0cfoLoAqSrXCg&usqp=CAU', // Updated to use a string URL for the avatar
    preferences: {
      theme: 'light',
      workingHours: { start: '09:00', end: '17:00' },
      timezone: 'UTC',
      notifications: true
    }
  },
  tasks: [],
  aiSuggestions: [],
  stats: { completed: 0, pending: 0, overdue: 0, totalTime: 0, productivity: 0 },
  filters: {},
  loading: false,
  error: null
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'SET_AI_SUGGESTIONS':
      return { ...state, aiSuggestions: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_THEME':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            theme: state.user.preferences.theme === 'light' ? 'dark' : 'light'
          }
        } : null
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}