"use client";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/Drawer";
import { MessageCircle } from "lucide-react";
import { AggregatePost, Comment } from "@/types";
import { getCommentsByPostId } from "@/app/actions/api";

const Comments = ({ post }: { post: AggregatePost }) => {
  //   const comments = await getCommentsByPostId({ postId: post._id.toString() });
  const comments: Comment[] = [];
  return (
    <Drawer>
      <DrawerTrigger className="text-base-content flex h-5 gap-1">
        <MessageCircle strokeWidth={1.5} size={20} />{" "}
        <p className="mt-0.5 text-xs">{post.comments.length}</p>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Comments</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4">
          {comments.map((comment) => (
            <div key={comment._id.toString()} className="p-2 border rounded-md">
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Comments;
