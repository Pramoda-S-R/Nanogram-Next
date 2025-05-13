import Image from "next/image";
import Link from "next/link";
import React from "react";
import Navatar from "./client/Navatar";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-primary flex justify-center">
      <div className="md:max-w-7xl w-full flex justify-between md:gap-15 gap-5 items-center text-white">
        <div className=" flex gap-3 h-18 items-center ml-6">
          <div className="dropdown md:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <Menu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <Link href="/">Home</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/events">Events</Link>
              <Link href="/community">Community</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/newsletter">Newsletters</Link>
            </ul>
          </div>
          <Image
            src={"/assets/images/nanogram_logo-no-bg.svg"}
            alt="Logo"
            width={32}
            height={32}
          />
          <h1 className="font-blanka text-2xl mb-2">NANOGRAM</h1>
        </div>
        <nav>
          <ul className="md:flex flex-wrap hidden gap-8 font-semibold">
            <Link className="hover:underline" href="/">
              Home
            </Link>
            <Link className="hover:underline" href="/about-us">
              About Us
            </Link>
            <Link className="hover:underline" href="/events">
              Events
            </Link>
            <Link className="hover:underline" href="/community">
              Community
            </Link>
            <Link className="hover:underline" href="/blog">
              Blog
            </Link>
            <Link className="hover:underline" href="/newsletter">
              Newsletters
            </Link>
          </ul>
        </nav>
        <div className="mr-6 flex items-center">
          <Navatar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
