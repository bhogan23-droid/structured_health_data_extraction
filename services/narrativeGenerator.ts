import { GoogleGenAI } from "@google/genai";
import * as data from './narrativeData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateText = async (systemInstruction: string, userPrompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8, // More creative for narrative generation
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API call for narrative generation failed:", error);
        throw new Error("Failed to generate a random narrative from the AI model.");
    }
};

export const generateNarrative = async (): Promise<string> => {
    // 1. Generate patient profile
    const gender = Math.random() > 0.5 ? 'Female' : 'Male';
    const name = gender === 'Female' ? data.getRandomItem(data.girlNames) : data.getRandomItem(data.boyNames);
    const age = Math.floor(Math.random() * (70 - 18 + 1)) + 18;
    const profession = data.getRandomItem(data.professions);
    const speechStyle = data.getRandomItem(data.speechStyles);

    // 2. Generate health data points
    const numSymptoms = Math.floor(Math.random() * 4); // 0-3
    const numMeals = Math.floor(Math.random() * 3) + 1; // 1-3
    const numPoops = Math.floor(Math.random() * 3); // 0-2
    const numStress = Math.floor(Math.random() * 3); // 0-2
    const numMeds = Math.floor(Math.random() * 3); // 0-2

    const symptoms = data.getRandomSubset(data.symptomsList, numSymptoms).map(symptom => ({
        symptom,
        severity: data.getRandomItem(data.potentialSeverityRatings),
        time: data.getRandomItem(data.potentialTimes)
    }));

    const meals = data.getRandomSubset(data.foodList, numMeals).map((food, i) => ({
        title: data.potentialMealTimes[i] || 'a meal',
        food,
    }));

    const poops = data.getRandomSubset(data.poopTypes, numPoops).map(type => ({
        type,
        time: data.getRandomItem(data.potentialTimes)
    }));

    const stresses = data.getRandomSubset(data.potentialSeverityRatings, numStress).map(level => ({
        level,
        time: data.getRandomItem(data.potentialTimes)
    }));

    const meds = data.getRandomSubset(data.medsList, numMeds).map(med => ({
        med,
        time: data.getRandomItem(data.potentialTimes)
    }));

    const sleepSeverity = Math.floor(Math.random() * 7) + 4; // 4-10
    const onPeriod = gender === 'Female' && Math.random() < 0.25;

    // 3. Construct prompts
    const systemInstruction = `You are ${name}, a ${age}-year-old ${gender} ${profession}.
You are in a healthcare appointment recounting your day yesterday to a clinician. You speak in a ${speechStyle} manner.
You must act as the patient. Provide only the patient's narrative. Do NOT describe actions or use asterisks. Do NOT ask any questions.
Your response should be a single block of text.
In your narrative, you MUST naturally include ALL of the following information.`;

    const userPromptParts = ["Here is the health information you need to include in your story about yesterday:"];

    if (symptoms.length > 0) {
        userPromptParts.push("\n\n**Symptoms:**");
        symptoms.forEach(s => { userPromptParts.push(`\n- You experienced a ${s.severity} ${s.symptom} ${s.time}.`); });
    }

    if (meals.length > 0) {
        userPromptParts.push("\n\n**Diet:**");
        meals.forEach((m, i) => { userPromptParts.push(`\n- For your ${data.potentialMealTimes[i] || 'meal'}, you ate ${m.food}.`); });
    }

    if (poops.length > 0) {
        userPromptParts.push("\n\n**Digestion:**");
        poops.forEach(p => { userPromptParts.push(`\n- You had a bowel movement that was ${p.type} ${p.time}.`); });
    }

    if (stresses.length > 0) {
        userPromptParts.push("\n\n**Stress Levels:**");
        stresses.forEach(s => { userPromptParts.push(`\n- You experienced a ${s.level} stress level ${s.time}.`); });
    }

    if (meds.length > 0) {
        userPromptParts.push("\n\n**Medication:**");
        // FIX: Used the correct loop variable `m` instead of `s` to access the `time` property.
        meds.forEach(m => { userPromptParts.push(`\n- You took ${m.med} ${m.time}.`); });
    }

    userPromptParts.push(`\n\n**Sleep:**\n- Your sleep last night was a ${sleepSeverity}/10.`);
    
    if (onPeriod) {
        userPromptParts.push("\n- You are on your period.");
    }

    userPromptParts.push("\n\nNow, please write the full, detailed patient narrative in your natural manner, incorporating all of the points above.");

    const userPrompt = userPromptParts.join('');

    return generateText(systemInstruction, userPrompt);
};