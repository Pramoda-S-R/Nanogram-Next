import Sidebar from "@/components/client/Sidebar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex justify-center">
        <Sidebar />
        <section className="w-full bg-base-100 text-base-content">
          {children}
        </section>
      </main>
    </>
  );
};

export default PublicLayout;
