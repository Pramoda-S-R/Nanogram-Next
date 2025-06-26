import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function parseStatus(description: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What's the status of this service? answer in one of these keywords ['Investigating', 'Identified', 'Monitoring', 'Resolved', 'Degraded', 'Operational'] \n${description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: {
            type: Type.STRING,
          },
        },
        propertyOrdering: ["status"],
      },
    },
  });

  return response.text || "";
}
