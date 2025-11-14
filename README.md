Project Overview
This repository hosts an Interactive Prototype (Product Demo / Option 2) for the AI Streamline Engine, a B2B API service designed to transform patient self-reporting in Remote Patient Monitoring (RPM) and mHealth applications.The goal of this project is to validate the central finding of my thesis: that Generative AI can eliminate the cognitive and manual burden of structured data entry by converting natural language narratives into organized, machine-readable data.The prototype simulates the patient's input interface and demonstrates the core function: Natural Language to Structured JSON Extraction.

AI Component: Why Zero-Shot Extraction is Necessary
The Generative AI component is not an add-on; it is the core value proposition of the product. The AI performs a task that traditional programming cannot effectively handle: bridging the gap between conversational human language and structured clinical data.

Functional Integration (What the AI Does)
ComponentDescriptionAI TaskZero-shot Information Extraction and Semantic Mapping. The AI is specifically prompted to identify, classify, and extract all relevant health data points (e.g., symptoms, meals, medications) from an unstructured text string.Input/OutputInput: Unstructured patient narrative (free-form text string). 
Output: A strictly enforced, standardized JSON object defined by a clinical schema.

Why It Was Chosen
I built this tool because my research found that current mHealth apps don't listen to patients in their natural language. By accepting fluid input, the AI drastically reduces reporting friction, which is the proven method for achieving higher and more sustained patient adherence and, consequently, higher quality datasets for clients.

Prototype Usage and Technical Stack
How to Run the PrototypeOpen the index.html file in any modern web browser (it is self-contained).Enter a conversational health update (e.g., describing a meal, a symptom, or stress level) into the large text area.
Click the "Process Health Log (AI Extraction)" button.
The output will immediately display the original, unstructured narrative alongside the clean, extracted, and structured JSON object.

Technical Architecture
Frontend: HTML, CSS, and Vanilla JavaScript (All self-contained in index.html).
AI Integration: The JavaScript contains the structure and logic for sending a highly specific System Prompt along with the user's text to a Generative AI model (developed using Google AI Studio/Gemini API).
Hosting: Hosted via Google Studio.

AI Studio Prompting Strategy and Iteration Log
This section documents the specific prompts used in Google AI Studio's Build feature to generate the code and refine the core AI functionality. This demonstrates the required iterative development process.

1. Core Generation Prompt (The Initial Ask):
Combined Prompt for Google AI Studio
Goal: Generate a single HTML/JavaScript file that simulates the front-end patient self-reporting interface and includes the core Generative AI logic needed for the AI Streamline Engine prototype.

Instructions:

Generate a single file containing all necessary HTML, CSS (minimal, for responsiveness), and JavaScript.

The resulting page must be a patient input simulator with a large <textarea> for the user to enter their unstructured health log and a submit button labeled "Submit Health Log".

The core Generative AI functionality must be implemented in the JavaScript.

AI Role: Define the AI as an "expert healthcare data extraction engine" that converts the patient's narrative into structured data.

AI Input: The patient's text from the <textarea>.

AI Output: A strictly formatted JSON object.

JSON Schema: The output JSON must contain the keys: symptoms (including severity/time), meals (including time and all known ingredients), stress_level (scale 1-10), sleep_rating (scale 1-5), medications, and stool_quality (Bristol scale 1-7).

When the user clicks the button, the JavaScript should:

Capture the user's text.

Call the AI (using a placeholder function or a demonstration of the API call structure).

Display the output: Show both the original input text and the resulting structured JSON object on the page.


2. Prompt Used for Refining or Debugging:

over the course of several prompts i changed the layout, added a random day generator and a voice to text fucntionality. I also spit the functionality into two pages



4. Prompt Used for Feature EnhancementPlaintext

Use this code for tool calling
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
