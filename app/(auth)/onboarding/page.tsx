"use client";
import { useReverification, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/client/shared/ui/FileUploader";
import { addUserToDb, userExistsById } from "@/app/actions/api";
import { User } from "lucide-react";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required").optional(),
  username: z.string().min(1, "Username is required"),
  bio: z.string().max(300, "Chill out bro ain't nobody reading an essay (300 char max)").optional(),
  file: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "A valid image file is required",
    })
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function Onboarding() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const updateProfile = useReverification((params) => user?.update(params));
  const setUserImage = useReverification((params) =>
    user?.setProfileImage(params)
  );

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [exists, setExists] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      bio: "",
      file: null,
    },
  });

  // Populate default values after user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      const checkUserExists = async () => {
        const userExists = await userExistsById(user.id);
        setExists(userExists);
      };
      checkUserExists();
      reset({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: "",
        file: null,
      });
    }
  }, [isLoaded, user, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (data.file) {
        const imageResource = await setUserImage({ file: data.file });
        if (imageResource) {
          setImageUrl(imageResource.publicUrl);
        }
      }

      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });

      await addUserToDb({
        userId: user!.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        bio: data.bio,
        avatarUrl: imageUrl || user!.imageUrl || "",
      });

      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto text-center p-4">
      {!isLoaded ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-base-content/70">
            Please wait while we load your data.
          </p>
        </>
      ) : !user ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
          <p className="text-base-content/70">
            You must be signed in to access this page.
          </p>
        </>
      ) : exists ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Hello {user.firstName}!</h2>
          <p className="text-base-content/70">
            You have already completed your profile, but nice to see you again!
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Hello {user.firstName || "@" + user.username || "User"}!
          </h2>
          <p className="text-base-content/70">
            Please complete your profile to get started.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full mx-auto text-justify my-2.5"
          >
            <div className="mb-2.5">
              <label className="w-full flex items-center justify-center">
                <FileUploader
                  onFileChange={(file) => setValue("file", file)}
                  initialFileUrl={user.imageUrl}
                  acceptedFileTypes={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                  enableImageCropping={true}
                  cropAspectRatio={1}
                  cropperStyle={{ width: "100%", height: "25%" }}
                />
              </label>
              {typeof errors.file?.message === "string" && (
                <p className="text-sm mt-1 text-warning">
                  {errors.file.message}
                </p>
              )}
            </div>
            <div className="mb-2.5">
              <label className="input validator w-full">
                <User />
                <input
                  type="text"
                  required
                  placeholder="Username"
                  {...register("username")}
                />
              </label>
              {errors.username && (
                <p className="text-sm mt-1 text-warning">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-2.5 flex gap-1">
              <label className="input validator w-full">
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  {...register("firstName")}
                />
              </label>
              {errors.firstName && (
                <p className="text-sm mt-1 text-warning">
                  {errors.firstName.message}
                </p>
              )}
              <label className="input validator w-full">
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  {...register("lastName")}
                />
              </label>
              {errors.lastName && (
                <p className="text-sm mt-1 text-warning">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="mb-2.5">
              <label className="w-full">
                <textarea
                  placeholder="Tell us about yourself (optional)"
                  rows={4}
                  className="w-full textarea"
                  {...register("bio")}
                />
              </label>
              {errors.bio && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
