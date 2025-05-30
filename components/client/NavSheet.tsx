"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../client/shared/Sheet";
import { Hamburger } from "./shared/Hamburger";
import { Logo } from "../server/Navbar";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const NavSheet = ({ navItems }: { navItems: NavItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Hamburger />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-primary">
            <Logo imgBg="primary" />
          </SheetTitle>
          <SheetDescription className="text-justify">
            Explore Nanogram and discover our community, events, and more.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-10 overflow-y-scroll nano-scrollbar h-[calc(100vh-200px)]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-base-content hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SheetFooter>
          <p className="text-sm text-base-content mt-4">
            © {new Date().getFullYear()} Nanogram. All rights reserved.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavSheet;
