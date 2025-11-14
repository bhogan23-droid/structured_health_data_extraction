import React, { useState } from 'react';
import type { HealthData } from '../types';
import { OutputDisplay } from './OutputDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { SummaryDisplay } from './SummaryDisplay';

interface ResultsPageProps {
    originalNarrative: string | null;
    structuredData: HealthData | null;
    isLoading: boolean;
    onGoBack: () => void;
    status: string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
    originalNarrative,
    structuredData,
    isLoading,
    onGoBack,
    status
}) => {
    const [showRawData, setShowRawData] = useState(false);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col">
             <header className="w-full flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                     <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Extraction Results</h1>
                     <p className="text-md text-text-secondary">A summary of the patient's health log.</p>
                </div>
                <button
                    onClick={onGoBack}
                    className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover transition-all duration-200 transform hover:scale-105"
                >
                    &larr; New Log
                </button>
            </header>
            <main className="w-full">
                <div className="mb-8 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary bg-surface p-4 rounded-xl shadow-sm border border-border-color">
                    {isLoading && <LoadingSpinner />}
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span>{status}</span>
                    </div>
                    {!isLoading && structuredData && status.startsWith('Success') && (
                        <span className="flex items-center gap-1.5 bg-success-bg text-success text-xs font-medium px-2.5 py-0.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                            </svg>
                            Tool Call Successful
                        </span>
                    )}
                     {!isLoading && !structuredData && status.startsWith('Error') && (
                        <span className="flex items-center gap-1.5 bg-error-bg text-error text-xs font-medium px-2.5 py-0.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0 -16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                            </svg>
                            Processing Failed
                        </span>
                    )}
                </div>

                {!isLoading && structuredData && (
                    <div className="mb-8 animate-fade-in">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 border-b border-border-color pb-2">Health Summary</h2>
                        <SummaryDisplay data={structuredData} />
                    </div>
                )}

                {originalNarrative && !isLoading && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setShowRawData(!showRawData)}
                            className="px-6 py-2 bg-gray-100 text-text-secondary font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                        >
                            {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
                        </button>
                    </div>
                )}


                {showRawData && originalNarrative && (
                     <div className="mt-8 animate-fade-in">
                        <OutputDisplay
                            originalNarrative={originalNarrative}
                            structuredData={structuredData}
                            isLoading={isLoading}
                        />
                     </div>
                )}
            </main>
        </div>
    );
}