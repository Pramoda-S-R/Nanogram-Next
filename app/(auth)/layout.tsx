import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      {children}
    </main>
  );
};

export default PublicLayout;
