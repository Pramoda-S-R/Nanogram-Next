"use client";

import { Content } from "@google/genai";
import { useState, useRef } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<Content[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userInput = input.trim();
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "imnotadummy",
      },
      body: JSON.stringify({
        chatHistory: messages,
        query: userInput,
      }),
    });

    const userMessage: Content = {
      role: "user",
      parts: [{ text: userInput }],
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!res.body) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: No response body" },
      ]);
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      assistantMessage += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (
          last?.role === "model" &&
          Array.isArray(last.parts) &&
          last.parts.length > 0
        ) {
          last.parts[0].text = assistantMessage;
          updated[updated.length - 1] = last;
        } else {
          updated.push({
            role: "model",
            parts: [{ text: assistantMessage }],
          });
        }

        return updated;
      });

      // Auto-scroll
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>

      <div
        className="bg-base-200 rounded-md p-4 h-[60vh] overflow-y-auto mb-4"
        ref={chatContainerRef}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-md ${
                msg.role === "user" ? "bg-primary" : "bg-base-300"
              }`}
            >
              {msg.parts?.map((part) => {
                return part.text;
              })}
            </span>
          </div>
        ))}
        {loading && (
          <span className="loading loading-ball loading-xs text-base-content/50"></span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
          placeholder="Ask something..."
        />
        <button type="submit" className="btn btn-success" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
