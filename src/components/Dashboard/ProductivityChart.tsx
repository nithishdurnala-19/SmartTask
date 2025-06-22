import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../contexts/AppContext';

const data = [
  { name: 'Mon', completed: 4, pending: 2 },
  { name: 'Tue', completed: 6, pending: 3 },
  { name: 'Wed', completed: 3, pending: 4 },
  { name: 'Thu', completed: 8, pending: 1 },
  { name: 'Fri', completed: 5, pending: 2 },
  { name: 'Sat', completed: 2, pending: 1 },
  { name: 'Sun', completed: 1, pending: 3 },
];

export function ProductivityChart() {
  const { state } = useApp();
  const isDark = state.user?.preferences.theme === 'dark';

  return (
    <div className={`rounded-xl border p-6 transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Weekly Productivity
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Pending</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="name" 
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
            />
            <YAxis 
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: isDark ? '#FFFFFF' : '#000000'
              }}
            />
            <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}