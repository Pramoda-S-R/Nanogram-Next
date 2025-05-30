import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SignInButton from "../client/SignInButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/client/shared/Sheet";
import { Hamburger } from "@/components/client/shared/Hamburger";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "Newsletters", href: "/newsletter" },
];

const Navbar = () => {
  return (
    <header className="w-full bg-primary flex justify-center text-white sticky">
      <nav className="sr-only">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="w-full max-w-7xl flex justify-between items-center px-6 py-1">
        {/* Logo & Menu */}
        <div className="flex items-center gap-4">
          {/* Dropdown */}
          <Sheet>
            <SheetTrigger asChild>
              <Hamburger />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle className="text-primary">
                  <Logo imgBg="primary" />
                </SheetTitle>
                <SheetDescription className="text-justify">
                  Explore Nanogram and discover our community, events, and more.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-10">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-base-content hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
          {/* Logo */}
          <Logo />
        </div>

        {/* User Avatar */}
        <div className="flex items-center justify-center">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export function Logo({ imgBg = "primary" }: { imgBg?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={
          imgBg === "primary"
            ? "/assets/images/nanogram_logo-bg-primary.svg"
            : "/assets/images/nanogram_logo-no-bg.svg"
        }
        alt="Nanogram Logo"
        width={32}
        height={32}
        priority
      />
      <h1 className="font-blanka text-2xl mb-2">NANOGRAM</h1>
    </Link>
  );
}

export default Navbar;
