"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hash } from "lucide-react";
import FileUploader from "./ui/FileUploader";
import { Post } from "@/types";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/api";
import { useUser } from "@clerk/nextjs";

const PostFormSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(3000, "Caption must be less than 3000 characters"),
  tags: z
    .string()
    .array()
    .max(10, "A Maximum of 10 tags are allowed")
    .optional(),
  file: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "A valid image file is required",
    })
    .optional(),
});

type PostFormData = z.infer<typeof PostFormSchema>;

const PostForm = ({
  post,
  action,
}: {
  post?: Post;
  action: "Create" | "Update";
}) => {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  // Form State
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      tags: post ? post?.tags : [],
      file: undefined,
    },
  });

  const caption = watch("caption");

  if (!isLoaded) {
    return (
      <div className="flex w-full items-center justify-center h-64">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>You need to be logged in to create or update a post.</span>
        </div>
      </div>
    );
  }

  // Form Submission
  const onSubmit = async (data: PostFormData) => {
    if (post && action === "Update") {
      try {
        setIsLoadingUpdate(true);
        const updatedPost = await updatePost({
          ...data,
          postId: post._id.toString(),
        });

        if (!updatedPost) {
          throw new Error("Failed to update post");
        }
        toast("Update Successful!", {
          description: "Your post has been updated successfully. 🎉",
        });
        return router.push(`/posts/${post._id}`);
      } catch (error) {
        console.error("Error updating post:", error);
        toast("Update Failed!", {
          description: `There was an error in updating your post. Please try again.\nerror: ${error}`,
        });
        setIsLoadingUpdate(false);
        return;
      } finally {
        setIsLoadingUpdate(false);
      }
    }
    try {
      setIsLoadingCreate(true);
      const newPost = await createPost({
        ...data,
        userId: user.id,
      });
      console.log("New Post Created:", { ...data, userId: user.id });

      if (!newPost) {
        throw new Error("Failed to create post");
      } else {
        toast("Upload Successful!", {
          description: "Your post has been uploaded successfully. 🎉",
        });
        setIsLoadingCreate(false);
        router.push("/community");
      }
    } catch (error) {
      toast("Upload Failed!", {
        description: `There was an error in Uploading your post. Please try again. \nerror: ${error}`,
      });
      setIsLoadingCreate(false);
      return;
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-full px-3 pb-10"
      >
        {/* Caption Field */}
        <fieldset className="fieldset px-3 relative">
          <legend className="fieldset-legend">Caption <span className="text-error">*</span></legend>
          <textarea
            placeholder="Write a caption..."
            maxLength={3000}
            rows={4}
            className="mt-2 textarea textarea-ghost w-full"
            {...register("caption")}
          />
          <p className="text-xs font-thin absolute bottom-1 right-5">
            {caption.length}/3000
          </p>
          {errors.caption && (
            <p className="text-error text-sm mt-1">{errors.caption.message}</p>
          )}
        </fieldset>

        {/* Add Photos */}
        <fieldset className="px-3 fieldset">
          <legend className="fieldset-legend">Add Photo (optional)</legend>
          <label className="flex items-center justify-center">
            <FileUploader
              onFileChange={(file) => setValue("file", file)}
              initialFileUrl={post?.imageUrl}
              acceptedFileTypes={{ "image/*": [".jpg", ".jpeg", ".png"] }}
              enableImageCropping={true}
              cropAspectRatio={1}
            />
          </label>
          {typeof errors.file?.message === "string" && (
            <p className="text-sm mt-1 text-warning">{errors.file.message}</p>
          )}
        </fieldset>

        {/* Add Tags */}
        {/* Add Tags */}
        <fieldset className="px-3 fieldset">
          <legend className="fieldset-legend">Tags (optional)</legend>
          <div className="flex flex-wrap gap-2 items-center">
            {watch("tags")?.map((tag, index) => (
              <div
                key={index}
                className="badge badge-outline badge-info flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    const newTags =
                      watch("tags")?.filter((_, i) => i !== index) || [];
                    setValue("tags", newTags, { shouldValidate: true });
                  }}
                  className="ml-1 text-xs text-error"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Type and press Enter to add a tag"
            className="input input-sm input-ghost mt-2 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                const existingTags = watch("tags") || [];
                if (value && !existingTags.includes(value)) {
                  const newTags = [...existingTags, value];
                  if (newTags.length <= 10) {
                    setValue("tags", newTags, { shouldValidate: true });
                    e.currentTarget.value = "";
                  } else {
                    toast("Maximum of 10 tags allowed.");
                  }
                }
              }
            }}
          />

          {errors.tags && (
            <p className="text-warning text-sm mt-1">{errors.tags.message}</p>
          )}
        </fieldset>

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 items-center justify-end mb-14 md:mb-0">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => router.back()}
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoadingCreate || isLoadingUpdate}
            className="btn btn-primary"
          >
            {isLoadingCreate || (isLoadingUpdate && "Validating...  ")} {action}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
