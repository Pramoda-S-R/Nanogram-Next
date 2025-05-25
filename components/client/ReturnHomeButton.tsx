"use client";

import React from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type ReturnHomeButtonProps = {
  className?: string;
};

const ReturnHomeButton = ({ className }: ReturnHomeButtonProps) => {
  const router = useRouter();
  return (
    <button className={clsx(className)} onClick={() => router.push("/")}>
      Return Home
    </button>
  );
};

export default ReturnHomeButton;
