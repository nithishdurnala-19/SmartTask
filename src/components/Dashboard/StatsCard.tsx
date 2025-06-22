import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const { state } = useApp();
  const isDark = state.user?.preferences.theme === 'dark';

  const colorClasses = {
    blue: isDark ? 'from-blue-600 to-blue-700' : 'from-blue-500 to-blue-600',
    green: isDark ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600',
    orange: isDark ? 'from-orange-600 to-orange-700' : 'from-orange-500 to-orange-600',
    red: isDark ? 'from-red-600 to-red-700' : 'from-red-500 to-red-600',
    purple: isDark ? 'from-purple-600 to-purple-700' : 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {title}
            </p>
            <p className={`text-2xl font-bold mt-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {value}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className={`text-sm ml-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  vs last week
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}