import React from 'react';
import { Search, Bell, User, Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function Navbar() {
  const { state, dispatch } = useApp();
  const isDark = state.user?.preferences.theme === 'dark';

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900/80 border-gray-700 text-white' 
        : 'bg-white/80 border-gray-200 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            
              <img
                src="public\assets\logo.avif"
                alt="Logo"
                className="w-12 h-12 object-cover"
              />
           
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Tasks
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                onChange={(e) => dispatch({ 
                  type: 'SET_FILTERS', 
                  payload: { ...state.filters, search: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Bell className="w-5 h-5" />
            </button>
            
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <img
                src={state.user?.avatar}
                alt={state.user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:block font-medium">
                {state.user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}