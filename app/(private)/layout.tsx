import Navbar from "@/components/Navbar";
import Sidebar from "@/components/client/Sidebar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      <section className="flex justify-center">
        {/* add the sidebar part her */}
        <Sidebar />
        <div className="md:max-w-7xl w-full bg-base-100 text-base-content">{children}</div>
      </section>
    </main>
  );
};

export default PublicLayout;
