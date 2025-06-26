import React from "react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import ReturnHomeButton from "@/components/client/ReturnHomeButton";

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <SignedIn>
        <div className="flex flex-col items-center justify-center h-dvh">
          <h1 className="text-2xl font-bold mb-4">
            You are currently signed in
          </h1>
          <p className="text-base-content/70 mb-5">Do you want to signout?</p>
          <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
            <button className="btn btn-primary">Sign out</button>
          </SignOutButton>
          <ReturnHomeButton className="btn btn-primary mt-5" />
        </div>
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </section>
  );
};

export default SignInLayout;
