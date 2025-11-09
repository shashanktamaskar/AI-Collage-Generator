import React from 'react';
import type { ResultData } from '../types';

interface ResultsScreenProps {
  resultData: ResultData;
  onReset: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ resultData, onReset }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 text-center animate-fade-in space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Your Collage is Ready!</h3>
      
      <div className="max-w-2xl mx-auto">
        <img 
          src={resultData.collageUrl} 
          alt="Generated Collage" 
          className="w-full h-auto rounded-lg shadow-lg border-4 border-gray-200"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
        <h5 className="text-lg font-semibold text-gray-700 mb-2">AI Quality &amp; Impact Analysis:</h5>
        <p className="text-gray-600 whitespace-pre-wrap">{resultData.viralityText}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
          href={resultData.collageUrl} 
          download="social_media_collage.jpeg" 
          className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
        >
          Download Collage
        </a>
        <button 
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};