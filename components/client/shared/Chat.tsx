"use client";
import React, { useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { Message } from "@/types";
import { avatars } from "@/constants";
import { formatDate } from "@/utils";

const chatHistory: Message[] = [
  {
    _id: "64f8c1e2f1d2b3c4d5e6f7g8",
    sender: {
      _id: "64f8c1e2f1d2b3c4d5e6f7g9",
      fullName: "Sender",
      username: "sender_username",
      avatarUrl: avatars[0],
    },
    receiver: {
      _id: "64f8c1e2f1d2b3c4d5e6f7g0",
      fullName: "Receiver",
      username: "receiver_username",
      avatarUrl: avatars[1],
    },
    message: "You were the Chosen One!",
    reactions: [
      {
        emoji: "😢",
        userId: "64f8c1e2f1d2b3c4d5e6f7g9",
      },
      {
        emoji: "❤️",
        userId: "64f8c1e2f1d2b3c4d5e6f7g0",
      },
    ],
    seen: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "64f8c1e2f1d2b3c4d5e6f7g1",
    sender: {
      _id: "64f8c1e2f1d2b3c4d5e6f7g0",
      fullName: "Receiver",
      username: "receiver_username",
      avatarUrl: avatars[1],
    },
    receiver: {
      _id: "64f8c1e2f1d2b3c4d5e6f7g9",
      fullName: "Sender",
      username: "sender_username",
      avatarUrl: avatars[0],
    },
    message: "I hate you!",
    reactions: [
      {
        emoji: "😡",
        userId: "64f8c1e2f1d2b3c4d5e6f7g0",
      },
      {
        emoji: "😢",
        userId: "64f8c1e2f1d2b3c4d5e6f7g9",
      },
    ],
    seen: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Chat = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = {
    _id: "64f8c1e2f1d2b3c4d5e6f7g0",
    fullName: "Sender",
    username: "sender_username",
    avatarUrl: avatars[0],
  };

  useEffect(() => {
    interface KeyboardEventWithKey extends KeyboardEvent {
      key: string;
    }

    const handleKeyDown = (e: KeyboardEventWithKey): void => {
      const isShortcut: boolean = e.key === "/";

      if (isShortcut) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col w-full bg-base-200 h-dvh">
      <div className="flex h-12 items-center justify-between px-2 pt-2">
        <div className="flex gap-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src={avatars[0]} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Full Name</h3>
            <p className="text-xs text-base-content/50">@username</p>
          </div>
        </div>
      </div>
      <div className="divider my-0"></div>
      <div className="h-full flex flex-col justify-between gap-2 p-2">
        <div className="overflow-y-auto">
          {chatHistory.map((msg, idx) => (
            <div
              className={`chat ${
                msg.sender._id === currentUser._id ? "chat-end" : "chat-start"
              }`}
              key={idx}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="chat" src={msg.sender.avatarUrl} />
                </div>
              </div>
              <div className="chat-header">
                {msg.sender.fullName}
                <time className="text-xs opacity-50">
                  {formatDate(msg.createdAt.toISOString(), "HH:mm")}
                </time>
              </div>
              <div className="indicator">
                <span
                  className={`indicator-item indicator-bottom cursor-pointer flex badge mx-5 px-0.5 ${
                    msg.sender._id === currentUser._id
                      ? "indicator-start"
                      : "indicator-end"
                  }`}
                >
                  {msg.reactions?.map((reaction) => {
                    return reaction.emoji;
                  })}
                </span>
                <div
                  className={`chat-bubble min-w-28 max-w-sm ${
                    msg.sender._id === currentUser._id
                      ? "chat-bubble-primary"
                      : "chat-bubble-info"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
              {idx === chatHistory.length - 1 && (
                <div className="chat-footer opacity-50">
                  {msg.seen
                    ? `Seen on ${formatDate(
                        msg.updatedAt.toISOString(),
                        "HH:mm"
                      )}`
                    : "Delivered"}
                </div>
              )}
            </div>
          ))}
        </div>
        <label
          htmlFor="send message"
          className="input w-full focus:outline-none focus-within:outline-none"
        >
          <input type="text" className="grow" ref={inputRef} />
          <SendHorizonal strokeWidth={1.5} />
        </label>
      </div>
    </div>
  );
};

export default Chat;
