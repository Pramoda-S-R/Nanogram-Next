Here’s how you can implement **custom UI for re‑verification** in a Next.js (App Router) project using Clerk’s `useReverification()` within a **client component**:

---

## ✅ Installation & Requirements

Make sure you're using the required versions:

* `@clerk/nextjs@6.12.7+`
* `@clerk/clerk-react@5.25.1+`
* `@clerk/clerk-js@5.57.1+` ([clerk.com][1])

---

## 1. Setup Clerk in `app/layout.tsx` (Server Component)

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { children } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

---

## 2. Create a Client Component with Custom Reverification Flow

```tsx
// components/UpdateEmailWithCustomReverification.tsx
'use client';

import { useReverification, useUser } from '@clerk/clerk-react';
import { isClerkRuntimeError, isReverificationCancelledError } from '@clerk/clerk-react/errors';
import { useState } from 'react';

function VerificationModal({
  level,
  complete,
  cancel,
}: {
  level?: 'first_factor' | 'second_factor' | 'multi_factor';
  complete: () => void;
  cancel: () => void;
}) {
  // You’d implement sending code, verifying input, etc.
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      // Simulate verifying the code:
      await fakeVerifyCode(level, code); 
      complete();
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    }
  };

  return (
    <div className="modal">
      <h2>Please verify your identity</h2>
      <p>Required level: {level}</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter verification code"
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>Submit Code</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}

// Simulate sending and verifying a code — replace with real logic
async function fakeVerifyCode(level: string | undefined, code: string) {
  if (code !== '1234') throw new Error('Invalid code');
  return Promise.resolve();
}

export function UpdateEmailWithCustomReverification() {
  const { user } = useUser();
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: 'first_factor' | 'second_factor' | 'multi_factor';
  } | null>(null);

  const changeEmail = useReverification(
    (newEmailId: string) => user?.update({ primaryEmailAddressId: newEmailId }),
    {
      onNeedsReverification: ({ complete, cancel, level }) => {
        setVrState({ inProgress: true, complete, cancel, level });
      },
    }
  );

  const handleChooseEmail = async (id: string) => {
    try {
      await changeEmail(id);
    } catch (err: any) {
      if (isClerkRuntimeError(err) && isReverificationCancelledError(err)) {
        console.log('User cancelled reverification');
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h3>Choose new primary email:</h3>
      <ul>
        {user?.emailAddresses.map((em) => (
          <li key={em.id}>
            <button onClick={() => handleChooseEmail(em.id)}>
              Set {em.emailAddress} as primary
            </button>
          </li>
        ))}
      </ul>

      {vrState?.inProgress && (
        <VerificationModal
          level={vrState.level}
          complete={vrState.complete}
          cancel={() => {
            vrState.cancel();
            setVrState(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## 🧭 How This Works

* `useReverification()` wraps your sensitive action (email update).
* When invoked:

  * If credentials are 🚫 stale or a higher factor is needed, it calls `onNeedsReverification`.
  * You show your **custom UI** (here: `VerificationModal`) using its `level`, `complete`, `cancel` callbacks.
  * Once verification succeeds, call `complete()` → consults Clerk, and retriggers the original fetcher.
  * If user cancels, call `cancel()` to stop the flow ([clerk.com][1]).

---

## 3. Use it in a Page

```tsx
// app/settings/email/page.tsx
import { UpdateEmailWithCustomReverification } from '@/components/UpdateEmailWithCustomReverification';

export default function EmailPage() {
  return (
    <div>
      <h1>Email Settings</h1>
      <UpdateEmailWithCustomReverification />
    </div>
  );
}
```

---

## 🎯 Summary

* Wrap your action with `useReverification(fetcher, { onNeedsReverification })`.
* In the handler, render a **client component** for your custom modal.

  * Accepts: `level`, `complete`, `cancel`.
  * Call `complete()` on success or `cancel()` on abort.
* This integrates seamlessly within Next.js **client components** and App Router setup.

Let me know if you want a version for Pages Router or more advanced factor handling!

[1]: https://clerk.com/docs/hooks/use-reverification?utm_source=chatgpt.com "Clerk Hooks: useReverification()"
