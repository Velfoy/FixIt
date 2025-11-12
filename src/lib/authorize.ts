import { redirect } from "next/navigation";
import { getCachedSession } from "./session";
import { isRouteAllowed } from "./routeAccess";

/**
 * Call this at the top of a server component/page
 * Example: await authorizePage(["admin", "mechanik"])
 */
export async function authorizePage(allowedRoles: string[]) {
  const session = await getCachedSession();
  const userRole = session?.user?.role?.toLowerCase();

  if (!session) redirect("/login");

  // Normalize allowed roles to lowercase too
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  if (!userRole || !normalizedAllowed.includes(userRole)) {
    redirect(`/${userRole || "client"}/dashboard`);
  }

  return session;
}

export async function authorizeRoute(pageName?: string) {
  const session = await getCachedSession();
  const userRole = session?.user?.role?.toLowerCase();

  if (!session) redirect("/login");

  if (pageName && userRole) {
    if (!isRouteAllowed(userRole, pageName)) {
      redirect(`/${userRole}/dashboard`);
    }
  }

  return session;
}
