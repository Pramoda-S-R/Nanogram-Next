import Navbar from "@/components/Navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>
        <section className="flex justify-center">
          <div className="w-full bg-base-100 text-base-content">
            {children}
          </div>
        </section>
      </main>
    </>
  );
};

export default PublicLayout;
