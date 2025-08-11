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
import { AggregatePost, Messager, SharedPost } from "@/types";
import { User } from "@/types/mongodb";
import { getUserByUsername, sendMessage } from "@/app/actions/api";
import { toast } from "sonner";
import {
  Facebook,
  Linkedin,
  Mail,
  Telegram,
  Twitter,
  Whatsapp,
} from "@/components/server/shared/ui/icons/brands";
import SearchUsers from "./SearchUsers";

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
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const socials = [
    {
      name: "WhatsApp",
      icon: <Whatsapp strokeWidth={1.5} />,
      url: `https://wa.me/?text=Check%20this%20post%20out:%20${BASE_URL}/posts/${post._id.toString()}`,
    },
    {
      name: "Facebook",
      icon: <Facebook strokeWidth={1.5} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${BASE_URL}/posts/${post._id.toString()}`,
    },
    {
      name: "Twitter",
      icon: <Twitter strokeWidth={1.5} />,
      url: `https://twitter.com/intent/tweet?text=Check%20this%20post%20out:%20&url=${BASE_URL}/posts/${post._id.toString()}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin strokeWidth={1.5} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${BASE_URL}/posts/${post._id.toString()}`,
    },
    {
      name: "Telegram",
      icon: <Telegram strokeWidth={1.5} />,
      url: `https://t.me/share/url?url=${BASE_URL}/posts/${post._id.toString()}&text=Check%20this%20post%20out!`,
    },
    {
      name: "Email",
      icon: <Mail strokeWidth={1.5} />,
      url: `mailto:?subject=Check%20out%20this%20post&body=${BASE_URL}/posts/${post._id.toString()}`,
    },
  ];

  useEffect(() => {
    if (open && !loaded) {
      async function getContacts() {
        try {
          const contacts = await getUserByUsername({ username: "shiny1um" });
          if (contacts) {
            setUsers([contacts]);
            setLoaded(true);
          }
        } catch (error) {
          console.error("Failed to load contacts:", error);
        }
      }

      getContacts();
    }
  }, [open, loaded]);

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
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-circle"
            >
              {social.icon}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {users.map((user) => (
              <button
                key={user._id.toString()}
                className="rounded-full overflow-clip tooltip tooltip-bottom"
                onClick={() => handleShare(user)}
                disabled={loading}
                data-tip={`@${user.username}`}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="size-10"
                />
              </button>
            ))}
          </div>
          <SearchUsers
            currentuser={currentUser}
            showTitle={false}
            variant="small"
            onClickCallback={handleShare}
          />
        </div>
        <DialogFooter>
          <DialogClose className="btn btn-error">
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Cancel"
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
