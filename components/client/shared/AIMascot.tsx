"use client";
import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { BotIcon, Send, User } from "lucide-react";
import { Content } from "@google/genai";
import { askNano } from "@/app/actions/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIMascot = () => {
  const [messages, setMessages] = useState<Content[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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

    // Optimistically update with user's message
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await askNano({
        chatHistory: [...messages, userMessage], // Send updated history to backend
        query: userInput,
      });

      const assistantMessage: Content = {
        role: "model",
        parts: [{ text: res }],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error from askNano:", err);
    }

    setLoading(false);
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
            <p className="text-xs text-base-content/50">I can assist you with any queries related to Nanogram.</p>
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
                      ? "flex flex-row-reverse items-center gap-1"
                      : "flex items-center gap-1"
                  }
                >
                  {msg.role !== "user" ? (
                    <BotIcon strokeWidth={1.5} />
                  ) : (
                    <User strokeWidth={1.5} />
                  )}
                  <div
                    className={`inline-block overflow-auto px-4 py-2 rounded-lg max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p>
                        {msg.parts?.map((part) => part.text).join("") ?? ""}
                      </p>
                    ) : (
                      <div className="markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.parts?.map((part) => part.text).join("") ?? ""}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 items-center">
                <span className="loading loading-infinity loading-xs text-base-content/50"></span>
                Thinking...
              </div>
            )}
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
