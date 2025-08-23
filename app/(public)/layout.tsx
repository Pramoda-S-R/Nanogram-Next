import AIMascot from "@/components/client/shared/AIMascot";
import Footer from "@/components/server/Footer";
import Navbar from "@/components/server/Navbar";
import React, { Suspense } from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="flex justify-center">
        <div className="w-full bg-base-100 text-base-content">{children}</div>
        <Suspense fallback={<div className="fixed h-10 w-10 right-10 bottom-10 btn btn-info btn-circle skeleton" />}>
          <AIMascot />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
