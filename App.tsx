import React, { useState, useCallback } from 'react';
import type { HealthData } from './types';
import { extractHealthData } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { ResultsPage } from './components/ResultsPage';

type View = 'form' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [narrative, setNarrative] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalNarrative, setOriginalNarrative] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<HealthData | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!narrative.trim() || isLoading) return;

    setIsLoading(true);
    setStatus('Processing: Sending to Gemini API...');
    setStructuredData(null);
    setOriginalNarrative(narrative);
    setView('results'); // Switch view immediately

    try {
      const result = await extractHealthData(narrative);
      setStructuredData(result);
      setStatus('Success: Data extracted.');
    } catch (error) {
      console.error('Error processing health log:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Error: Failed to process data. ${errorMessage}`);
      setStructuredData(null);
    } finally {
      setIsLoading(false);
    }
  }, [narrative, isLoading]);

  const handleGoBack = useCallback(() => {
    setView('form');
    // Reset state for a fresh entry
    setNarrative('');
    setOriginalNarrative(null);
    setStructuredData(null);
    setStatus('Ready');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      {view === 'form' ? (
        <InputForm
          narrative={narrative}
          onNarrativeChange={setNarrative}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      ) : (
        <ResultsPage
          originalNarrative={originalNarrative}
          structuredData={structuredData}
          isLoading={isLoading}
          onGoBack={handleGoBack}
          status={status}
        />
      )}
    </div>
  );
};

export default App;