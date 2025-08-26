"use client";
import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { BotIcon, Send, User } from "lucide-react";
import {
  Content,
  FunctionCall,
  FunctionResponse,
  GenerateContentResponse,
} from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { assistantAI } from "@/bot/guideBot";
import { flushSync } from "react-dom";
import { create } from "zustand";
import { getAllNanograms, getUpcomingEvents } from "@/app/actions/api";

type ChatState = {
  messages: Content[];
  addMessage: (msg: Content) => void;
  updateMessage: (index: number, updated: Content) => void;
  replaceMessages: (msgs: Content[]) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateMessage: (index, updated) =>
    set((state) => {
      const messages = [...state.messages];
      messages[index] = updated;
      return { messages };
    }),
  replaceMessages: (msgs) => set({ messages: msgs }),
  clearMessages: () => set({ messages: [] }),
}));

type ToolState = {
  tools: FunctionCall[];
  addTool: (tool: FunctionCall) => void;
  updateTool: (index: number, updated: FunctionCall) => void;
  replaceTools: (tools: FunctionCall[]) => void;
  clearTools: () => void;
};

export const useToolStore = create<ToolState>((set) => ({
  tools: [],
  addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
  updateTool: (index, updated) =>
    set((state) => {
      const tools = [...state.tools];
      tools[index] = updated;
      return { tools };
    }),
  replaceTools: (tools) => set({ tools }),
  clearTools: () => set({ tools: [] }),
}));

const AIMascot = () => {
  const { messages, addMessage, updateMessage } = useChatStore();
  const { addTool } = useToolStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput("");
    setLoading(true);

    const userMessage: Content = {
      role: "user",
      parts: [{ text: userInput }],
    };
    const modelMessage: Content = {
      role: "model",
      parts: [],
    };

    // Add user message and empty model message placeholder
    addMessage(userMessage);
    addMessage(modelMessage);
    const modelIndex = useChatStore.getState().messages.length - 1; // Current index for the model response + 1

    async function handleUIUpdate(stream: ReadableStream<Uint8Array>) {
      const decoder = new TextDecoder();
      const reader = stream.getReader();
      let buffer = "";
      let finishReason: string = "stop";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk: GenerateContentResponse = JSON.parse(
          decoder.decode(value, { stream: true })
        );

        console.log("chunk: ", chunk);
        if (chunk?.candidates?.[0]?.content?.parts) {
          for (const part of chunk?.candidates?.[0]?.content?.parts) {
            if (part.functionCall) {
              finishReason = "function_call";
              console.log("part.functionCall: ", part.functionCall);
              addTool(part.functionCall);
            }
            if (typeof part.text === "string") {
              buffer += part.text;
              flushSync(() => {
                updateMessage(modelIndex, {
                  role: "model",
                  parts: [{ text: buffer }],
                });
                scrollToBottom();
              });
            }
          }
        }
      }
      return finishReason;
    }

    async function RecursiveStreaming(chatHistory: Content[]) {
      const stream = await assistantAI(chatHistory);
      const finishReason = await handleUIUpdate(stream);
      if (finishReason === "function_call") {
        setSearching(true);
        const fnResParts: FunctionResponse[] = [];
        for (const toolCall of useToolStore.getState().tools) {
          if (toolCall.name === "getNanogramMembers") {
            const members = await getAllNanograms();
            const fnResPart = {
              name: toolCall.name,
              response: { members },
            };
            fnResParts.push(fnResPart);
          }
          if (toolCall.name === "getUpcomingEventsList") {
            const events = await getUpcomingEvents();
            fnResParts.push({
              name: toolCall.name,
              response: { events },
            });
          }
        }
        const toolMessage: Content = {
          role: "user",
          parts: fnResParts.map((part) => ({
            functionResponse: part,
          })),
        };
        RecursiveStreaming([...useChatStore.getState().messages, toolMessage]);
      }
      setLoading(false);
      setSearching(false);
    }

    try {
      // Start the recursive streaming process with current messages removing the last user message
      await RecursiveStreaming(useChatStore.getState().messages.slice(0, -1));
    } catch (err) {
      console.error("Error from askNano:", err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Popover>
      <PopoverTrigger
        className="fixed right-10 bottom-10 btn btn-info btn-circle tooltip tooltip-top"
        data-tip="Ask Nano"
      >
        <BotIcon />
      </PopoverTrigger>
      <PopoverContent className="border-0 mr-10 bg-base-200">
        <div className="md:w-[30vw] w-[60vw]">
          <div className="w-full flex flex-col justify-center text-center mb-4">
            <h3 className="flex justify-center gap-3">
              <BotIcon strokeWidth={1.5} />
              Hello! I am Nano
            </h3>
            <p className="text-xs text-base-content/50">
              I can assist you with any queries related to Nanogram.
            </p>
          </div>
          <div className="bg-base-200 flex flex-col gap-2 rounded-md p-4 h-[60vh] overflow-y-auto mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "flex flex-row-reverse items-end gap-1"
                      : "flex items-end gap-1"
                  }
                >
                  {msg.role !== "user" ? (
                    <BotIcon strokeWidth={1.5} className="mb-2" />
                  ) : (
                    <User strokeWidth={1.5} className="mb-2" />
                  )}
                  <div
                    className={`inline-block overflow-auto px-4 py-2 rounded-lg max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content markdown"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p>
                        {msg.parts?.map((part) => part.text).join("") ?? ""}
                      </p>
                    ) : (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.parts?.map((part) => part.text).join("") ?? ""}
                        </ReactMarkdown>
                        {searching && messages.length - 1 === idx && (
                          <span className="text-sx text-base-content/50">
                            Searching {"  "}
                          </span>
                        )}
                        {loading && messages.length - 1 === idx && (
                          <span className="loading loading-dots loading-xs text-base-content/50"></span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="AI chat input"
              className="w-full input focus-within:outline-none focus:outline-none"
            >
              <input
                type="text"
                id="AI chat input"
                placeholder="Ask me anything..."
                className="grow"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                <Send />
              </button>
            </label>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIMascot;
