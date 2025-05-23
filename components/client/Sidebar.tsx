"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Album,
  ChevronsLeft,
  ChevronsRight,
  Compass,
  Home,
  MessageCircle,
  PlusSquare,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [colapsed, setColapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const linkItems = [
    { href: "/community", label: "FYP", icon: <Home height={24} /> },
    { href: "/explore", label: "Explore", icon: <Compass height={24} /> },
    { href: "/create-post", label: "Create", icon: <PlusSquare height={24} /> },
    { href: "/saved", label: "Saved", icon: <Album height={24} /> },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageCircle height={24} />,
    },
    { href: "/all-users", label: "People", icon: <Users height={24} /> },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const renderNav = (isCollapsed: boolean) => (
    <nav className="flex flex-col gap-5 px-1 pt-3">
      {linkItems.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          aria-current={isActive(href) ? "page" : undefined}
          className={`group transition-colors duration-150 ${
            isCollapsed
              ? "justify-center"
              : "flex items-center gap-1 text-md font-semibold"
          } ${
            isActive(href)
              ? "text-base-content"
              : "text-base-content/50 hover:text-primary"
          }`}
        >
          {icon}
          {!isCollapsed && label}
        </Link>
      ))}
    </nav>
  );

  const renderBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t-2 border-base-300 py-2 md:hidden">
      {linkItems.slice(0, 5).map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          aria-current={isActive(href) ? "page" : undefined}
          className={`flex flex-col items-center text-xs ${
            isActive(href)
              ? "text-primary"
              : "text-base-content/50 hover:text-primary"
          }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-svh bg-base-100">
        <div className="p-1 pl-3">
          {mounted ? renderNav(colapsed) : renderNav(false)}
        </div>
        {mounted && (
          <div
            className="divider divider-horizontal divider-start ml-0 group cursor-pointer text-base-content"
            onClick={() => setColapsed(!colapsed)}
            aria-label="Toggle sidebar"
            role="button"
            tabIndex={0}
          >
            {colapsed ? (
              <ChevronsRight height={40} className="hidden group-hover:block" />
            ) : (
              <ChevronsLeft height={40} className="hidden group-hover:block" />
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {mounted && renderBottomNav()}
    </>
  );
};

export default Sidebar;
