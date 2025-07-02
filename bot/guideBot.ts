import { getAllNanograms, getUpcomingEvents } from "@/app/actions/api";
import { Content, GoogleGenAI, ToolListUnion, Type } from "@google/genai";

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

const toolFunctions = {
  getNanogramMembers,
  getUpcomingEventsList,
};

const tools: ToolListUnion = [
  {
    functionDeclarations: [
      {
        name: "getNanogramMembers",
        description: "Gets the list of members of the Nanogram club, alumini and core members, including their roles and contact information.",
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

export async function assistantAI({
  chatHistory,
  query,
}: {
  chatHistory: Content[];
  query: string;
}) {
  const systemPrompt = `You are Nano, a helpful AI assistant repurposed by Nanogram from Google Gemini. Your task is to answer user questions based on the provided context. If the answer is not in the context, inform the user that you don't have that information.
  You are designed to assist users with queries related to Nanogram, a platform for sharing and discussing content. Your responses should be concise, informative, and relevant to the user's question. You cannot perform actions outside of providing information based on the context given.
  --- CONTEXT ---
  Nanogram is a student club at Dr. Ambedkar Institute of Technology, Bengaluru, India. It is a platform for students to share and discuss content related to various topics. The club organizes events, discussions, workshops, seminars, hackathons, and other activities to promote knowledge sharing and collaboration among students.
  The club was founded in 9th Jan, 2024 by a group of students who wanted to create a space for like-minded individuals to come together and share their interests. The club has grown rapidly since its inception, attracting members from various disciplines and backgrounds.
  --- END CONTEXT ---  
  `;

  // Initialize contents with the chat history
  let contents: Content[] = [...chatHistory];

  // Create the chat session with the initial history and tools
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      tools,
    },
    history: contents,
  });

  // Send the initial user query
  let result = await chat.sendMessage({ message: query });

  // Loop to handle potential tool calls and subsequent responses
  // This loop continues as long as the model's response contains function calls
  while (result.functionCalls && result.functionCalls.length > 0) {
    const functionCall = result.functionCalls[0];

    const { name, args } = functionCall;

    // Check if the called function exists in our toolFunctions map
    if (!toolFunctions[name as keyof typeof toolFunctions]) {
      throw new Error(`Unknown function call: ${name}`);
    }

    // Execute the tool function and AWAIT its result, as it's an async function
    const toolResponse = await toolFunctions[
      name as keyof typeof toolFunctions
    ]();

    // Construct the function response part to send back to the model
    const functionResponsePart = {
      name: functionCall.name,
      response: {
        result: toolResponse,
      },
    };

    // Construct the Content object for the function response.
    // This is crucial: it needs to be a Content object with role "function"
    // and then passed within the 'contents' array to sendMessage.
    const functionResponseContent: Content = {
      role: "function", // Use "function" role for tool responses
      parts: [
        {
          functionResponse: functionResponsePart,
        },
      ],
    };

    // Send the function response back to the model as a new turn in the conversation.
    // The `sendMessage` method automatically appends this to the chat history
    // and then prompts the model to generate its next response based on the updated history.
    // Correctly pass the 'parts' array as the 'message' property.
    result = await chat.sendMessage({
      message: functionResponseContent.parts ?? [], // Ensure parts is always defined
    });
  }

  // Once the loop exits, it means the model has provided a final text response (no more function calls).
  // Return this text.
  return result.text;
}
