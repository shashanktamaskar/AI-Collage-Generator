
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

import { ApiKeyScreen } from './components/ApiKeyScreen';
import { MainAppScreen } from './components/MainAppScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { getBestPhotosFromGrid, checkVirality } from './services/geminiService';
import { createThumbnailGrid, generateCollage } from './services/imageService';
import { fileToImage, unzipImages } from './utils/fileUtils';
import type { AppState, EventDetails, ResultData } from './types';

const parseViralityScore = (text: string): number => {
  if (!text) return 0;
  // Matches "9/10", "9.5/10", etc.
  const match = text.match(/(\d+(\.\d+)?)\s*\/\s*10/);
  return match ? parseFloat(match[1]) : 0;
};


function App() {
  const [appState, setAppState] = useState<AppState>('API_KEY');
  const [apiKey, setApiKey] = useState<string>('');
  const [genAI, setGenAI] = useState<GoogleGenAI | null>(null);

  const [eventDetails, setEventDetails] = useState<EventDetails>({
    schoolName: 'GHS DAYALPURA, SAS Nagar',
    eventDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD for input type date
    headerColor: '#004646',
    numberOfPhotos: 4,
  });
  const [eventPhotos, setEventPhotos] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  
  const handleApiKeySubmit = (key: string) => {
    try {
      // Use the provided API key to initialize GoogleGenAI
      const aiInstance = new GoogleGenAI({ apiKey: key });
      setApiKey(key);
      setGenAI(aiInstance);
      setAppState('MAIN_APP');
    } catch (error) {
      alert(`Invalid API Key or configuration error. Please check your key and try again. Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
    }
  };

  const handleZipFile = useCallback(async (file: File) => {
    setStatusMessage(`Unzipping "${file.name}"...`);
    try {
      const photos = await unzipImages(file);
      setEventPhotos(photos);
      setStatusMessage(`Successfully loaded ${photos.length} photos.`);
    } catch (error) {
      console.error(error);
      setStatusMessage(`Error: Could not read the zip file. ${error instanceof Error ? error.message : ''}`);
    }
  }, []);

  const runWorkflow = async () => {
    if (!genAI || !logoFile || eventPhotos.length === 0) {
      alert("Please ensure an API key is set, a logo is uploaded, and photos are provided.");
      return;
    }
     if (eventPhotos.length < eventDetails.numberOfPhotos) {
      alert(`You've selected to create a collage with ${eventDetails.numberOfPhotos} photos, but only ${eventPhotos.length} were provided. Please upload more photos or select a lower number.`);
      return;
    }


    setIsLoading(true);
    setResultData(null);
    setAppState('PROCESSING');
    
    const MAX_RETRIES = 3;
    let bestResult: ResultData | null = null;
    let bestScore = -1;

    try {
      const allFilenames = eventPhotos.map(f => f.name);
      const gridData = eventPhotos.length > eventDetails.numberOfPhotos ? await createThumbnailGrid(eventPhotos) : '';

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        let candidateFilenames: string[];
        
        if (eventPhotos.length <= eventDetails.numberOfPhotos) {
           setStatusMessage(`Photo count is low (${eventPhotos.length}), using all available photos for the collage.`);
           candidateFilenames = allFilenames;
        } else {
            setStatusMessage(`Attempt ${attempt}/${MAX_RETRIES}: AI is selecting the best ${eventDetails.numberOfPhotos} photos...`);
            candidateFilenames = await getBestPhotosFromGrid(genAI, gridData, allFilenames, eventDetails.numberOfPhotos);
        }

        if (candidateFilenames.length < eventDetails.numberOfPhotos) {
          throw new Error(`AI could only select ${candidateFilenames.length} unique photos. Please try again with a different set of images.`);
        }

        setStatusMessage(`Attempt ${attempt}/${MAX_RETRIES}: Generating collage...`);
        const selectedFiles = eventPhotos.filter(f => candidateFilenames.includes(f.name));
        const logoImg = await fileToImage(logoFile);
        const collageDataUrl = await generateCollage(selectedFiles, logoImg, eventDetails);

        setStatusMessage(`Attempt ${attempt}/${MAX_RETRIES}: Performing virality check...`);
        const collageBase64 = collageDataUrl.split(',')[1];
        const viralityResult = await checkVirality(genAI, collageBase64);
        const currentScore = parseViralityScore(viralityResult);

        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestResult = { collageUrl: collageDataUrl, viralityText: viralityResult };
        }
        
        // Virality score is 1-10. We check for > 9, which means 9.1 or higher. A score of exactly 9 will trigger a rerun.
        if (currentScore > 9) {
            setStatusMessage(`Success! Achieved a high virality score of ${currentScore}/10.`);
            break; 
        }

        if (attempt < MAX_RETRIES) {
            setStatusMessage(`Score was ${currentScore}/10. Rerunning to improve... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
        } else {
             setStatusMessage(`Completed all ${MAX_RETRIES} attempts. Presenting the best result with a score of ${bestScore}/10.`);
        }
         // If we are using all photos, no point in retrying.
        if (eventPhotos.length <= eventDetails.numberOfPhotos) break;
      }
      
      if (!bestResult) {
        throw new Error("Could not generate a collage. Please try again.");
      }

      setResultData(bestResult);
      setAppState('RESULTS');

    } catch (error) {
      console.error("Workflow failed:", error);
      setStatusMessage(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      setAppState('MAIN_APP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAppState('MAIN_APP');
    setResultData(null);
    setStatusMessage('');
    // Reset file inputs by changing their key, or manually clearing them if needed.
    // For this app, we just clear the state.
    setEventPhotos([]);
    setLogoFile(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'API_KEY':
        return <ApiKeyScreen onApiKeySubmit={handleApiKeySubmit} />;
      case 'MAIN_APP':
      case 'PROCESSING':
        return (
          <MainAppScreen
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            onZipFileSelect={handleZipFile}
            onLogoFileSelect={setLogoFile}
            startWorkflow={runWorkflow}
            isLoading={isLoading}
            statusMessage={statusMessage}
            eventPhotosCount={eventPhotos.length}
            logoFile={logoFile}
          />
        );
      case 'RESULTS':
        return resultData ? <ResultsScreen resultData={resultData} onReset={handleReset} /> : <p>Loading results...</p>;
      default:
        return <p>Something went wrong.</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
