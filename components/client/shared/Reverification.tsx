"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@clerk/clerk-react";
import {
  SessionVerificationLevel,
  SessionVerificationResource,
} from "@clerk/types";

export function VerificationComponent({
  level = "first_factor",
  onComplete,
  onCancel,
}: {
  level: SessionVerificationLevel | undefined;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const { session } = useSession();
  const [password, setPassword] = useState<string>("");
  const reverificationRef = useRef<SessionVerificationResource | undefined>(
    undefined
  );
  const [requiresPassword, setRequiresPassword] = useState(false);

  useEffect(() => {
    if (reverificationRef.current || !session) return;

    session.startVerification({ level }).then((response) => {
      reverificationRef.current = response;

      if (response.status === "needs_first_factor") {
        const hasPasswordStrategy = response.supportedFirstFactors?.some(
          (factor) => factor.strategy === "password"
        );

        if (hasPasswordStrategy) {
          setRequiresPassword(true);
        } else {
          console.warn("Password strategy not supported for this session.");
        }
      }
    });
  }, [session, level]);

  const handleVerificationAttempt = async () => {
    try {
      await session?.attemptFirstFactorVerification({
        strategy: "password",
        password,
      });
      onComplete();
    } catch (e) {
      console.error("Error verifying with password:", e);
    }
  };

  if (!requiresPassword) return null;

  return (
    <div className="w-full flex flex-col bg-base-200 p-2 rounded-md">
      <p>Please enter your password to verify your session:</p>
      <input
        type="password"
        value={password}
        className="input w-full"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" className="btn btn-success" onClick={handleVerificationAttempt}>
          Verify
        </button>
        <button type="button" className="btn btn-error" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
