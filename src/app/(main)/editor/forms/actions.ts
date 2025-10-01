"use server";

import { genAI } from "@/lib/openai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

/**
 * Helper function to safely extract the first text part from Gemini response
 */
function extractFirstText(result: Awaited<ReturnType<typeof genAI.models.generateContent>>): string {
  const candidate = result.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (!parts || parts.length === 0) return "";
  const text = parts[0]?.text;
  return text ? text.trim() : "";
}

// -----------------------------
// Generate Summary with Gemini
// -----------------------------
export async function generateSummary(input: GenerateSummaryInput): Promise<string> {
  try {
    const { jobTitle, workExperiences, educations, skills } =
      generateSummarySchema.parse(input);

    const systemMessage = `
You are a job resume generator AI.
Your task is to write a professional introduction summary for a resume given the user's provided data.
Only return the summary and do not include any other information in the response.
Keep it concise and professional (3-5 sentences maximum).
    `;

    const userMessage = `
Please generate a professional resume summary from this data:

Job title: ${jobTitle || "N/A"}

Work experience:
${
  workExperiences && workExperiences.length > 0
    ? workExperiences
        .map(
          (exp) => `
Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} 
from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

Description:
${exp.description || "N/A"}
        `
        )
        .join("\n\n")
    : "No work experience provided"
}

Education:
${
  educations && educations.length > 0
    ? educations
        .map(
          (edu) => `
Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} 
from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `
        )
        .join("\n\n")
    : "No education provided"
}

Skills:
${skills && skills.length > 0 ? skills.join(", ") : "No skills provided"}
    `;

    const fullPrompt = `${systemMessage}\n\n${userMessage}`;

    console.log("🔵 Gemini Summary Prompt:", fullPrompt.substring(0, 200) + "...");

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const aiResponse = extractFirstText(result);

    if (!aiResponse) {
      throw new Error("AI returned empty response");
    }

    console.log("✅ Gemini Summary Generated:", aiResponse.substring(0, 100) + "...");

    return aiResponse;
  } catch (error) {
    console.error("❌ Error generating summary:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    throw new Error("Failed to generate AI response");
  }
}

// -----------------------------------
// Generate Work Experience with Gemini
// -----------------------------------
export async function generateWorkExperience(
  input: GenerateWorkExperienceInput
): Promise<WorkExperience> {
  try {
    const { description } = generateWorkExperienceSchema.parse(input);

    const systemMessage = `
You are a job resume generator AI.
Your task is to generate a single work experience entry based on the user input.

Your response must adhere to the following structure. Use EXACTLY these field names:
Job title: <job title>
Company: <company name>
Start date: <format: YYYY-MM-DD> (only if clearly mentioned in the description)
End date: <format: YYYY-MM-DD> (only if clearly mentioned in the description)
Description: <an optimized description in bullet format with strong action verbs>

Rules:
- If dates are not mentioned in the input, DO NOT include Start date or End date fields
- The description should be 3-5 bullet points highlighting achievements and responsibilities
- Start each bullet with a strong action verb
- Make it ATS-friendly and quantify achievements where reasonable
    `;

    const userMessage = `
Please provide a work experience entry from this description:
${description}
    `;

    const fullPrompt = `${systemMessage}\n\n${userMessage}`;

    console.log("🔵 Gemini Work Experience Prompt:", fullPrompt.substring(0, 200) + "...");

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const aiResponse = extractFirstText(result);

    if (!aiResponse) {
      throw new Error("AI returned empty response");
    }

    console.log("✅ Gemini Work Experience Raw Response:", aiResponse);

    // Parse the response using regex
    const workExperience: WorkExperience = {
      position: aiResponse.match(/Job title:\s*(.+)/i)?.[1]?.trim() || "",
      company: aiResponse.match(/Company:\s*(.+)/i)?.[1]?.trim() || "",
      description: (
        aiResponse.match(/Description:\s*([\s\S]*?)(?=\n(?:Job title|Company|Start date|End date|$))/i)?.[1] || 
        aiResponse.match(/Description:\s*([\s\S]*)/i)?.[1] || 
        ""
      ).trim(),
      startDate: aiResponse.match(/Start date:\s*(\d{4}-\d{2}-\d{2})/i)?.[1],
      endDate: aiResponse.match(/End date:\s*(\d{4}-\d{2}-\d{2})/i)?.[1],
    };

    if (!workExperience.position) {
      console.warn("⚠️ Could not extract position from AI response");
    }

    console.log("📋 Parsed Work Experience:", workExperience);

    return workExperience;
  } catch (error) {
    console.error("❌ Error generating work experience:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate work experience: ${error.message}`);
    }
    throw new Error("Failed to generate AI response");
  }
}
