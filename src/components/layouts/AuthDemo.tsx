"use client";

import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthDemo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const waitForSession = async (tries = 12, delay = 250) => {
    for (let i = 0; i < tries; i++) {
      const s = await getSession();
      if (s?.user) return s;
      await new Promise((r) => setTimeout(r, delay));
    }
    return null;
  };

  async function handleSignIn() {
    try {
      setLoading(true);
      // attempt client-side signIn without automatic redirect (typings may require cast)
      await signIn(undefined, { redirect: false } as any);

      // wait for the server session to appear (avoids race)
      const s = await waitForSession();
      if (!s?.user) {
        // fallback to explicit sign-in page if still not signed in
        router.push("/login");
        return;
      }

      const role = (s.user as any)?.role || "client";
      router.replace(`/${String(role).toLowerCase()}/dashboard`);
    } catch (err) {
      console.error("handleSignIn error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut({ redirect: false } as any);
      router.push("/login");
    } catch (err) {
      console.error("signOut error:", err);
    }
  }

  if (status === "loading") return <p>Loading...</p>;

  if (!session)
    return (
      <div>
        <p>You are not signed in.</p>
        <button onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    );

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
