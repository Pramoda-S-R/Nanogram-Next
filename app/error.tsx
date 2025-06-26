"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const router = useRouter();

  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-6 bg-base-100 text-base-content px-6 text-center">
      {/* Logo and Branding */}
      <div className="flex items-center gap-4">
        <Image
          src="/assets/images/nanogram_logo-bg-primary.svg"
          alt="Nanogram Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
        <h1 className="font-blanka text-primary font-bold text-4xl">
          Nanogram
        </h1>
      </div>

      {/* Error Message */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Something went wrong</h2>
        <p className="text-base text-base-content/70 max-w-md mx-auto">
          An unexpected error occurred while loading this page. Please try
          again, or go back home.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Go Back Home
        </button>
        <button className="btn btn-outline" onClick={reset}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
