import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProductivityChart } from './ProductivityChart';
import { TaskCard } from '../Tasks/TaskCard';
import { useTasks } from '../../hooks/useTasks';
import { useApp } from '../../contexts/AppContext';

export function Dashboard() {
  const { state } = useApp();
  const { stats, todayTasks } = useTasks();
  const isDark = state.user?.preferences.theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Good morning, {state.user?.name.split(' ')[0]}! 👋
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Here's what's on your agenda today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={state.tasks.length}
          icon={Target}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          color="red"
          trend={{ value: -15, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <div className="lg:col-span-2">
          <ProductivityChart />
        </div>

        {/* Today's Tasks */}
        <div className={`rounded-xl border p-6 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Today's Tasks
            </h3>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {todayTasks.length} tasks
            </span>
          </div>
          
          <div className="space-y-4">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No tasks due today
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Enjoy your day!
                </p>
              </div>
            ) : (
              todayTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="transform scale-95">
                  <TaskCard task={task} />
                </div>
              ))
            )}
            
            {todayTasks.length > 3 && (
              <div className="text-center pt-4">
                <button className={`text-sm font-medium ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                } transition-colors duration-200`}>
                  View {todayTasks.length - 3} more tasks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productivity Insights */}
      <div className={`rounded-xl border p-6 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quick Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white/80'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Productivity Rate
            </p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.productivity}%
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white/80'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Focus Time
            </p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(stats.totalTime / 60)}h
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white/80'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Average per Task
            </p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {state.tasks.length > 0 ? Math.round(stats.totalTime / state.tasks.length) : 0}min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}