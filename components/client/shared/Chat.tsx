"use client";
import React, { useEffect, useRef, useState } from "react";
import { Ellipsis, SendHorizonal, Trash2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { AggregatePost, Message, User } from "@/types";
import { formatDate } from "@/utils";
import { InboundMessage, Realtime } from "ably";
import {
  deleteMessage,
  getAblyToken,
  getMessages,
  getPostById,
  reactToMessage,
  removeReaction,
  sendMessage,
} from "@/app/actions/api";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./ui/Popover";
import ReportMedia from "./ReportMedia";
import Link from "next/link";
import { EmojiPickerPopover, ReactionSelector } from "./ui/EmojiSelector";
import { EmojiClickData } from "emoji-picker-react";
import { toast } from "sonner";

const MessageActions = ({
  currentUser,
  contactId,
  messageId,
  mode,
}: {
  currentUser: User;
  contactId: string;
  messageId: string;
  mode?: "delete" | "report";
}) => {
  const [loading, setLoading] = useState(false);
  async function handleDeleteMessage() {
    setLoading(true);
    try {
      const res = await deleteMessage({
        senderId: currentUser._id.toString(),
        recipientId: contactId,
        messageId,
      });
      if (!res) {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.log("Error deleting message:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Popover>
      <PopoverTrigger className="hidden group-hover:flex">
        <Ellipsis className="cursor-pointer" strokeWidth={1.5} />
      </PopoverTrigger>
      <PopoverAnchor />
      <PopoverContent
        side={mode === "delete" ? "left" : "right"}
        sideOffset={40}
        align="center"
        className="flex flex-col gap-2"
      >
        {mode === "delete" ? (
          <button
            className="btn btn-soft btn-error"
            disabled={loading}
            onClick={handleDeleteMessage}
          >
            <Trash2 strokeWidth={1.5} /> Delete
          </button>
        ) : (
          <ReportMedia
            currentUser={currentUser}
            media="Message"
            mediaId={messageId}
            userId={contactId}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

const Chat = ({
  currentUser,
  contact,
}: {
  currentUser: User;
  contact: User;
}) => {
  const channelName = `dm-${[currentUser._id, contact._id].sort().join("-")}`;
  const [ablyClient, setAblyClient] = useState<Realtime | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [posts, setPosts] = useState<AggregatePost | null>(null);

  useEffect(() => {
    const client = new Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const { tokenRequest } = await getAblyToken(
            currentUser._id.toString()
          );
          callback(null, tokenRequest);
        } catch (error) {
          callback((error as Error).message, null);
        }
      },
      clientId: currentUser._id.toString(),
    });

    setAblyClient(client);
    return () => client.close();
  }, [currentUser._id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const isSlash = e.key === "/";
      const isTypingInInput =
        (e.target instanceof HTMLInputElement && !e.target.readOnly) ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);

      if (isSlash && !isTypingInInput) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!ablyClient) return;

    const channel = ablyClient.channels.get(channelName);

    const onMessage = (message: InboundMessage) => {
      console.log("Received message:", message.name);
      if (message.name === "new-message") {
        setChatHistory((prev) => [...prev, message.data as Message]);
      }
      if (message.name === "delete-message") {
        const messageId = message.data as string;
        setChatHistory((prev) =>
          prev.filter((msg) => msg._id.toString() !== messageId)
        );
      }
      if (message.name === "update-message") {
        const updatedMessage = message.data as Message;
        console.log("updatedMessage: ", updatedMessage);
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg._id.toString() === updatedMessage._id.toString()
              ? updatedMessage
              : msg
          )
        );
      }
    };

    const onAttached = () => {
      console.log(`Subscribed to channel: ${channelName}`);
    };

    const onDetached = () => {
      console.log(`Unsubscribed from channel: ${channelName}`);
    };

    channel.subscribe(onMessage);
    channel.once("attached", onAttached);
    channel.once("detached", onDetached);

    return () => {
      channel.unsubscribe(onMessage);
      ablyClient.channels.release(channelName);
    };
  }, [ablyClient, channelName]);

  useEffect(() => {
    async function getMessagesFromDB() {
      const msgs = await getMessages({
        senderId: currentUser._id.toString(),
        receiverId: contact._id.toString(),
      });
      if (msgs) {
        // sort messages by createdAt
        msgs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setChatHistory(msgs);
      }
    }
    async function getPostsFromDB() {
      const post = await getPostById("6854013c6f72ffe2bbf839b2");
      if (post) {
        setPosts(post);
      }
    }
    getPostsFromDB();
    getMessagesFromDB();
  }, [contact]);

  async function handleSendMessage(content: string) {
    console.log(content);
    if (!content.trim()) return;
    const messageContent = content.trim();
    setMessage("");
    try {
      const res = await sendMessage({
        sender: {
          _id: currentUser._id,
          username: currentUser.username,
          fullName: currentUser.fullName,
          avatarUrl: currentUser.avatarUrl,
        },
        recipient: {
          _id: contact._id,
          username: contact.username,
          fullName: contact.fullName,
          avatarUrl: contact.avatarUrl,
        },
        content: { message: messageContent },
      });
      if (!res) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      return;
    }
  }

  function addEmojiToMessage(emojiObject: EmojiClickData) {
    setMessage((prev) => {
      const cursorPosition = inputRef.current?.selectionStart || 0;
      const newMessage =
        prev.slice(0, cursorPosition) +
        emojiObject.emoji +
        prev.slice(cursorPosition);
      return newMessage;
    });
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(
      (inputRef.current?.selectionStart || 0) + emojiObject.emoji.length,
      (inputRef.current?.selectionStart || 0) + emojiObject.emoji.length
    );
  }

  async function handleReactions(messageId: string, emojiData: EmojiClickData) {
    try {
      const res = await reactToMessage({
        messageId,
        emoji: emojiData.emoji,
        userId: currentUser._id.toString(),
      });
      if (!res) {
        throw new Error("Failed to add reaction");
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast.error("Failed to add reaction", {
        description: (error as Error).message || "An error occurred",
      });
    }
  }

  async function handleReactionsRemove(message: Message) {
    // If message has no reactions from current user, do nothing
    if (!message.reactions) return;
    const userReaction = message.reactions.find(
      (reaction) => reaction.userId.toString() === currentUser._id.toString()
    );
    if (!userReaction) return;
    try {
      const res = await removeReaction({
        messageId: message._id.toString(),
        userId: currentUser._id.toString(),
      });
      if (!res) {
        throw new Error("Failed to remove reaction");
      }
    } catch (error) {
      console.error("Error removing reaction:", error);
      toast.error("Failed to remove reaction", {
        description: (error as Error).message || "An error occurred",
      });
    }
  }

  if (!ablyClient) return null;

  return (
    <div className="flex flex-col w-full bg-base-100 h-dvh">
      <div className="flex h-12 items-center justify-between px-2 pt-2">
        <div className="flex gap-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src={contact.avatarUrl} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{contact.fullName}</h3>
            <p className="text-xs text-base-content/50">@{contact.username}</p>
          </div>
        </div>
      </div>
      <div className="divider my-0"></div>
      <div className="flex-1 overflow-y-auto p-2">
        {chatHistory.map((msg, idx) => (
          <div
            className={`chat group ${
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
                {formatDate(new Date(msg.createdAt).toISOString(), "HH:mm")}
              </time>
            </div>
            <div
              className={`flex ${
                msg.sender._id === currentUser._id
                  ? "flex-row-reverse"
                  : "flex-row"
              }`}
            >
              <div className="relative">
                {typeof msg.message !== "string" ? (
                  <div className="card bg-base-200 md:w-72 w-[60vw] shadow-sm">
                    <div className="card-body">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <div className="avatar">
                            <div className="w-5 rounded-full">
                              <img
                                src={
                                  msg.message.creator.avatarUrl ||
                                  "/assets/images/placeholder.png"
                                }
                                alt="User Avatar"
                              />
                            </div>
                          </div>

                          <div className="text-start">
                            <h2 className="card-title text-sm">
                              {msg.message.creator.fullName}
                            </h2>
                            <p className="text-xs">
                              @{msg.message.creator.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link href={`/posts/${msg.message._id.toString()}`}>
                      {msg.message.imageUrl ? (
                        <figure>
                          <img
                            src={
                              msg.message.imageUrl ||
                              "/assets/images/placeholder.png"
                            }
                            alt={msg.message._id.toString()}
                          />
                        </figure>
                      ) : (
                        <div className="px-4 pb-4">
                          <p className="">
                            {msg.message.caption || "No caption provided."}
                          </p>
                        </div>
                      )}
                    </Link>
                  </div>
                ) : (
                  <div
                    className={`chat-bubble min-w-28 md:max-w-md max-w-[18rem] ${
                      msg.sender._id === currentUser._id
                        ? "chat-bubble-primary"
                        : "chat-bubble-info"
                    }`}
                  >
                    {msg.message as string}
                  </div>
                )}
                {Array.isArray(msg.reactions) && msg.reactions.length > 0 && (
                  <span
                    className={`absolute z-1 -bottom-4 cursor-pointer flex badge badge-ghost mx-5 px-0.5 ${
                      msg.sender._id === currentUser._id
                        ? "-left-8"
                        : "-right-8"
                    }`}
                    onClick={() => handleReactionsRemove(msg)}
                  >
                    {msg.reactions.map((reaction) => {
                      return reaction.emoji;
                    })}
                  </span>
                )}
              </div>
              <div
                className={`flex gap-2 items-center mx-2 ${
                  msg.sender._id === currentUser._id
                    ? "flex-row"
                    : "flex-row-reverse"
                }`}
              >
                <MessageActions
                  currentUser={currentUser}
                  contactId={contact._id.toString()}
                  messageId={msg._id.toString()}
                  mode={
                    msg.sender._id === currentUser._id ? "delete" : "report"
                  }
                />
                <ReactionSelector
                  onSelectEmoji={(emojiData) => {
                    handleReactions(msg._id.toString(), emojiData);
                  }}
                />
              </div>
            </div>
            {idx === chatHistory.length - 1 && (
              <div className="chat-footer opacity-50">
                {msg.seen
                  ? `Seen on ${formatDate(
                      new Date(msg.updatedAt).toISOString(),
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
        className="bg-base-200 flex gap-2 items-end w-full focus:outline-none focus-within:outline-none px-2 py-3"
      >
        <EmojiPickerPopover onSelectEmoji={addEmojiToMessage} />
        <TextareaAutosize
          className="grow resize-none text-base overflow-auto focus:outline-none"
          maxRows={5}
          minRows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(message);
            }
          }}
          ref={inputRef}
        />
        <button
          className="w-fit h-fit"
          onClick={(e) => {
            e.preventDefault();
            handleSendMessage(message);
          }}
        >
          <SendHorizonal strokeWidth={1.5} />
        </button>
      </label>
    </div>
  );
};

export default Chat;
