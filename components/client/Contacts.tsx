"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const Contacts = () => {
  const [collapsed, setCollapsed] = useState(false);

  const ExpandedView = () => {
    return (
      <div className="flex flex-col items-center justify-center h-dvh">
        <h2 className="text-lg font-semibold">Contacts</h2>
        {/* Add more content here as needed */}
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
