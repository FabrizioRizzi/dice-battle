import React, { useState, useEffect } from 'react';
import { getTokenUsage, resetTokenUsage, getSettings, updateSettings } from '../services/openaiService';

/**
 * Debug panel for monitoring OpenAI API usage
 * Only visible in development mode
 */
const AIDebugPanel = () => {
  const [usage, setUsage] = useState(null);
  const [settings, setSettings] = useState(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('usage');
  
  // Fetch current usage data and settings
  useEffect(() => {
    if (!visible) return;
    
    const fetchData = () => {
      setUsage(getTokenUsage());
      setSettings(getSettings());
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, [visible]);

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }
  
  if (!visible) {
    return (
      <button 
        onClick={() => setVisible(true)}
        className="fixed bottom-2 right-2 bg-blue-500 text-white p-1 text-xs rounded"
      >
        Show AI Debug
      </button>
    );
  }
  
  const handleModelChange = (modelType) => {
    const newSettings = updateSettings({ model: modelType });
    setSettings(newSettings);
  };
  
  const handleTempChange = (e) => {
    const temp = parseFloat(e.target.value);
    const newSettings = updateSettings({ temperature: temp });
    setSettings(newSettings);
  };
  
  const handleTokenChange = (e) => {
    const tokens = parseInt(e.target.value, 10);
    const newSettings = updateSettings({ maxTokens: tokens });
    setSettings(newSettings);
  };

  return (
    <div className="fixed bottom-2 right-2 bg-gray-800 text-white p-4 rounded shadow-lg z-50 text-sm w-64">
      <div className="flex justify-between mb-3">
        <h3 className="font-bold">OpenAI Debug</h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="flex mb-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('usage')}
          className={`py-1 px-3 ${activeTab === 'usage' 
            ? 'border-b-2 border-blue-500 text-blue-500' 
            : 'text-gray-400'}`}
        >
          Usage
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-1 px-3 ${activeTab === 'settings' 
            ? 'border-b-2 border-blue-500 text-blue-500' 
            : 'text-gray-400'}`}
        >
          Settings
        </button>
      </div>
      
      {activeTab === 'usage' && usage && (
        <div className="space-y-1">
          <p>API Calls: {usage.apiCalls}</p>
          <p>Prompt Tokens: {usage.promptTokens}</p>
          <p>Completion Tokens: {usage.completionTokens}</p>
          <p>Total Tokens: {usage.totalTokens}</p>
          <p>Time Since Reset: {usage.sinceLastReset}</p>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                resetTokenUsage();
                setUsage(getTokenUsage());
              }}
              className="bg-red-500 text-white px-2 py-1 text-xs rounded"
            >
              Reset Count
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && settings && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400">Model</label>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <button
                onClick={() => handleModelChange('default')}
                className={`text-xs p-1 rounded ${settings.model === 'gpt-3.5-turbo' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'}`}
              >
                Default
              </button>
              <button
                onClick={() => handleModelChange('economy')}
                className={`text-xs p-1 rounded ${settings.model === 'gpt-3.5-turbo-instruct' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'}`}
              >
                Economy
              </button>
              <button
                onClick={() => handleModelChange('premium')}
                className={`text-xs p-1 rounded ${settings.model === 'gpt-4' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'}`}
              >
                Premium
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400">
              Temperature: {settings.temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={handleTempChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400">
              Max Tokens: {settings.maxTokens}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={settings.maxTokens}
              onChange={handleTokenChange}
              className="w-full"
            />
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            <p>Current Model: {settings.model}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDebugPanel;