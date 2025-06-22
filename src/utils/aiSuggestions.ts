import { Task, AIsuggestion, TaskPriority } from '../types';
import { format, addHours, isBefore, isAfter, startOfDay, endOfDay, differenceInDays } from 'date-fns';

export function generateAISuggestions(tasks: Task[]): AIsuggestion[] {
  const suggestions: AIsuggestion[] = [];
  
  tasks.forEach(task => {
    if (task.status !== 'completed') {
      // Time slot suggestions
      const timeSlotSuggestion = generateTimeSlotSuggestion(task, tasks);
      if (timeSlotSuggestion) {
        suggestions.push(timeSlotSuggestion);
      }
      
      // Priority suggestions
      const prioritySuggestion = generatePrioritySuggestion(task, tasks);
      if (prioritySuggestion) {
        suggestions.push(prioritySuggestion);
      }
    }
  });
  
  return suggestions;
}

function generateTimeSlotSuggestion(task: Task, allTasks: Task[]): AIsuggestion | null {
  const now = new Date();
  const workingHours = [9, 10, 11, 14, 15, 16]; // Typical working hours
  
  // Find optimal time based on task priority and estimated time
  let optimalHour = 10; // Default morning slot
  
  if (task.priority === 'urgent') {
    optimalHour = 9; // Early morning for urgent tasks
  } else if (task.priority === 'high') {
    optimalHour = 10; // Morning for high priority
  } else if (task.estimatedTime > 120) { // Long tasks
    optimalHour = 14; // After lunch for long tasks
  } else {
    optimalHour = 15; // Afternoon for regular tasks
  }
  
  const suggestedTime = format(addHours(startOfDay(now), optimalHour), 'h:mm a');
  
  return {
    id: crypto.randomUUID(),
    taskId: task.id,
    type: 'time-slot',
    suggestion: `Schedule "${task.title}" at ${suggestedTime}`,
    confidence: 0.85,
    reasoning: `Based on your task priority (${task.priority}) and estimated time (${task.estimatedTime}min), this time slot maximizes focus and energy levels.`,
    createdAt: new Date()
  };
}

function generatePrioritySuggestion(task: Task, allTasks: Task[]): AIsuggestion | null {
  const now = new Date();
  
  // Suggest priority adjustment based on due date proximity
  if (task.dueDate) {
    const daysUntilDue = differenceInDays(task.dueDate, now);
    
    if (daysUntilDue <= 1 && task.priority !== 'urgent') {
      return {
        id: crypto.randomUUID(),
        taskId: task.id,
        type: 'priority',
        suggestion: `Consider raising "${task.title}" priority to Urgent`,
        confidence: 0.92,
        reasoning: `Task is due within 24 hours. Urgent priority ensures it gets immediate attention.`,
        createdAt: new Date()
      };
    } else if (daysUntilDue <= 3 && task.priority === 'low') {
      return {
        id: crypto.randomUUID(),
        taskId: task.id,
        type: 'priority',
        suggestion: `Consider raising "${task.title}" priority to Medium or High`,
        confidence: 0.78,
        reasoning: `Task is due soon. Higher priority helps ensure timely completion.`,
        createdAt: new Date()
      };
    }
  }
  
  return null;
}

export function getProductivityInsights(tasks: Task[]): string[] {
  const insights: string[] = [];
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  
  // Completion rate insight
  if (tasks.length > 0) {
    const completionRate = (completedTasks.length / tasks.length) * 100;
    if (completionRate > 80) {
      insights.push("🎉 Excellent! You're completing over 80% of your tasks.");
    } else if (completionRate > 60) {
      insights.push("👍 Good job! You're completing most of your tasks consistently.");
    } else {
      insights.push("💡 Consider breaking down large tasks into smaller, manageable ones.");
    }
  }
  
  // Time management insight
  const avgEstimatedTime = pendingTasks.reduce((sum, task) => sum + task.estimatedTime, 0) / pendingTasks.length;
  if (avgEstimatedTime > 90) {
    insights.push("⏱️ Many of your tasks are lengthy. Try scheduling them during your peak energy hours.");
  }
  
  // Priority distribution insight
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent').length;
  if (urgentTasks > 3) {
    insights.push("🚨 You have many urgent tasks. Consider reviewing your planning process.");
  }
  
  return insights;
}