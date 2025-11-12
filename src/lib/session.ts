import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

/**
 * Try to read lightweight session info (role/id/name/email) from
 * headers set by middleware. Fallback to getServerSession when header
 * is not present.
 */
export async function getCachedSession() {
  // headers() may return a Promise or a ReadonlyHeaders depending on Next.js version.
  const maybe = headers() as unknown;

  let role: string | null = null;
  let id: string | null = null;
  let name: string | null = null;
  let email: string | null = null;

  // handle promise-like result
  if (maybe && typeof (maybe as any).then === "function") {
    const resolved = await (maybe as any);
    role = resolved.get?.("x-user-role") ?? null;
    id = resolved.get?.("x-user-id") ?? null;
    name = resolved.get?.("x-user-name") ?? null;
    email = resolved.get?.("x-user-email") ?? null;
  } else if (maybe) {
    const h = maybe as any;
    role = h.get?.("x-user-role") ?? null;
    id = h.get?.("x-user-id") ?? null;
    name = h.get?.("x-user-name") ?? null;
    email = h.get?.("x-user-email") ?? null;
  }

  if (role || id || name || email) {
    return {
      user: {
        id: id ?? undefined,
        role: role ?? undefined,
        name: name ?? undefined,
        email: email ?? undefined,
      },
    } as any;
  }

  // fallback to original server call
  const session = await getServerSession(authOptions);
  return session;
}

export default getCachedSession;
