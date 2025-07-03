import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full min-h-dvh flex justify-center items-center">
      {children}
    </main>
  );
};

export default PublicLayout;
