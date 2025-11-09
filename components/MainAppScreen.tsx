
import React from 'react';
import type { EventDetails } from '../types';
import { DropZone } from './DropZone';
import { Spinner } from './Spinner';

interface MainAppScreenProps {
  eventDetails: EventDetails;
  setEventDetails: React.Dispatch<React.SetStateAction<EventDetails>>;
  onZipFileSelect: (file: File) => void;
  onLogoFileSelect: (file: File) => void;
  startWorkflow: () => void;
  isLoading: boolean;
  statusMessage: string;
  eventPhotosCount: number;
  logoFile: File | null;
}

export const MainAppScreen: React.FC<MainAppScreenProps> = ({
  eventDetails,
  setEventDetails,
  onZipFileSelect,
  onLogoFileSelect,
  startWorkflow,
  isLoading,
  statusMessage,
  eventPhotosCount,
  logoFile,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ 
      ...prev, 
      [name]: name === 'numberOfPhotos' ? parseInt(value, 10) : value 
    }));
  };

  const isButtonDisabled = isLoading || !logoFile || eventPhotosCount === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">AI Social Media Collage Creator</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-xl font-bold mb-4 text-gray-700">Step 1: Event Details</h5>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
          <div className="md:col-span-3">
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-600 mb-1">School/Event Name</label>
            <input type="text" id="schoolName" name="schoolName" value={eventDetails.schoolName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-600 mb-1">Event Date</label>
            <input type="date" id="eventDate" name="eventDate" value={eventDetails.eventDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
           <div className="md:col-span-2">
            <label htmlFor="numberOfPhotos" className="block text-sm font-medium text-gray-600 mb-1">Number of Photos</label>
            <select id="numberOfPhotos" name="numberOfPhotos" value={eventDetails.numberOfPhotos} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="4">4 Photos</option>
                <option value="5">5 Photos</option>
                <option value="6">6 Photos</option>
                <option value="7">7 Photos</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label htmlFor="headerColor" className="block text-sm font-medium text-gray-600 mb-1">Header Color</label>
            <input type="color" id="headerColor" name="headerColor" value={eventDetails.headerColor} onChange={handleInputChange} className="w-full h-10 p-1 border border-gray-300 rounded-md shadow-sm cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-xl font-bold mb-4 text-gray-700">Step 2: Upload Assets</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Event Photos (.zip file)</label>
            <DropZone onFileDrop={onZipFileSelect} accept=".zip">
              <p className="text-gray-500">{eventPhotosCount > 0 ? `${eventPhotosCount} photos loaded.` : 'Drag & drop photos zip file here, or click to select.'}</p>
            </DropZone>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Project Logo</label>
            <DropZone onFileDrop={onLogoFileSelect} accept="image/*">
              {logoFile ? <img src={URL.createObjectURL(logoFile)} alt="Logo preview" className="max-h-28 mx-auto object-contain" /> : <p className="text-gray-500">Drop logo here</p>}
            </DropZone>
          </div>
        </div>
      </div>

      <button onClick={startWorkflow} disabled={isButtonDisabled} className="w-full py-4 text-xl font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center">
        {isLoading ? <><Spinner /> Processing...</> : "Generate My Collage"}
      </button>

      {statusMessage && (
        <div className="mt-4 text-center p-3 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
          {statusMessage}
        </div>
      )}
    </div>
  );
};
