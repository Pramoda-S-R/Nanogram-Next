"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { TriangleAlert } from "lucide-react";
import { ObjectId } from "mongodb";
import { User } from "@/types";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportOptions } from "@/constants";
import { toast } from "sonner";
import { reportMedia } from "@/app/actions/api";

interface ReportMediaProps {
  media: "Post" | "Comment" | "Blog" | "Message";
  mediaId: string | ObjectId;
  userId: string | ObjectId;
  currentUser?: User;
  closeCallback?: () => void;
}

const ReportMediaSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  details: z.string().optional(),
  anonymous: z.boolean().optional(),
});

type ReportMediaSchemaType = z.infer<typeof ReportMediaSchema>;

const ReportMedia = ({
  media,
  mediaId,
  currentUser,
  userId,
  closeCallback,
}: ReportMediaProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ReportMediaSchema),
  });

  async function onSubmit(data: ReportMediaSchemaType) {
    setLoading(true);
    try {
      const isAnonymous = data.anonymous || !currentUser;
      const report = {
        reporter: isAnonymous ? "Anonymous" : currentUser?.userId.toString(),
        reportedUser: userId.toString(),
        reportedMedia: media.toLowerCase(),
        mediaId: mediaId.toString(),
        reason: data.reason,
        details: data.details || "",
        status: "pending",
      };

      const res = await reportMedia(report);
      if (!res) {
        throw new Error("Failed to submit report at api proxy");
      }
      toast.success(
        "Report submitted successfully. Thank you for helping us keep Nanogram safe!"
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to report. Please try again later.");
    } finally {
      setLoading(false);
      setOpen(false);
      if (closeCallback) {
        closeCallback();
      }
    }
  }

  async function handleCancel() {
    setOpen(false);
    if (closeCallback) {
      closeCallback();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          media === "Post" || media === "Message"
            ? "btn btn-error justify-start"
            : ""
        }
      >
        {(media === "Post" || media === "Message") && (
          <>
            <TriangleAlert strokeWidth={1.5} />
            Report {media}
          </>
        )}
        {media === "Comment" && (
          <>
            <TriangleAlert
              strokeWidth={1.5}
              width={12}
              className="text-error"
            />
          </>
        )}
        {media === "Blog" && (
          <>
            <TriangleAlert strokeWidth={1.5} className="text-error" />
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report This {media}?</DialogTitle>
          <DialogDescription>
            We strive to make Nanogram a healthy platform for users to
            socialize. Please tell us more...
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Reason</legend>
            <select
              defaultValue={`This ${media.toLowerCase()} has...`}
              className="w-full select bg-base-200 select-ghost focus:outline-none"
              {...register("reason")}
              onChange={(e) => setValue("reason", e.target.value)}
            >
              {reportOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-error text-sm mt-1">{errors.reason.message}</p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Describe your concern</legend>
            <textarea
              className="textarea bg-base-200 textarea-ghost w-full h-24"
              placeholder="Tell us more so we can handle it quickly."
              {...register("details")}
            ></textarea>
            <div className="label">Optional</div>
            {errors.details && (
              <p className="text-error text-sm mt-1">
                {errors.details.message}
              </p>
            )}
          </fieldset>
          <label className="label">
            <input
              type="checkbox"
              defaultChecked={!currentUser}
              className="checkbox"
              disabled={!currentUser}
              {...register("anonymous")}
            />
            Report Anonymously
          </label>
          {errors.details && (
            <p className="text-error text-sm mt-1">{errors.details.message}</p>
          )}
          <DialogFooter>
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-error" disabled={loading}>
              Report
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportMedia;
