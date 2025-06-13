"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";

const schema = z.object({
  identifier: z
    .string()
    .min(4, "Email or username must be at least 4 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CustomSignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);

  const redirectUrl = searchParams.get("redirect_url") || "/";
  const signUpFallback =
    searchParams.get("sign_up_fallback_redirect_url") || "/";
  const signInFallback =
    searchParams.get("sign_in_fallback_redirect_url") || "/";

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      if (!signIn) {
        setError("Sign-in is not available. Please try again later.");
        return;
      }

      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setLoading(false);
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error("Sign-in error", err);
      setError(err.errors?.[0]?.longMessage || "An unknown error occurred.");
      setLoading(false);
    }
  };

  const switchToSignUp = () => {
    const signUpUrl = new URL("/sign-up", window.location.origin);
    signUpUrl.searchParams.set("redirect_url", redirectUrl);
    signUpUrl.searchParams.set("sign_in_fallback_redirect_url", signInFallback);
    signUpUrl.searchParams.set("sign_up_fallback_redirect_url", signUpFallback);
    router.push(signUpUrl.toString());
  };

  const resetPassword = () => {
    const resetUrl = new URL("/forgot-password", window.location.origin);
    resetUrl.searchParams.set("redirect_url", redirectUrl);
    resetUrl.searchParams.set("sign_in_fallback_redirect_url", signInFallback);
    resetUrl.searchParams.set("sign_up_fallback_redirect_url", signUpFallback);
    router.push(resetUrl.toString());
  };

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_github"
  ) => {
    if (!signIn) return;
    setLoading(true);
    setError(null);
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
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="w-100 mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Sign in to Nanogram</h2>
      <p className="text-base-content/70">
        Welcome back! Please sign in to continue
      </p>
      <div className="mt-5 text-center flex justify-between">
        {/* Google */}
        <button
          className="btn bg-white text-black border-[#e5e5e5]"
          onClick={() => handleOAuthSignIn("oauth_google")}
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
          onClick={() => handleOAuthSignIn("oauth_github")}
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
              placeholder="Email or Username"
              {...register("identifier")}
            />
          </label>
          {errors.identifier && (
            <p className="text-sm mt-1 text-warning">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div className="mb-2.5">
          <label className="input validator w-full relative">
            <Lock />
            <input
              type={loading ? "password" : showPassword ? "text" : "password"}
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

        <div id="clerk-captcha" className="hidden" />

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Sign In"
          )}
        </button>

        {error && <p className="text-error text-center mt-2.5">{error}</p>}
      </form>

      {/* Forgot Password Button */}
      <div className="flex justify-between mt-4">
        <button className="btn btn-link text-info p-0" onClick={switchToSignUp}>
          Don't have an account? Sign Up
        </button>
        <button
          type="button"
          className="btn btn-link text-info p-0"
          onClick={resetPassword}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
