import Navbar from "@/components/Navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="flex justify-center">
        <section className="w-full bg-base-100 text-base-content">
          {children}
        </section>
      </main>
    </>
  );
};

export default PublicLayout;
