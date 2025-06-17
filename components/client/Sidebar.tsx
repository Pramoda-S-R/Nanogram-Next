"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Album,
  Compass,
  Home,
  MessageCircle,
  PlusSquare,
  Users,
} from "lucide-react";
import ThemeSwitch from "./shared/ui/ThemeSwitch";
import ProfileDrawer from "./shared/ProfileDrawer";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const linkItems = [
    {
      href: "/",
      label: "Website",
      icon: (
        <Image
          src={"/assets/images/nanogram_logo-bg-primary.svg"}
          alt="logo"
          width={24}
          height={24}
          className="rounded-sm"
        />
      ),
    },
    { href: "/community", label: "FYP", icon: <Home height={24} /> },
    { href: "/explore", label: "Explore", icon: <Compass height={24} /> },
    { href: "/all-users", label: "People", icon: <Users height={24} /> },
    { href: "/saved", label: "Saved", icon: <Album height={24} /> },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageCircle height={24} />,
    },
    { href: "/create-post", label: "Create", icon: <PlusSquare height={24} /> },
  ];

  const islandItems = [
    { href: "/community", label: "FYP", icon: <Home height={24} /> },
    { href: "/explore", label: "Explore", icon: <Compass height={24} /> },
    { href: "/create-post", label: "Create", icon: <PlusSquare height={24} /> },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageCircle height={24} />,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const renderBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-base-100 border-t-2 border-base-300 py-2 md:hidden">
      {islandItems.slice(0, 5).map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          aria-current={isActive(href) ? "page" : undefined}
          className={`flex flex-col items-center text-xs ${
            isActive(href)
              ? "text-primary"
              : "text-base-content/50 hover:text-info"
          }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
      <div className="flex flex-col items-center text-xs text-base-content/50 hover:text-info">
        <ProfileDrawer />
        <span>Profile</span>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sticky top-0 md:flex h-screen bg-base-100">
        <div className="flex flex-col justify-between p-1 pb-5 w-full">
          {/* Navigation Section */}
          <nav className="flex flex-col gap-5 px-1 pt-3">
            {linkItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive(href) ? "page" : undefined}
                className={`group transition-colors duration-150 flex tooltip tooltip-right items-center justify-center gap-1 text-md font-semibold ${
                  isActive(href)
                    ? "text-base-content"
                    : "text-base-content/50 hover:text-info"
                }`}
                data-tip={label}
              >
                {icon}
              </Link>
            ))}
          </nav>

          {/* Additional Content Section */}
          <div className="flex flex-col items-center gap-2 mt-5">
            <ThemeSwitch />
            <ProfileDrawer />
          </div>
        </div>

        {mounted && (
          <div className="divider divider-horizontal divider-start ml-0 group text-base-content"></div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {mounted && renderBottomNav()}
    </>
  );
};

export default Sidebar;
