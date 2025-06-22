import React from 'react';
import { 
  Home, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus,
  CheckSquare,
  Clock,
  AlertTriangle,
  Target
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTasks } from '../../hooks/useTasks';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { state } = useApp();
  const { stats } = useTasks();
  const isDark = state.user?.preferences.theme === 'dark';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, count: null },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare, count: state.tasks.length },
    { id: 'today', label: 'Today', icon: Calendar, count: stats.pending },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: stats.overdue },
    { id: 'completed', label: 'Completed', icon: Target, count: stats.completed },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: null },
  ];

  return (
    <aside className={`w-64 min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-r`}>
      <div className="p-6">
        {/* Quick Add Button */}
        <button
          onClick={() => onViewChange('add-task')}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>

        {/* Navigation Menu */}
        <nav className="mt-8">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeView === item.id
                      ? isDark
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-50 text-blue-700 shadow-md'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeView === item.id
                        ? 'bg-white/20 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* AI Assistant */}
        <div className={`mt-8 p-4 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-blue-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Assistant</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
            Get smart suggestions for your tasks
          </p>
          <button
            onClick={() => onViewChange('ai-suggestions')}
            className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            View Suggestions
          </button>
        </div>
      </div>
    </aside>
  );
}