"use server";
import { getAllNanograms, getUpcomingEvents } from "@/app/actions/api";
import { Content, GoogleGenAI, ToolListUnion, Type } from "@google/genai";
import Stream from "stream";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY as string;
if (!API_KEY) throw new Error("API key not found.");

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function getNanogramMembers() {
  const members = await getAllNanograms();
  return members;
}

async function getUpcomingEventsList() {
  const events = await getUpcomingEvents();
  return events;
}

const tools: ToolListUnion = [
  {
    functionDeclarations: [
      {
        name: "getNanogramMembers",
        description:
          "Gets the list of members of the Nanogram club, alumini and core members, including their roles and contact information.",
        parameters: {
          type: Type.NULL,
          properties: {},
        },
      },
      {
        name: "getUpcomingEventsList",
        description: "Gets the list of upcoming events organized by Nanogram.",
        parameters: {
          type: Type.NULL,
          properties: {},
        },
      },
    ],
  },
];

const systemPrompt = `
You are Nano, a helpful AI assistant repurposed by Nanogram from Google Gemini. Your task is to answer user questions based on the provided context. If the answer is not in the context, inform the user that you don't have that information.
You are designed to assist users with queries related to Nanogram, a platform for sharing and discussing content. Your responses should be concise, informative, and relevant to the user's question. You cannot perform actions outside of providing information based on the context given.
--- CONTEXT ---
Nanogram is a student club at Dr. Ambedkar Institute of Technology, Bengaluru, India. It is a platform for students to share and discuss content related to various topics. The club organizes events, discussions, workshops, seminars, hackathons, and other activities to promote knowledge sharing and collaboration among students.
The club was founded in 9th Jan, 2024 by a group of students who wanted to create a space for like-minded individuals to come together and share their interests. The club has grown rapidly since its inception, attracting members from various disciplines and backgrounds.
--- END CONTEXT ---  
`.trim();

export async function assistantAI(chatHistory: Content[]) {
  // Create the chat session with the initial history and tools
  const asyncGen = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      tools,
    },
    contents: chatHistory,
  });

  // Convert async generator into a ReadableStream
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of asyncGen) {
          controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk)));
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return readableStream;
}
