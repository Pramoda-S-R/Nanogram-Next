"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/Drawer";
import { SignOutButton, useSession, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";

const ProfileDrawer = () => {
  const { isLoaded, user: currentUser } = useUser();
  const { isLoaded: isSessionLoaded, session, isSignedIn } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  if (!isLoaded) {
    return <span className="loading loading-ring loading-xl"></span>;
  }

  if (!currentUser) {
    return null; // or handle the case where the user is not authenticated
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative group w-7 h-7 overflow-hidden rounded-full">
          <img
            src={currentUser?.imageUrl}
            alt={currentUser?.username || "pfp"}
            className="w-full h-full object-cover rounded-full cursor-pointer"
          />
          <div className="pointer-events-none absolute inset-0 before:absolute before:w-[150%] before:h-[150%] before:rotate-45 before:top-[-100%] before:left-[-100%] before:bg-gradient-to-r before:from-transparent before:via-base-100/50 before:to-transparent before:content-[''] before:transition-transform before:duration-500 group-hover:before:translate-x-[200%] group-hover:before:translate-y-[200%]" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <img
              src={currentUser?.imageUrl}
              alt={currentUser?.username || "pfp"}
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
            />
            {currentUser.username}
          </DrawerTitle>
          <DrawerDescription>
            {currentUser.createdAt?.toISOString()}
          </DrawerDescription>
        </DrawerHeader>
        {isExpanded ? (
          <></>
        ) : (
          <div className="flex w-full px-4">
            <button
              className="btn btn-ghost text-left"
              onClick={() => setIsExpanded(true)}
            >
              <Wrench />
              Manage Account
            </button>
          </div>
        )}
        <DrawerFooter className="flex flex-col items-end gap-2">
          <DrawerClose className="flex items-center gap-2">
            <SignOutButton signOutOptions={{ redirectUrl: pathname }}>
              <div className="btn btn-primary">Sign out</div>
            </SignOutButton>
            <a className="btn btn-primary rounded-full p-2" href="/">
              <img
                src={"/assets/images/nanogram_logo-no-bg.svg"}
                alt="logo"
                className="size-6"
              />
            </a>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};



export default ProfileDrawer;
