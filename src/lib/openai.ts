import { GoogleGenAI } from "@google/genai";
import { env } from "@/env";

// Initialize the Google GenAI client with API key
export const genAI = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

// No wrapper needed — call genAI.models.generateContent directly in actions
