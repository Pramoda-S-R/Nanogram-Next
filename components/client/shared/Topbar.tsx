"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Search } from "lucide-react";
import React from "react";
import ThemeSwitch from "./ui/ThemeSwitch";
import Link from "next/link";
import Image from "next/image";

const Topbar = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="bg-base-200 w-full flex items-center justify-between p-2">
      <Link href="/" className="flex gap-2">
        <Image
          src="./assets/images/nanogram_logo-bg-primary.svg"
          alt="logo"
          width={40}
          height={40}
          className="rounded-full"
          priority
        />
        <h2 className="font-blanka mt-0.5 text-xl">Nanogram</h2>
      </Link>
      <div className="flex gap-2">
        <Link href="/all-users">
          <Search strokeWidth={1.5} />
        </Link>
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Topbar;
