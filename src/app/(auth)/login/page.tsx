"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const waitForSession = async (tries = 12, delay = 250) => {
    for (let i = 0; i < tries; i++) {
      const s = await getSession();
      if (s?.user) return s;
      await new Promise((r) => setTimeout(r, delay));
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // IMPORTANT: prevent built-in redirect and provide callbackUrl (cast to any for TS)
    await signIn("credentials", { email, password }, {
      redirect: false,
      callbackUrl: "/client/dashboard",
    } as any);

    // wait for server session to be created (avoids race with server redirect)
    const session = await waitForSession();
    if (!session?.user) {
      setError("No response from auth.");
      return;
    }

    const role = (session.user as any)?.role || "client";
    router.replace(`/${String(role).toLowerCase()}/dashboard`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign in</button>
      {error && <div>{error}</div>}
    </form>
  );
}
