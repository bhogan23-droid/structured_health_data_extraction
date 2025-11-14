import React from 'react';
import type { HealthData, Symptom, Meal, Medication, StressLevel, Sleep, StoolData, PeriodStatus } from '../types';

// SVG Icons for cards - color classes will be applied in the component
const SymptomsIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
);
const MealsIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
        <path d="M21 15v6" />
    </svg>
);
const MedsIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 5h4v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v2z" />
        <path d="M14 5v11a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-11" />
        <path d="M8 12h8" />
    </svg>
);
const StressIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);
const SleepIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);
const StoolIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V7c0-1.657 1.343-3 3-3h6c1.657 0 3 1.343 3 3v2M9 16v4h6v-4M3 9h18v7H3V9z" />
    </svg>
);
const PeriodIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
);

interface CardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const InfoCard: React.FC<CardProps> = ({ title, icon, children }) => (
    <div className="bg-surface rounded-xl shadow-sm p-6 flex flex-col border border-border-color transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <div className="flex items-center text-text-primary mb-4">
            {icon}
            <h3 className="text-xl font-semibold ml-3">{title}</h3>
        </div>
        <div className="flex-grow">{children}</div>
    </div>
);

const NoDataMessage: React.FC<{ message: string }> = ({ message }) => (
    <p className="text-center text-text-muted py-4 h-full flex items-center justify-center">{message}</p>
);

const IconWrapper: React.FC<{bgColor: string, children: React.ReactNode}> = ({bgColor, children}) => (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
        {children}
    </div>
);

export const SummaryDisplay: React.FC<{ data: HealthData }> = ({ data }) => {
    const { meals, symptoms, stress_levels, stool_data, medications, sleep, period_status } = data;
    const iconClass = "w-6 h-6";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <InfoCard title="Symptoms" icon={<IconWrapper bgColor="bg-red-100"><SymptomsIcon className={`${iconClass} text-red-600`} /></IconWrapper>}>
                {symptoms.length > 0 ? (
                    <ul className="space-y-3 text-text-secondary">
                        {symptoms.map((symptom: Symptom, index: number) => (
                            <li key={index} className="flex justify-between items-start gap-4">
                                <span>
                                    <span className="font-semibold text-text-primary">{symptom.symptom_type}</span> ({symptom.score})
                                </span>
                                <span className="text-sm text-text-muted flex-shrink-0">{symptom.pertains_to}</span>
                            </li>
                        ))}
                    </ul>
                ) : <NoDataMessage message="No symptoms recorded." />}
            </InfoCard>

            <InfoCard title="Meals" icon={<IconWrapper bgColor="bg-green-100"><MealsIcon className={`${iconClass} text-green-600`} /></IconWrapper>}>
                 {meals.length > 0 ? (
                    <ul className="space-y-3">
                        {meals.map((meal: Meal, index: number) => (
                            <li key={index} className="border-t border-border-color first:border-t-0 pt-2 first:pt-0">
                                <p className="font-semibold text-text-primary flex justify-between">
                                    <span>{meal.title}</span>
                                    <span className="font-normal text-sm text-text-muted">{meal.pertains_to}</span>
                                </p>
                                <p className="text-sm text-text-secondary italic">{meal.ingredients.join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                 ) : <NoDataMessage message="No meals recorded." />}
            </InfoCard>

            <InfoCard title="Medications" icon={<IconWrapper bgColor="bg-blue-100"><MedsIcon className={`${iconClass} text-blue-600`} /></IconWrapper>}>
                {medications.length > 0 ? (
                    <ul className="space-y-2 text-text-secondary">
                        {medications.map((med: Medication, index: number) => (
                            <li key={index} className="flex justify-between">
                                <span className="font-semibold text-text-primary">{med.name}</span>
                                <span>{med.pertains_to}</span>
                            </li>
                        ))}
                    </ul>
                ) : <NoDataMessage message="No medications recorded." />}
            </InfoCard>

            <InfoCard title="Stress" icon={<IconWrapper bgColor="bg-yellow-100"><StressIcon className={`${iconClass} text-yellow-600`} /></IconWrapper>}>
                {stress_levels.length > 0 ? (
                    <ul className="space-y-3 text-text-secondary">
                        {stress_levels.map((stress: StressLevel, index: number) => (
                            <li key={index} className="flex justify-between items-start gap-4">
                                <span className="font-semibold text-text-primary capitalize">{stress.score}</span>
                                <span className="text-sm text-text-muted flex-shrink-0">{stress.pertains_to}</span>
                            </li>
                        ))}
                    </ul>
                ) : <NoDataMessage message="No stress levels recorded." />}
            </InfoCard>
            
            <InfoCard title="Sleep Quality" icon={<IconWrapper bgColor="bg-indigo-100"><SleepIcon className={`${iconClass} text-indigo-600`} /></IconWrapper>}>
                {sleep && sleep.score !== null ? (
                    <div className="flex justify-between items-center h-full text-text-secondary">
                        <div>
                            <span className="font-bold text-2xl text-text-primary">{sleep.score}</span>
                            <span className="text-text-muted"> / 10</span>
                        </div>
                        <span className="text-sm text-text-muted flex-shrink-0">{sleep.pertains_to}</span>
                    </div>
                ) : <NoDataMessage message="No sleep rating recorded." />}
            </InfoCard>

            <InfoCard title="Stool Data" icon={<IconWrapper bgColor="bg-orange-100"><StoolIcon className={`${iconClass} text-orange-600`} /></IconWrapper>}>
                {stool_data.length > 0 ? (
                    <ul className="space-y-3 text-text-secondary">
                        {stool_data.map((stool: StoolData, index: number) => (
                            <li key={index} className="flex justify-between items-start gap-4">
                                <span className="font-semibold text-text-primary capitalize">{stool.score}</span>
                                <span className="text-sm text-text-muted flex-shrink-0">{stool.pertains_to}</span>
                            </li>
                        ))}
                    </ul>
                ) : <NoDataMessage message="No stool data recorded." />}
            </InfoCard>
            
            <InfoCard title="Period Status" icon={<IconWrapper bgColor="bg-pink-100"><PeriodIcon className={`${iconClass} text-pink-600`} /></IconWrapper>}>
                {period_status ? (
                    <div className="flex justify-start items-center gap-4 text-text-secondary h-full">
                        <span className="font-semibold text-text-primary">
                            {period_status.status ? 'Currently on period' : 'Not on period'}
                        </span>
                    </div>
                ) : <NoDataMessage message="No period status recorded." />}
            </InfoCard>

        </div>
    );
};