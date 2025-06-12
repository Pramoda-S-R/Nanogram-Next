import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SignInButton from "../client/SignInButton";
import NavSheet from "../client/NavSheet";
import ProfileDrawer from "../client/shared/ProfileDrawer";
import ThemeSwitch from "../client/shared/ui/ThemeSwitch";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "Newsletters", href: "/newsletter" },
  { label: "Developers", href: "/developers" },
  { label: "FAQ", href: "/events#faq" },
  { label: "Contact Us", href: "/about-us#contact" },
  { label: "Feedback", href: "/feedback" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Sitemap", href: "/sitemap" },
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
          <NavSheet navItems={navItems} />
          {/* Logo */}
          <Logo />
        </div>

        {/* User Avatar */}
        <div className="flex gap-2 items-center justify-center">
          <ThemeSwitch />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <ProfileDrawer />
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
