import { Content, GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function assistantAI({
  chatHistory,
  query,
}: {
  chatHistory: Content[];
  query: string;
}) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: chatHistory,
  });

  const stream = await chat.sendMessageStream({
    message: query,
  });

  console.log("Stream started");
  return stream;
}
