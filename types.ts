export interface Meal {
  log_type: 'meal';
  title: string;
  ingredients: string[];
  pertains_to: string;
}

export interface Symptom {
  log_type: 'symptom';
  symptom_type: string;
  score: string;
  pertains_to: string;
}

export interface StressLevel {
  log_type: 'stress_level';
  score: string;
  pertains_to: string;
}

export interface StoolData {
  log_type: 'poop';
  score: string;
  pertains_to: string;
}

export interface Medication {
  log_type: 'medication';
  name: string;
  pertains_to: string;
}

export interface Sleep {
  log_type: 'sleep';
  score: number | null;
  pertains_to: 'last night';
}

export interface PeriodStatus {
  log_type: 'period_status';
  status: boolean;
}

export interface HealthData {
  meals: Meal[];
  symptoms: Symptom[];
  stress_levels: StressLevel[];
  stool_data: StoolData[];
  medications: Medication[];
  sleep: Sleep;
  period_status: PeriodStatus;
}
