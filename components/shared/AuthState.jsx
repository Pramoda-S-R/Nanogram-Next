import Link from "next/link";
import React from "react";

const AuthState = () => {
  return (
    <div>
      <Link href={"/login"}>Login</Link>
    </div>
  );
};

export default AuthState;
