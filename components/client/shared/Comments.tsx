"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  MessageCircle,
  SendHorizonal,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/Drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
import PostCreator from "./PostCreator";
import { Like, Liked } from "@/components/server/shared/ui/icons";
import { AggregateComment, AggregatePost, User } from "@/types";
import { useUser } from "@clerk/nextjs";
import {
  createComment,
  deleteCommentById,
  getCommentsByPostId,
  getCurrentUser,
  likeComment,
} from "@/app/actions/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ObjectId } from "mongodb";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(300, "Comment cannot exceed 300 characters"),
});

type CommentData = z.infer<typeof commentSchema>;

export function CommentInput({
  post,
  callback,
}: {
  post: AggregatePost;
  callback: (newComment: AggregateComment) => void;
}) {
  const { isLoaded, user } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isLoaded && user) {
        const cUser = await getCurrentUser({ user_id: user.id });
        if (cUser) {
          setCurrentUser(cUser);
        } else {
          console.error("Current user not found");
        }
      }
    };
    fetchCurrentUser();
  }, [isLoaded, user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit(onSubmit);
  };

  const onSubmit = async (data: CommentData) => {
    if (!user) {
      toast.error("You must be logged in to comment.");
      return;
    }
    try {
      const res = await createComment({
        postId: post._id.toString(),
        content: data.content,
        commenter: currentUser?._id.toString() || "",
      });
      if (res) {
        reset();
        const newComment: AggregateComment = {
          _id: res as ObjectId,
          postId: post._id,
          commenter: currentUser as User,
          content: data.content,
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        callback(newComment);
        toast.success("Comment added successfully!");
      } else {
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-full skeleton" />
        <div className="text-xs">
          <p className="skeleton w-20 h-4" />
          <p className="skeleton w-40 h-4" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="comment input" className="input w-full">
        <img src={user.imageUrl} alt="user" className="w-6 h-6 rounded-full" />
        <input
          type="text"
          className="w-full"
          placeholder="Write a comment..."
          autoComplete="off"
          onKeyDown={handleKeyDown}
          {...register("content")}
        />
        <button type="submit">
          <SendHorizonal strokeWidth={1.5} />
        </button>
      </label>
      {errors.content && (
        <p className="text-sm mt-1 text-warning">{errors.content.message}</p>
      )}
    </form>
  );
}

export function CommentItem({
  comment,
  callback,
}: {
  comment: AggregateComment;
  callback: (commentId: ObjectId) => void;
}) {
  const { isLoaded, user } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(comment.likes.length);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isLoaded && user) {
        const cUser = await getCurrentUser({ user_id: user.id });
        if (cUser) {
          setCurrentUser(cUser);
          // Check if the current user has liked this comment
          setLiked(comment.likes.includes(cUser._id));
        } else {
          console.error("Current user not found");
        }
      }
    };
    fetchCurrentUser();
  }, [isLoaded, user]);

  const toggleLike = async () => {
    // Optimistically update the UI
    setLiked(!liked);
    setLikedCount(liked ? likedCount - 1 : likedCount + 1);
    try {
      // Call the API to toggle like
      const res = await likeComment({
        postId: comment.postId.toString(),
        commentId: comment._id.toString(),
        userId: currentUser?._id.toString() || "",
      });
      if (!res) {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert the optimistic update if the API call fails
      setLiked(!liked);
      setLikedCount(liked ? likedCount + 1 : likedCount - 1);
      toast.error("Failed to perforn this action on comment.");
    }
  };

  const deleteComment = async () => {
    try {
      const res = await deleteCommentById(comment._id.toString());
      if (res) {
        console.log("Comment deleted successfully:", comment._id);
        callback(comment._id);
        toast.success(
          "Comment deleted successfully. Changes will reflect in the post shortly."
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment.");
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-full skeleton" />
        <div className="text-xs">
          <p className="skeleton w-20 h-4 mb-0.5" />
          <p className="skeleton w-40 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <div className="h-full flex items-start justify-center">
          <PostCreator creator={comment.commenter} onlyImage={true} />
        </div>
        <div className="text-xs">
          <p className="font-semibold">@{comment.commenter.username}</p>
          <p className="font-thin">{comment.content}</p>
        </div>
      </div>
      <div className="flex h-full items-start gap-2">
        {comment.commenter.userId !== user.id && (
          <button
            onClick={() => {
              // Handle report logic here
              console.log("Comment reported:", comment._id);
            }}
          >
            <TriangleAlert
              strokeWidth={1.5}
              width={12}
              className="text-error"
            />
          </button>
        )}
        {user.id === comment.commenter.userId && (
          <AlertDialog>
            <AlertDialogTrigger className="flex h-full items-start text-error">
              <Trash2 strokeWidth={1.5} width={12} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want to delete
                  this comment?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="btn btn-error"
                  onClick={deleteComment}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex items-center mt-1 gap-1">
          <div
            className="text-base-content flex w-3 h-3"
            onClick={() => toggleLike()}
          >
            {liked ? <Liked /> : <Like />}
          </div>
          <p className="text-xs">{likedCount}</p>
        </div>
      </div>
    </div>
  );
}

const Comments = ({ post }: { post: AggregatePost }) => {
  const [comments, setComments] = useState<AggregateComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // This hook must be called outside useEffect
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const handleCallback = (newComment: AggregateComment) => {
    console.log("callbakc called");
    setComments((prevComments) => [newComment, ...prevComments]);
    console.log("New comment added:", newComment);
    console.log("Updated comments:", comments);
  };

  const handleDeleteCallback = (commentId: ObjectId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const resComments = await getCommentsByPostId({
          postId: post._id.toString(),
        });
        if (resComments) {
          setComments(resComments);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [post._id]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 text-base-content">
        <MessageCircle strokeWidth={1.5} size={20} />
        <p className="mt-0.5 text-xs">{post.comments.length}</p>
      </div>
    );
  }

  // Now that mounted is true, and we know device type:
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger className="text-base-content flex h-5 gap-1">
          <MessageCircle strokeWidth={1.5} size={20} />
          <p className="mt-0.5 text-xs">{post.comments.length}</p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="h-[65dvh] flex flex-col gap-2 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full skeleton" />
                <div className="text-xs">
                  <p className="skeleton w-20 h-4 mb-0.5" />
                  <p className="skeleton w-40 h-4" />
                </div>
              </div>
            ) : (
              comments.length === 0 && (
                <p className="text-base-content/50 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              )
            )}
            {comments.map((comment) => (
              <CommentItem
                key={comment._id.toString()}
                comment={comment}
                callback={handleDeleteCallback}
              />
            ))}
          </div>
          <CommentInput post={post} callback={handleCallback} />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer>
        <DrawerTrigger className="text-base-content flex h-5 gap-1">
          <MessageCircle strokeWidth={1.5} size={20} />
          <p className="mt-0.5 text-xs">{post.comments.length}</p>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4 overflow-y-auto">
            {comments.length === 0 && (
              <p className="text-base-content/50 text-sm">
                No comments yet. Be the first to comment!
              </p>
            )}
            {comments.map((comment) => (
              <CommentItem
                key={comment._id.toString()}
                comment={comment}
                callback={handleDeleteCallback}
              />
            ))}
          </div>
          <CommentInput post={post} callback={handleCallback} />
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    );
  }
};

export default Comments;
