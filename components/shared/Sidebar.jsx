import {
  Album,
  Compass,
  MessageCircleMore,
  Play,
  PlusSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <nav className="flex flex-col">
      <Link href={"/community"}>
        <Play />
      </Link>
      <Link href={"/explore"}>
        <Compass />
      </Link>
      <Link href={"/users"}>
        <Users />
      </Link>
      <Link href={"/saved"}>
        <Album />
      </Link>
      <Link href={"/create-post"}>
        <PlusSquare />
      </Link>
      <Link href={"/messages"}>
        <MessageCircleMore />
      </Link>
    </nav>
  );
};

export default Sidebar;
