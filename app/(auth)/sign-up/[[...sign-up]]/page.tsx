"use client";

import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import OtpInput from "@/components/client/shared/OtpInput";

const schema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: isSignInLoaded,
  } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const redirectUrl = searchParams.get("redirect_url") || "/";
  const signInFallback =
    searchParams.get("sign_in_fallback_redirect_url") || "/";
  const signUpFallback =
    searchParams.get("sign_up_fallback_redirect_url") || "/";

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      if (!signUp) throw new Error("Sign-up not initialized");

      await signUp.create({
        username: data.username,
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.error("Sign-up error", err);
      console.log("err: ", err.errors);
      setError(err.errors?.[0]?.longMessage || "An unknown error occurred.");
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (
    strategy: "oauth_google" | "oauth_github"
  ) => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `/callback?redirect_url=${encodeURIComponent(
          redirectUrl
        )}`,
        redirectUrlComplete: redirectUrl,
      });
    } catch (err: any) {
      console.error(`OAuth sign-in error for ${strategy}`, err);
      setError("Failed to authenticate with social provider.");
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!signUp) throw new Error("Sign-up not initialized");

      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl); // ✅ Final redirect after verification
      }
    } catch (err: any) {
      console.error("Verification failed", err);
      setError(err.errors?.[0]?.longMessage || "Verification failed.");
      setLoading(false);
    }
  };

  const switchToSignIn = () => {
    const signInUrl = new URL("/sign-in", window.location.origin);
    signInUrl.searchParams.set("redirect_url", redirectUrl);
    signInUrl.searchParams.set("sign_in_fallback_redirect_url", signInFallback);
    signInUrl.searchParams.set("sign_up_fallback_redirect_url", signUpFallback);
    router.push(signInUrl.toString());
  };

  if (!isLoaded) return null;

  return (
    <div className="w-100 mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>

      {!pendingVerification ? (
        <>
          <p className="text-base-content/70">
            Welcome! Please fill in the details to get started.
          </p>
          <div className="mt-5 text-center flex justify-between">
            {/* Google */}
            <button
              className="btn bg-white text-black border-[#e5e5e5]"
              onClick={() => handleOAuthSignUp("oauth_google")}
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Continue with Google
            </button>
            {/* GitHub */}
            <button
              className="btn bg-black text-white border-black"
              onClick={() => handleOAuthSignUp("oauth_github")}
            >
              <svg
                aria-label="GitHub logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                ></path>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="divider">or</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full mx-auto text-justify mb-2.5"
          >
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

            <div className="mb-2.5">
              <label className="input validator w-full">
                <Mail />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  {...register("email")}
                />
              </label>
              {errors.email && (
                <p className="text-sm mt-1 text-warning">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-2.5">
              <label className="input validator w-full relative">
                <Lock />
                <input
                  type={
                    loading ? "password" : showPassword ? "text" : "password"
                  }
                  required
                  placeholder="Password"
                  {...register("password")}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="bg-none" size={20} />
                  ) : (
                    <Eye className="bg-none" size={20} />
                  )}
                </button>
              </label>
              {errors.password && (
                <p className="text-sm mt-1 text-warning">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div id="clerk-captcha" />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-base-content/70 mb-10">
            Verify your account by entering the OTP sent to your email address.
          </p>
          <div className="flex flex-col gap-10 w-full mx-auto text-justify">
            <OtpInput onChange={(e) => setCode(e)} />

            <button
              className="btn btn-primary"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-error">{error}</p>}

      <button className="btn btn-link mt-5" onClick={switchToSignIn}>
        Already have an account? Sign In
      </button>
    </div>
  );
}
