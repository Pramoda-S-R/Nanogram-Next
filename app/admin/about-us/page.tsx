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
} from "@/components/client/shared/ui/Dialog";
import {
  Github,
  Instagram,
  Linkedin,
} from "@/components/server/shared/ui/icons/brands";
import { Award, Check, Type, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Nanogram } from "@/types";
import {
  createNanogram,
  deleteNanogramById,
  getAllNanograms,
  updateNanogram,
} from "@/app/actions/api";
import FileUploader from "@/components/client/shared/ui/FileUploader";
import { toast } from "sonner";
import { ObjectId } from "mongodb";

const NanogramFormSchema = z.object({
  name: z.string().min(2).max(30),
  role: z.string().min(2).max(30),
  content: z.string().max(200).optional(),
  file: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "A valid image file is required",
    })
    .optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  instagram: z.string().optional(),
  alumini: z.boolean().optional(),
  core: z.boolean().optional(),
  priority: z.number().int().min(1).max(100).optional(),
});

type NanogramFormData = z.infer<typeof NanogramFormSchema>;

function NanogramForm({
  member,
  action,
  onCallback,
}: {
  member?: Nanogram;
  action: "create" | "update";
  onCallback: (action: "create" | "update", nanogram: Nanogram) => void;
}) {
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
    resolver: zodResolver(NanogramFormSchema),
    defaultValues: {
      name: member ? member.name : "",
      role: member ? member.role : "",
      content: member?.content ? member.content : "",
      file: undefined,
      linkedin: member?.linkedin ? member.linkedin : "",
      github: member?.github ? member.github : "",
      instagram: member?.instagram ? member.instagram : "",
      alumini: member?.alumini ? member.alumini : false,
      core: member?.core ? member.core : false,
      priority:
        member &&
        typeof member.priority === "object" &&
        member.priority !== null &&
        "$numberInt" in member.priority
          ? Number((member.priority as any).$numberInt)
          : member?.priority ?? 50,
    },
  });

  const content = watch("content");

  async function onSubmit(data: NanogramFormData) {
    setLoading(true);
    try {
      const nanogramData = {
        name: data.name,
        role: data.role,
        content: data.content,
        avatar: data.file,
        linkedin: data.linkedin,
        github: data.github,
        instagram: data.instagram,
        alumini: data.alumini,
        core: data.core,
        priority: data.priority,
      };
      if (action === "create") {
        const success = await createNanogram(nanogramData);
        if (success) {
          toast.success("Nanogram member created successfully!");
          onCallback("create", { ...nanogramData, _id: success as ObjectId });
          setOpen(false);
        }
      } else {
        if (!member?._id) {
          throw new Error("Member ID is required for update");
        }
        const updatedNanogramData = {
          id: member?._id.toString(),
          ...nanogramData,
        };
        const success = await updateNanogram(updatedNanogramData);
        if (success) {
          toast.success("Nanogram member updated successfully!", {
            description: "Your changes have been saved. Changes may take a few minutes to reflect.",
          });
          onCallback("update", {
            ...nanogramData,
            _id: member._id,
            avatarId: member.avatarId,
            avatarUrl: member.avatarUrl,
          });
          setOpen(false);
        }
      }
    } catch (error) {
      toast.error(`Error: ${error}`, {
        description:
          "There was an error processing your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`btn ${action === "create" ? "btn-success" : "btn-primary"}`}
      >
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "create"
              ? "Add Nanogram Member"
              : "Update Nanogram Member"}
          </DialogTitle>
          <DialogDescription>
            {action === "create"
              ? "Fill in the details to create a new nanogram member."
              : "Update the details of the nanogram member."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="overflow-y-auto max-h-[60vh]">
            {/* Name Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Name <span className="text-error">*</span>
              </legend>
              <label
                htmlFor="name"
                className="w-full input focus:outline-none focus-within:outline-none"
              >
                <Type strokeWidth={1.5} />
                <input type="text" className="grow" {...register("name")} />
              </label>
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </fieldset>

            {/* Role Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Role <span className="text-error">*</span>
              </legend>
              <label
                htmlFor="role"
                className="w-full input focus:outline-none focus-within:outline-none"
              >
                <Award strokeWidth={1.5} />
                <input type="text" className="grow" {...register("role")} />
              </label>
              {errors.role && (
                <p className="text-error text-sm mt-1">{errors.role.message}</p>
              )}
            </fieldset>

            {/* Content Field */}
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Content</legend>
              <TextareaAutosize
                className="w-full textarea resize-none overflow-auto focus:outline-none"
                autoComplete="off"
                maxRows={4}
                minRows={1}
                {...register("content")}
              />
              <p className="text-xs text-base-content/50 font-thin absolute bottom-1 right-5">
                {content ? content.length : 0}/200
              </p>
              {errors.content && (
                <p className="text-error text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </fieldset>

            {/* Add Photo */}
            <fieldset className="px-3 fieldset">
              <legend className="fieldset-legend">Add Photo (optional)</legend>
              <label className="flex items-center justify-center">
                <FileUploader
                  onFileChange={(file) => setValue("file", file)}
                  initialFileUrl={member?.avatarUrl}
                  acceptedFileTypes={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                  enableImageCropping={true}
                  cropAspectRatio={0.8}
                />
              </label>
              {typeof errors.file?.message === "string" && (
                <p className="text-sm mt-1 text-warning">
                  {errors.file.message}
                </p>
              )}
            </fieldset>

            {/* LinkedIn Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">LinkedIn</legend>
              <label
                htmlFor="linkedin"
                className="w-full input focus:outline-none focus-within:outline-none"
              >
                <Linkedin strokeWidth={1.5} />
                <input type="text" className="grow" {...register("linkedin")} />
              </label>
              {typeof errors.linkedin?.message === "string" && (
                <p className="text-sm mt-1 text-warning">
                  {errors.linkedin.message}
                </p>
              )}
            </fieldset>

            {/* Github Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Github</legend>
              <label
                htmlFor="github"
                className="w-full input focus:outline-none focus-within:outline-none"
              >
                <Github strokeWidth={1.5} />
                <input type="text" className="grow" {...register("github")} />
              </label>
              {typeof errors.github?.message === "string" && (
                <p className="text-sm mt-1 text-warning">
                  {errors.github.message}
                </p>
              )}
            </fieldset>

            {/* Instagram Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Instagram</legend>
              <label
                htmlFor="instagram"
                className="w-full input focus:outline-none focus-within:outline-none"
              >
                <Instagram strokeWidth={1.5} />
                <input
                  type="text"
                  className="grow"
                  {...register("instagram")}
                />
              </label>
              {typeof errors.instagram?.message === "string" && (
                <p className="text-sm mt-1 text-warning">
                  {errors.instagram.message}
                </p>
              )}
            </fieldset>

            {/* Alumini Checkbox */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Alumini</legend>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  {...register("alumini")}
                />
                <span className="text-base-content">Is Alumini</span>
              </label>
              {errors.alumini && (
                <p className="text-error text-sm mt-1">
                  {errors.alumini.message}
                </p>
              )}
            </fieldset>

            {/* Core Checkbox */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Core</legend>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  {...register("core")}
                />
                <span className="text-base-content">Is Core Member</span>
              </label>
              {errors.core && (
                <p className="text-error text-sm mt-1">{errors.core.message}</p>
              )}
            </fieldset>

            {/* Priority Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Priority <span className="text-error">*</span>
              </legend>
              <label
                htmlFor="priority"
                className="w-full input focus:outline-none focus-within:outline-none"
              >
                <input
                  type="number"
                  className="grow"
                  {...register("priority", { valueAsNumber: true })}
                />
              </label>
              {errors.priority && (
                <p className="text-error text-sm mt-1">
                  {errors.priority.message}
                </p>
              )}
            </fieldset>
          </div>
          <DialogFooter>
            <DialogClose className="btn btn-error">Cancel</DialogClose>
            <button
              type="submit"
              className={`btn ${
                action === "create" ? "btn-success" : "btn-primary"
              }`}
              disabled={loading}
            >
              {action === "create" ? "Create" : "Update"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PreviewNanogram({ member }: { member: Nanogram }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn btn-soft">Preview</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview of {member.name}</DialogTitle>
          <DialogDescription>
            Here's how {member.name} will look in the website.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-40 h-50 aspect-[4/5] flex-none rounded-2xl object-cover">
            <img
              alt={member.name}
              loading="lazy"
              className="w-40 h-50 aspect-[4/5] flex-none rounded-2xl object-cover"
              src={member.avatarUrl}
            />
          </div>
          <div className="flex-auto">
            <h3 className="text-lg font-semibold leading-8 tracking-tight text-base-content">
              {member.name}
            </h3>
            <p className="text-base leading-7 text-base-content/70">
              {member.role}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content hover:text-primary"
                >
                  <Linkedin />
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content hover:text-primary"
                >
                  <Instagram />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content hover:text-primary"
                >
                  <Github />
                </a>
              )}
            </div>
          </div>
        </div>
        {member.content !== "" && (
          <>
            <div className="divider"></div>
            <div className="flex flex-col items-center text-center">
              <img
                src={member.avatarUrl || "/assets/images/placeholder.png"}
                alt={member.name || "Avatar"}
                className="w-24 h-24 rounded-full border border-base-content/10 object-cover mx-auto"
              />
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-base-content/70 mb-4">{member.role}</p>
              <blockquote className="text-lg italic text-base-content">
                "{member.content}"
              </blockquote>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const AdminAboutUs = () => {
  const [nanograms, setNanograms] = useState<Nanogram[]>([]);

  useEffect(() => {
    const fetchNanograms = async () => {
      try {
        const members = await getAllNanograms();
        setNanograms(members);
      } catch (error) {
        console.error("Error fetching nanograms:", error);
      }
    };
    fetchNanograms();
  }, []);

  async function handleDelete(nanogramId: string) {
    const confirmed = confirm("Are you sure you want to delete this nanogram?");
    if (confirmed) {
      const success = await deleteNanogramById(nanogramId);
      if (success) {
        setNanograms((prev) =>
          prev.filter((n) => n._id.toString() !== nanogramId)
        );
      }
    }
  }

  const handleOnCallback = (
    action: "create" | "update",
    nanogram: Nanogram
  ) => {
    try {
      if (action === "create") {
        setNanograms((prev) => [nanogram, ...prev]);
      } else if (action === "update") {
        setNanograms((prev) =>
          prev.map((n) => (n._id === nanogram._id ? nanogram : n))
        );
      }
    } catch (error) {
      console.error("Error adding nanogram:", error);
    }
  };

  if (nanograms.length === 0) {
    return (
      <div className="w-full h-dvh flex justify-center items-center">
        <span className="loading"></span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between gap-2 px-10 py-5">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/admin">Admin</a>
            </li>
            <li>Manage About Us</li>
          </ul>
        </div>
        <NanogramForm action="create" onCallback={handleOnCallback} />
      </div>
      <div className="w-full max-h-dvh overflow-x-auto overflow-y-auto">
        <table className="table table-zebra table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <td>Preview</td>
              <td>Update</td>
              <td>Delete</td>
              <td>Id</td>
              <td>Name</td>
              <td>Role</td>
              <td>Content</td>
              <td>Avatar Id</td>
              <td>Avatar Url</td>
              <td>LinkedIn</td>
              <td>Github</td>
              <td>Instagram</td>
              <td>Alumini</td>
              <td>Core</td>
              <td>Priority</td>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {nanograms.map((member, idx) => (
              <tr key={idx}>
                <th>{idx + 1}</th>
                <td>
                  <PreviewNanogram member={member} />
                </td>
                <td>
                  <NanogramForm
                    action="update"
                    member={member}
                    onCallback={handleOnCallback}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(member._id.toString())}
                  >
                    Delete
                  </button>
                </td>
                <td>{member._id.toString()}</td>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.content}</td>
                <td>{member.avatarId}</td>
                <td>
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-36"
                  />
                </td>
                <td>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base-content hover:text-primary"
                    >
                      <Linkedin />
                    </a>
                  )}
                </td>
                <td>
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base-content hover:text-primary"
                    >
                      <Github />
                    </a>
                  )}
                </td>
                <td>
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base-content hover:text-primary"
                    >
                      <Instagram />
                    </a>
                  )}
                </td>
                <td>
                  {member.alumini ? (
                    <Check strokeWidth={1.5} />
                  ) : (
                    <X strokeWidth={1.5} />
                  )}
                </td>
                <td>
                  {member.core ? (
                    <Check strokeWidth={1.5} />
                  ) : (
                    <X strokeWidth={1.5} />
                  )}
                </td>
                <td>
                  {(member.priority as any)?.$numberInt || member.priority}
                </td>
                <th>{idx + 1}</th>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <td>Preview</td>
              <td>Update</td>
              <td>Delete</td>
              <td>Id</td>
              <td>Name</td>
              <td>Role</td>
              <td>Content</td>
              <td>Avatar Id</td>
              <td>Avatar Url</td>
              <td>LinkedIn</td>
              <td>Github</td>
              <td>Instagram</td>
              <td>Alumini</td>
              <td>Core</td>
              <td>Priority</td>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminAboutUs;
