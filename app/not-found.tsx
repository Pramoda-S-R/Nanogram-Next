"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <div className="flex items-center gap-5">
        <Image
          src={"/assets/images/nanogram_logo-bg-primary.svg"}
          alt="logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <h1 className="font-blanka text-primary font-bold text-4xl mb-3">
          Nanogram
        </h1>
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          404 - Page Not Found
        </h2>
        <p className="text-lg font-normal text-neutral/70">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
      </div>
      <div>
        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
