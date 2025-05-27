"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, MessageSquareMore } from "lucide-react";
import OtpInput from "@/components/client/OtpInput";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="w-100 mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Forgot Password?</h1>
      <form
        onSubmit={!successfulCreation ? create : reset}
        className="flex flex-col gap-3 w-full mx-auto text-justify mb-2.5"
      >
        {!successfulCreation && (
          <>
            <label htmlFor="email" className="input validator w-full">
              <Mail />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <button type="submit" className="btn btn-primary">
              Send password reset code
            </button>
            {error && <p className="text-center text-error">{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <p className="text-center">
              A reset code has been sent to your mail. <br /> Enter your new
              password alog with the reset code you recieved.
            </p>
            <label
              htmlFor="password"
              className="input validator w-full relative mb-5"
            >
              <Lock />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <OtpInput onChange={(e) => setCode(e)} />

            <button type="submit" className="btn btn-primary mt-5">
              Reset
            </button>
            {error && <p className="text-center text-error">{error}</p>}
          </>
        )}

        {secondFactor && (
          <p>2FA is required, but this UI does not handle that</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
