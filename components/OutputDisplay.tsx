import React from 'react';
import type { HealthData } from '../types';

interface OutputDisplayProps {
  originalNarrative: string;
  structuredData: HealthData | null;
  isLoading: boolean;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ originalNarrative, structuredData, isLoading }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-border-color">
        <h2 className="text-xl font-semibold mb-4 text-text-primary border-b border-border-color pb-2">Original Narrative</h2>
        <p className="whitespace-pre-wrap text-text-secondary break-words">{originalNarrative}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-blue-200 border-b border-gray-600 pb-2">Structured JSON Output</h2>
        <div className="h-full overflow-x-auto">
          {isLoading && !structuredData && (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Extracting data...</p>
            </div>
          )}
          {structuredData && (
            <pre className="text-sm text-green-300 bg-transparent">
              <code>{JSON.stringify(structuredData, null, 2)}</code>
            </pre>
          )}
          {!isLoading && !structuredData && (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-400">Failed to generate structured data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};