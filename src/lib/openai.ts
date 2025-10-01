import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const model = genAI.models; // ✅ so you can call model.generateContent(...)
