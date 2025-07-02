import AIMascot from "@/components/client/shared/AIMascot";
import Footer from "@/components/server/Footer";
import Navbar from "@/components/server/Navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="flex justify-center">
        <div className="w-full bg-base-100 text-base-content">{children}</div>
        <AIMascot />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
