import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TaskList } from './components/Tasks/TaskList';
import { TaskForm } from './components/Tasks/TaskForm';
import { AISuggestions } from './components/AI/AISuggestions';
import { Task } from './types';

function AppContent() {
  const { state, dispatch } = useApp();
  const [activeView, setActiveView] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const isDark = state.user?.preferences.theme === 'dark';

  // Load sample data on mount
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Prepare quarterly presentation',
        description: 'Create slides for Q4 business review meeting with stakeholders',
        category: 'work',
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        estimatedTime: 120,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: null,
        tags: ['presentation', 'business', 'quarterly']
      },
      {
        id: '2',
        title: 'Morning workout routine',
        description: '30-minute cardio and strength training session',
        category: 'health',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(),
        estimatedTime: 45,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        tags: ['fitness', 'morning', 'routine']
      },
      {
        id: '3',
        title: 'Learn React Hooks advanced patterns',
        description: 'Study custom hooks, useCallback, useMemo optimization techniques',
        category: 'learning',
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedTime: 180,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedAt: null,
        tags: ['react', 'javascript', 'frontend']
      },
      {
        id: '4',
        title: 'Plan weekend trip',
        description: 'Research destinations, book accommodation, and plan itinerary',
        category: 'personal',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedTime: 90,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedAt: null,
        tags: ['travel', 'vacation', 'planning']
      },
      {
        id: '5',
        title: 'Fix production bug in payment system',
        description: 'Critical bug affecting checkout process - users cannot complete purchases',
        category: 'work',
        priority: 'urgent',
        status: 'todo',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        estimatedTime: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        tags: ['bug', 'production', 'critical']
      },
      {
        id: '6',
        title: 'Weekly meal prep',
        description: 'Prepare healthy meals for the upcoming week',
        category: 'health',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        estimatedTime: 120,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        completedAt: null,
        tags: ['cooking', 'health', 'weekly']
      },
      {
        id: '7',
        title: 'Review team performance reports',
        description: 'Analyze individual and team metrics for monthly review cycle',
        category: 'work',
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedTime: 90,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tags: ['management', 'review', 'team']
      },
      {
        id: '8',
        title: 'Update portfolio website',
        description: 'Add recent projects and refresh design with latest work samples',
        category: 'personal',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedTime: 240,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: null,
        tags: ['portfolio', 'design', 'website']
      }
    ];

    dispatch({ type: 'SET_TASKS', payload: sampleTasks });
  }, [dispatch]);

  const handleViewChange = (view: string) => {
    if (view === 'add-task') {
      setEditingTask(undefined);
      setShowTaskForm(true);
    } else {
      setActiveView(view);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList onEditTask={handleEditTask} />;
      case 'today':
        return <TaskList filterType="today" onEditTask={handleEditTask} />;
      case 'overdue':
        return <TaskList filterType="overdue" onEditTask={handleEditTask} />;
      case 'completed':
        return <TaskList filterType="completed" onEditTask={handleEditTask} />;
      case 'ai-suggestions':
        return <AISuggestions />;
      case 'analytics':
        return <Dashboard />; // For now, show dashboard for analytics
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {showTaskForm && (
        <TaskForm 
          task={editingTask} 
          onClose={handleCloseTaskForm} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;