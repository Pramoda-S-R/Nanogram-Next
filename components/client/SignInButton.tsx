"use client";

import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  const handleClick = () => {
    const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
    const signInFallback = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || "/";
    const signUpFallback = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL || "/";
    const redirectUrl = window.location.href;

    const url = new URL(signInUrl, window.location.origin);
    url.searchParams.set("redirect_url", redirectUrl);
    url.searchParams.set("sign_in_fallback_redirect_url", signInFallback);
    url.searchParams.set("sign_up_fallback_redirect_url", signUpFallback);

    router.push(url.toString());
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      Sign In
    </button>
  );
}
