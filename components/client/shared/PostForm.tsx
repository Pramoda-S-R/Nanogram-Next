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
  tags: z.string().array().optional(),
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      tags: post ? post?.tags : [],
      file: [],
    },
  });

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
      setIsLoadingUpdate(true);
      const updatedPost = await updatePost({
        ...data,
        postId: post._id.toString(),
      });

      if (!updatedPost) {
        toast("Upload Failed!", {
          description:
            "There was an error in updating your post. Please try again.",
        });
      }
      toast("Update Successful!", {
        description: "Your post has been updated successfully. 🎉",
      });
      setIsLoadingUpdate(false);
      return router.push(`/posts/${post._id}`);
    }
    setIsLoadingCreate(true);
    const newPost = await createPost({
      ...data,
      userId: user.id,
    });

    if (!newPost) {
      toast("Upload Failed!", {
        description:
          "There was an error in Uploading your post. Please try again.",
      });
    } else {
      toast("Upload Successful!", {
        description: "Your post has been uploaded successfully. 🎉",
      });
      setIsLoadingCreate(false);
      router.push("/community");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-full px-3 pb-10"
      >
        {/* Caption Field */}
        <fieldset className="fieldset px-3">
          <legend className="fieldset-legend">Caption</legend>
          <textarea
            placeholder="Write a caption..."
            rows={4}
            className="mt-2 textarea textarea-ghost w-full"
            {...register("caption")}
          />
          {errors.caption && (
            <p className="text-error text-sm mt-1">{errors.caption.message}</p>
          )}
        </fieldset>

        {/* Add Photos */}
        <fieldset className="px-3 fieldset">
          <legend className="fieldset-legend">Add Photo</legend>
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
        <fieldset className="px-3 fieldset">
          <legend className="input input-ghost w-full">
            <Hash className="inline mr-2" />
            <input
              type="text"
              id="tags"
              placeholder="VLSI, Semiconductors, Analog Circuits, ..."
              className=""
              {...register("tags")}
            />
          </legend>
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
