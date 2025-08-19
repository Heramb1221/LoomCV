"use server";

import { model } from "@/lib/openai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

// -----------------------------
// Generate Summary with Gemini
// -----------------------------
export async function generateSummary(input: GenerateSummaryInput) {
  // Validate input using Zod schema
  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  // Same "system message" style, just folded into prompt
  const systemMessage = `
    You are a job resume generator AI.
    Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response.
    Keep it concise and professional.
  `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} 
        from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

    Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} 
        from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

    Skills:
    ${skills}
  `;

  const fullPrompt = `${systemMessage}\n\n${userMessage}`;

  console.log("Gemini Summary Prompt:", fullPrompt);

  const result = await model.generateContent(fullPrompt);
  const aiResponse =
    result.response?.candidates &&
    result.response.candidates[0]?.content?.parts &&
    result.response.candidates[0].content.parts[0]?.text
      ? result.response.candidates[0].content.parts[0].text.trim()
      : "";

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

// -----------------------------------
// Generate Work Experience with Gemini
// -----------------------------------
export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
): Promise<WorkExperience> {
  // Validate input with Zod schema
  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI.
    Your task is to generate a single work experience entry based on the user input.

    Your response must adhere to the following structure:
    Job title: <job title>
    Company: <company name>
    Start date: <format: YYYY-MM-DD> (only if provided)
    End date: <format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be inferred from the job title>

    Do not add any fields beyond the ones listed above.
  `;

  const userMessage = `
    Please provide a work experience entry from this description:
    ${description}
  `;

  const fullPrompt = `${systemMessage}\n\n${userMessage}`;

  console.log("Gemini Work Experience Prompt:", fullPrompt);

  const result = await model.generateContent(fullPrompt);
  const aiResponse =
    result.response?.candidates &&
    result.response.candidates[0]?.content?.parts &&
    result.response.candidates[0].content.parts[0]?.text
      ? result.response.candidates[0].content.parts[0].text.trim()
      : "";

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("Gemini Work Experience Raw Response:", aiResponse);

  // Reuse the regex parsing logic you had for OpenAI
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
