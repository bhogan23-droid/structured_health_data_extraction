import React from 'react';
import type { HealthData } from '../types';
import { JsonViewer } from './JsonViewer';

interface OutputDisplayProps {
  originalNarrative: string;
  structuredData: HealthData | null;
  isLoading: boolean;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ originalNarrative, structuredData, isLoading }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-surface p-6 rounded-xl shadow-lg border border-border-color">
        <h2 className="text-xl font-semibold mb-4 text-text-primary border-b-2 border-slate-100 pb-3">Original Narrative</h2>
        <p className="whitespace-pre-wrap text-text-secondary break-words leading-relaxed">{originalNarrative}</p>
      </div>
      <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-slate-200 border-b-2 border-slate-700 pb-3">Structured JSON Output</h2>
        <div className="h-full overflow-x-auto">
          {isLoading && !structuredData && (
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">Extracting data...</p>
            </div>
          )}
          {structuredData && (
             <JsonViewer data={structuredData} />
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