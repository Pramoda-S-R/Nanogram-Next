"use client";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, MessageCirclePlus } from "lucide-react";
import React, { useState } from "react";

const Contacts = () => {
  const { isLoaded, user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const ExpandedView = () => {
    if (!isLoaded || !user) {
      return (
        <div className="flex items-center justify-center h-dvh">
          <p>Loading...</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col w-64 h-dvh p-2 ">
        <div className="flex justify-between">
          <h2 className=" font-semibold">@{user.username}</h2>
          <button>
            <MessageCirclePlus strokeWidth={1.5} width={20} />
          </button>
        </div>
        <div className="divider"></div>
        <div className="flex">
            <img src={user.imageUrl} alt="user" className="w-16 h-16" />
            <div>
                <h3 className="text-lg font-semibold">{user.fullName}</h3>
                <p className="text-sm text-base-content/50">
                    @{user.username}
                </p>
            </div>
        </div>
      </div>
    );
  };

  const CollapsedView = () => {
    return <div className="flex items-center justify-center h-dvh">yay</div>;
  };

  return (
    <div className="flex">
      {collapsed ? <CollapsedView /> : <ExpandedView />}
      <div className="divider divider-start divider-horizontal mx-0">
        <button
          type="button"
          className=""
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
    </div>
  );
};

export default Contacts;
