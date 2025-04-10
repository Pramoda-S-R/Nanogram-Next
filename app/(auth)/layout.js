"use client";

import { useRouter, usePathname } from "next/navigation";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  return (
    <html lang="en">
      <meta name="robots" content="noindex" />
      <body>
        <button onClick={() => router.back()}>&larr; Go back</button>
        {children}
        <div>
          {isLoginPage && (
            <>
              <p>Don&apos;t have an account?</p>
              <Link href="/signup">Signup</Link>
            </>
          )}
          {isSignupPage && (
            <>
              <p>Already have an account?</p>
              <Link href="/login">Login</Link>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
