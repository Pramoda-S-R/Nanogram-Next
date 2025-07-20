"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Check, Link, ShareIcon } from "lucide-react";
import { AggregatePost, Messager, Post, SharedPost, User } from "@/types";
import { getUserByUsername, sendMessage } from "@/app/actions/api";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const Share = ({
  currentUser,
  post,
}: {
  currentUser: User;
  post: AggregatePost;
}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getContacts() {
      const contacts = await getUserByUsername({ username: "shiny1um" });
      if (contacts) {
        setUsers([contacts]);
      }
    }
    getContacts();
  }, []);

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // reset after 3s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  async function handleShare(receiver: User) {
    setLoading(true);
    try {
      const sender: Messager = {
        _id: currentUser._id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        avatarUrl: currentUser.avatarUrl,
      };
      const recipient: Messager = {
        _id: receiver._id,
        username: receiver.username,
        fullName: receiver.fullName,
        avatarUrl: receiver.avatarUrl,
      };
      const message: SharedPost = {
        _id: post._id,
        creator: {
          _id: post.creator._id,
          username: post.creator.username,
          fullName: post.creator.fullName,
          avatarUrl: post.creator.avatarUrl,
        },
        caption: post.caption,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
        source: post.source,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
      const res = await sendMessage({
        sender,
        recipient,
        content: { message },
      });
      if (!res) {
        throw new Error("Failed to share post");
      }
      toast.success("Post shared successfully!", {
        description: `You shared ${post.creator.firstName}'s post with ${receiver.fullName}.`,
      });
    } catch (error) {
      console.error("Error sharing post:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <ShareIcon strokeWidth={1.5} size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Share {post.creator.firstName}'s post with your friends and on other
            platforms!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn btn-circle"
            onClick={() =>
              handleCopy(`${BASE_URL}/posts/${post._id.toString()}`)
            }
          >
            {copied ? <Check strokeWidth={1.5} /> : <Link strokeWidth={1.5} />}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {users.map((user) => (
            <button
              key={user._id.toString()}
              className="rounded-full overflow-clip"
              onClick={() => handleShare(user)}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="size-10"
                />
              )}
            </button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose className="btn btn-error">Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
