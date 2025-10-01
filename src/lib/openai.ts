import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
