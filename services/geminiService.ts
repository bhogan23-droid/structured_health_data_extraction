import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { HealthData } from '../types';

// Assume API_KEY is set in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert healthcare data extraction engine. Your task is to extract all relevant health information from the patient's narrative. Extract structured health data including meals, symptoms, stress levels, stool information, medications, sleep quality, and period status from the user's input. If unsure, return 'Unsure' or 'NOT GIVEN' as specified in the schema, instead of guessing. All fields are required, but uncertainty should be explicitly stated. Once extracted, you MUST call the 'extract_health_data' function with the structured data. Do not respond with text. Only call the function.`;

const EXTRACT_HEALTH_DATA_SCHEMA: FunctionDeclaration['parameters'] = {
  type: Type.OBJECT,
  properties: {
    meals: {
      type: Type.ARRAY,
      description: "List of meals mentioned.",
      items: {
        type: Type.OBJECT,
        properties: {
          log_type: { type: Type.STRING, description: "Always 'meal'." },
          title: { type: Type.STRING, description: "Meal type (e.g., 'breakfast', 'lunch'). If not given, return 'NOT GIVEN' and DO NOT GUESS." },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of estimated ingredients in the meal. If NOT GIVEN, return ['NOT GIVEN']." },
          pertains_to: { type: Type.STRING, description: "Estimated time of day meal was consumed. If NOT GIVEN, return 'NOT GIVEN'." }
        },
        required: ["log_type", "title", "ingredients", "pertains_to"]
      }
    },
    symptoms: {
      type: Type.ARRAY,
      description: "List of symptoms mentioned.",
      items: {
        type: Type.OBJECT,
        properties: {
          log_type: { type: Type.STRING, description: "Always 'symptom'." },
          symptom_type: { type: Type.STRING, description: "Type of symptom (e.g., 'Bloating', 'Headache'). If NOT GIVEN, return 'NOT GIVEN'." },
          score: { type: Type.STRING, description: "Estimated severity description (e.g., 'mild', 'moderate', 'severe'). If NOT GIVEN, return 'NOT GIVEN'." },
          pertains_to: { type: Type.STRING, description: "Estimated time of day symptom was experienced. If NOT GIVEN, return 'NOT GIVEN'." }
        },
        required: ["log_type", "symptom_type", "score", "pertains_to"]
      }
    },
    stress_levels: {
      type: Type.ARRAY,
      description: "List of stress level logs.",
      items: {
        type: Type.OBJECT,
        properties: {
          log_type: { type: Type.STRING, description: "Always 'stress_level'." },
          score: { type: Type.STRING, description: "Stress severity description (e.g., 'low', 'moderate', 'high'). If NOT GIVEN, return 'NOT GIVEN'." },
          pertains_to: { type: Type.STRING, description: "Estimated time of day stress was experienced. If NOT GIVEN, return 'NOT GIVEN'." }
        },
        required: ["log_type", "score", "pertains_to"]
      }
    },
    stool_data: {
      type: Type.ARRAY,
      description: "List of stool-related logs.",
      items: {
        type: Type.OBJECT,
        properties: {
          log_type: { type: Type.STRING, description: "Always 'poop'." },
          score: { type: Type.STRING, description: "Description of stool consistency (e.g., 'hard', 'normal', 'loose'). If NOT GIVEN, return 'NOT GIVEN'." },
          pertains_to: { type: Type.STRING, description: "Estimated time of day bowel movement was experienced. If NOT GIVEN, return 'NOT GIVEN'." }
        },
        required: ["log_type", "score", "pertains_to"]
      }
    },
    medications: {
      type: Type.ARRAY,
      description: "List of medications taken.",
      items: {
        type: Type.OBJECT,
        properties: {
          log_type: { type: Type.STRING, description: "Always 'medication'." },
          name: { type: Type.STRING, description: "Medication name. If NOT GIVEN, return 'NOT GIVEN'." },
          pertains_to: { type: Type.STRING, description: "Estimated time of day medication was taken. If NOT GIVEN, return 'NOT GIVEN'." }
        },
        required: ["log_type", "name", "pertains_to"]
      }
    },
    sleep: {
      type: Type.OBJECT,
      properties: {
        log_type: { type: Type.STRING, description: "Always 'sleep'." },
        score: { type: Type.INTEGER, description: "Sleep quality rating (1-10). If NOT GIVEN, return null." },
        pertains_to: { type: Type.STRING, description: "Always 'last night'." }
      },
      required: ["log_type", "score", "pertains_to"]
    },
    period_status: {
      type: Type.OBJECT,
      properties: {
        log_type: { type: Type.STRING, description: "Always 'period_status'." },
        status: { type: Type.BOOLEAN, description: "Indicates whether the patient mentioned being on their period." }
      },
      required: ["log_type", "status"]
    }
  },
  required: ["meals", "symptoms", "stress_levels", "stool_data", "medications", "sleep", "period_status"]
};

const extractHealthDataTool: FunctionDeclaration = {
  name: 'extract_health_data',
  description: "Extract structured health data including meals, symptoms, stress levels, stool information, medications, sleep quality, and period status from the user's input. If unsure, return 'Unsure' instead of guessing. All fields are required, but uncertainty should be explicitly stated.",
  parameters: EXTRACT_HEALTH_DATA_SCHEMA,
};


export const extractHealthData = async (narrative: string): Promise<HealthData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Patient Narrative: ${narrative}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [extractHealthDataTool] }],
        temperature: 0, // Set to 0 for deterministic output with tool calling
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0 && functionCalls[0].name === 'extract_health_data') {
        const data = functionCalls[0].args as unknown as HealthData;
        console.log("Gemini requested to call 'extract_health_data' tool with:", data);
        return data;
    } else {
        console.error("Model response did not include the expected function call:", response);
        throw new Error("The AI failed to structure the data correctly for saving.");
    }

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the AI model to process data.");
  }
};
