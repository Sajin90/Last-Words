
import { GoogleGenAI, Type } from "@google/genai";
import { MessageTone } from "../types";

export const generateLegacyMessage = async (
  recipientName: string,
  tone: MessageTone,
  keyDetails: string,
  length: 'short' | 'medium' | 'long'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Write a heartfelt legacy message to ${recipientName}. 
  The tone should be ${tone}. 
  Incorporate these key details: ${keyDetails}. 
  The message should be ${length} in length. 
  Ensure it is respectful, thoughtful, and provides closure.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.8,
      topP: 0.95,
      systemInstruction: "You are a compassionate legacy counselor helping people write their final words. Your goal is to provide comfort, wisdom, and closure."
    }
  });

  return response.text || "I'm sorry, I couldn't generate a message at this time.";
};
