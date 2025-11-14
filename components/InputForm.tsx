
import React, { useState, useEffect, useRef } from 'react';
import { generateNarrative } from '../services/narrativeGenerator';
import { LoadingSpinner } from './LoadingSpinner';

// FIX: Add global declaration for SpeechRecognition API properties on the Window object to resolve TypeScript errors.
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface InputFormProps {
    narrative: string;
    onNarrativeChange: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 2.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM18.259 15.904 18 17.25l-.259-1.346a3.375 3.375 0 0 0-2.455-2.456l-1.036-.259 1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 9.75l.259 1.346a3.375 3.375 0 0 0 2.456 2.456l1.035.259-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

const LightbulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.255 0-2.443.29-3.5.832v-1.249c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v1.249c-1.057-.542-2.245-.832-3.5-.832Z" />
    </svg>
);

const HeartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);


export const InputForm: React.FC<InputFormProps> = ({ narrative, onNarrativeChange, onSubmit, isLoading }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            setIsSpeechSupported(true);
        }
    }, []);

    const handleGenerateClick = async () => {
        setIsGenerating(true);
        try {
            const generatedNarrative = await generateNarrative();
            onNarrativeChange(generatedNarrative);
        } catch (error) {
            console.error('Failed to generate narrative:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleToggleListen = () => {
        if (!isSpeechSupported) return;

        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        const narrativeBeforeListening = narrative; // Capture state at the start of listening

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const sessionTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');
            
            onNarrativeChange(
                [narrativeBeforeListening, sessionTranscript.trim()].filter(Boolean).join(' ')
            );
        };
        
        recognitionRef.current = recognition;
        recognition.start();
    };

    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                    AI Health Data Engine
                </h1>
                <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                   This tool uses Gemini to transform unstructured patient health logs into clean, structured JSON data, streamlining data entry and analysis.
                </p>
            </header>

            <main className="bg-surface rounded-2xl shadow-xl p-6 sm:p-8 border border-border-color">
                <form onSubmit={onSubmit}>
                    <div className="mb-6">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                           <label htmlFor="narrative" className="block text-xl font-bold text-text-primary">
                             Input your health data
                           </label>
                            <button
                                type="button"
                                onClick={handleGenerateClick}
                                disabled={isGenerating || isLoading}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-secondary bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                            >
                                {isGenerating ? <LoadingSpinner /> : <SparklesIcon className="w-4 h-4" />}
                                <span>{isGenerating ? 'Generating...' : 'Generate Example Log'}</span>
                            </button>
                        </div>
                        <p className="text-text-secondary mt-2">
                          Describe your symptoms, meals, medications, sleep, stress, and bowel movements as you would to a doctor or in a journal. The more detail, the better!
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            id="narrative"
                            value={narrative}
                            onChange={(e) => onNarrativeChange(e.target.value)}
                            placeholder="e.g., 'Woke up with a slight headache...' or click the mic to speak."
                            className="w-full h-64 p-4 pr-14 bg-background border-2 border-border-color rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-200 shadow-inner"
                            disabled={isLoading}
                            required
                        />
                         {isSpeechSupported && (
                            <button
                                type="button"
                                onClick={handleToggleListen}
                                disabled={isLoading}
                                aria-label={isListening ? 'Stop Listening' : 'Start Voice Input'}
                                className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 ${
                                    isListening
                                        ? 'bg-red-500 text-white ring-4 ring-red-300 animate-pulse'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <MicrophoneIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || !narrative.trim()}
                            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoadingSpinner /> Processing...
                                </span>
                            ) : 'Extract Structured Data'}
                        </button>
                    </div>
                </form>
            </main>

            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface rounded-2xl shadow-lg p-8 border border-border-color">
                    <h2 className="text-2xl font-bold mb-3 text-text-primary flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600">
                            <LightbulbIcon className="w-6 h-6" />
                        </span>
                        How It Works
                    </h2>
                    <div className="space-y-4 text-text-secondary">
                        <p>
                           This tool demonstrates a Generative AI pipeline that acts as an instant translator between a patient's natural language and structured clinical data.
                        </p>
                        <ul className="list-disc list-outside space-y-2 pl-5">
                             <li>
                                <strong>Natural Input:</strong> Patients speak or type their health updates in plain English. No rigid forms, sliders, or drop-down menus.
                            </li>
                            <li>
                                <strong>AI Extraction:</strong> The AI instantly analyzes the free-form narrative, identifying and extracting key clinical data points.
                            </li>
                            <li>
                                <strong>Structured Output:</strong> The result is a perfectly structured, clean JSON object, ready for clinical analysis, eliminating manual data entry.
                            </li>
                        </ul>
                    </div>
                </div>
                 <div className="bg-surface rounded-2xl shadow-lg p-8 border border-border-color">
                    <h2 className="text-2xl font-bold mb-3 text-text-primary flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-100 text-rose-600">
                            <HeartIcon className="w-6 h-6" />
                        </span>
                        Why This Matters
                    </h2>
                    <div className="space-y-4 text-text-secondary">
                        <p>
                            Traditional health apps often fail because they impose a high cognitive burden on users. This leads to inconsistent reporting and incomplete data.
                        </p>
                        <p>
                            This engine is the result of research into making self-reporting frictionless. By accepting natural language, we can drastically increase patient adherence and provide clinicians with high-quality data.
                        </p>
                        <p>
                            I built this engine directly from the findings of my MEng thesis, "A Generative AI Approach to Streamline Patient Self-Reporting in RPM and mHealth Interventions."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
