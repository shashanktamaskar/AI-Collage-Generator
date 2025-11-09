
import React, { useState } from 'react';

interface ApiKeyScreenProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    } else {
      alert('Please enter a valid API key.');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome!</h2>
      <p className="text-gray-600 mb-6">
        To begin, please enter your Google AI (Gemini) API Key. Your key is stored only in your browser for this session and is required to power the AI features.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="w-full max-w-md mb-4">
          <label htmlFor="apiKeyInput" className="sr-only">Google AI API Key</label>
          <input
            type="password"
            id="apiKeyInput"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Enter your secret API key"
          />
        </div>
        <button
          type="submit"
          className="w-full max-w-md px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
        >
          Save Key & Start Creating
        </button>
      </form>
      <a
        href="https://aistudio.google.com/app/apikey"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
      >
        Get a free API Key here
      </a>
    </div>
  );
};
