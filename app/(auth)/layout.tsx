import React from "react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <SignedIn>
        <SignOutButton signOutOptions={{redirectUrl: "/"}} />
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </main>
  );
};

export default PublicLayout;
