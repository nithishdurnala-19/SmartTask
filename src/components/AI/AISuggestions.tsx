import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, Clock, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { generateAISuggestions, getProductivityInsights } from '../../utils/aiSuggestions';
import { AIsuggestion } from '../../types';

export function AISuggestions() {
  const { state, dispatch } = useApp();
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const isDark = state.user?.preferences.theme === 'dark';

  useEffect(() => {
    const aiSuggestions = generateAISuggestions(state.tasks);
    const productivityInsights = getProductivityInsights(state.tasks);
    
    setSuggestions(aiSuggestions);
    setInsights(productivityInsights);
  }, [state.tasks]);

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Suggestions (need to integrte with backend)
        </h2>
      </div>

      {/* Productivity Insights */}
      <div className={`rounded-xl border p-6 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Productivity Insights
          </h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-white/80'
            }`}>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Task Suggestions */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Smart Recommendations
        </h3>
        
        {suggestions.length === 0 ? (
          <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
            isDark 
              ? 'border-gray-600 text-gray-400' 
              : 'border-gray-300 text-gray-500'
          }`}>
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">All caught up!</p>
            <p className="text-sm">No suggestions at the moment. Keep up the great work!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className={`w-4 h-4 ${
                        suggestion.type === 'time-slot' ? 'text-blue-500' : 
                        suggestion.type === 'priority' ? 'text-orange-500' : 'text-green-500'
                      }`} />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        suggestion.type === 'time-slot' ? 'bg-blue-100 text-blue-800' : 
                        suggestion.type === 'priority' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {suggestion.type === 'time-slot' ? 'Time Slot' : 
                         suggestion.type === 'priority' ? 'Priority' : 'Category'}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </span>
                    </div>
                    
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {suggestion.suggestion}
                    </h4>
                    
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {suggestion.reasoning}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${
                      isDark
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}