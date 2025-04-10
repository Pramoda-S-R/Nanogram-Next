import Link from "next/link";
import React from "react";
import AuthState from "./AuthState";

const Navbar = () => {
  return (
    <div className="flex flex-1 justify-between">
      <div>
        <h1>Nanogram</h1>
      </div>
      <nav className="flex gap-5" aria-label="Main navigation">
        <Link href={"/"}>Home</Link>
        <Link href={"/about-us"}>About Us</Link>
        <Link href={"/events"}>Events</Link>
        <Link href={"/community"}>Community</Link>
        <Link href={"/news"}>News</Link>
      </nav>
      <AuthState />
    </div>
  );
};

export default Navbar;
