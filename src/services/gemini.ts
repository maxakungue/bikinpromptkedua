import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateAIPrompt(description: string, platform: string) {
  const prompt = `You are an expert Prompt Engineer for AI models like Midjourney, DALL-E, and Sora.
  The user wants a prompt for: ${platform}.
  User's basic idea: ${description}
  
  Generate a highly detailed, professional-grade prompt that includes:
  - Subject details
  - Lighting and atmosphere
  - Camera settings/angle
  - Style (e.g., cinematic, hyper-realistic, digital art)
  - Technical parameters (e.g., --ar 16:9 for Midjourney)
  
  Format the response as a JSON object:
  {
    "title": "Short catchy title",
    "optimizedPrompt": "The full detailed prompt",
    "explanation": "Briefly explain why these keywords were added"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
