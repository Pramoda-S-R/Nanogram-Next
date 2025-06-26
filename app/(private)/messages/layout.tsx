import Contacts from "@/components/client/Contacts";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Contacts />
      {children}
    </div>
  );
};

export default PublicLayout;
