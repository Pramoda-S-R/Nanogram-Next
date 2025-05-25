import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import SignInButton from "./client/SignInButton";

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
      <div className="w-full max-w-7xl flex justify-between items-center px-6 py-1">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Dropdown */}
          <div className="relative md:hidden">
            <details className="dropdown">
              <summary className="btn btn-ghost btn-circle p-2 cursor-pointer">
                <Menu />
              </summary>
              <ul className="menu menu-sm dropdown-content bg-base-100 text-base-content mt-3 w-52 p-2 shadow rounded-box z-10">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/nanogram_logo-no-bg.svg"
              alt="Nanogram Logo"
              width={32}
              height={32}
              priority
            />
            <h1 className="font-blanka text-2xl mb-2">NANOGRAM</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 font-semibold">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>

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

export default Navbar;
