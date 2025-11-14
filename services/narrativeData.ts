// services/narrativeData.ts
export const girlNames = ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Isabella', 'Mia', 'Evelyn', 'Harper', 'Luna'];
export const boyNames = ['Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Theodore'];
export const professions = ['Teacher', 'Doctor', 'Engineer', 'Artist', 'Chef', 'Software Developer', 'Nurse', 'Writer', 'Accountant', 'Electrician'];
export const symptomsList = ["headache", "nausea", "dizziness", "fatigue", "stomach pain", "bloating", "cramps", "heartburn", "constipation"];
export const foodList = ["toast and eggs", "a chicken salad", "some pasta with pesto", "salmon with broccoli", "yoghurt with fruit", "a banana and a coffee", "a ham and cheese sandwich", "a bowl of soup"];
export const medsList = ["Ibuprofen", "Paracetamol", "an Antacid tablet", "my daily Vitamin D supplement", "some allergy medication"];
export const poopTypes = ["a bit hard", "normal", "a bit soft", "quite loose", "watery"];
export const potentialSeverityRatings = ["mild", "low", "slight", "moderate", "average", "quite severe", "high", "intense"];
export const potentialMealTimes = ["breakfast", "brunch", "lunch", "a snack", "dinner"];
export const potentialTimes = ["in the early morning", "in the morning", "around mid-morning", "around lunchtime", "in the afternoon", "in the mid-afternoon", "in the early evening", "in the evening", "late in the evening", "just before I went to bed"];
export const speechStyles = ["a bit formal", "casual", "a bit rambling", "concise", "a little hesitant", "frustrated", "anxious", "exhausted"];

// Helper functions
export const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const getRandomSubset = <T>(arr: T[], count: number): T[] => {
    if (count <= 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, arr.length));
};
