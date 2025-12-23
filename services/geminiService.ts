
import { GoogleGenAI, Type } from "@google/genai";
import { Worksheet, TherapyModality } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const generateWorksheet = async (
  modality: TherapyModality,
  focus: string,
  clientContext?: string
): Promise<Worksheet> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Generate a ${modality} therapy worksheet focused on: ${focus}.
    ${clientContext ? `Context about the client: ${clientContext}` : ""}
    
    Requirements:
    - Modality: ${modality}
    - Specific Focus: ${focus}
    - Make it actionable and supportive.
    - Include reflective questions and specific exercises.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      id: crypto.randomUUID()
    };
  } catch (error) {
    console.error("Error generating worksheet:", error);
    throw error;
  }
};
