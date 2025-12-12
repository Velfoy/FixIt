import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isRouteAllowed } from "@/lib/routeAccess";

/**
 * Route access matrix: defines which pages each role can access
 */
const routeAccessMatrix: Record<string, string[]> = {
  admin: [
    "dashboard",
    "customers",
    "users",
    "mechanics",
    "warehouse",
    "orders",
    "cars",
    "invoices",
    "info",
    "settings",
    "profile",
  ],
  mechanic: [
    "dashboard",
    "warehouse",
    "orders",
    "invoices",
    "info",
    "settings",
    "profile",
  ],
  client: [
    "dashboard",
    "orders",
    "cars",
    "history",
    "invoices",
    "info",
    "settings",
    "profile",
  ],
  warehouse: [
    "dashboard",
    "orders",
    "warehouse",
    "invoices",
    "info",
    "settings",
    "profile",
  ],
};

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = (token as any)?.role?.toLowerCase();

    // Add lightweight user headers
    const newHeaders = new Headers(req.headers);
    if (token) {
      const anyToken = token as any;
      if (anyToken.role) newHeaders.set("x-user-role", anyToken.role);
      const uid = anyToken.id ?? anyToken.sub;
      if (uid) newHeaders.set("x-user-id", String(uid));
      if (anyToken.name) newHeaders.set("x-user-name", anyToken.name);
      if (anyToken.email) newHeaders.set("x-user-email", anyToken.email);
    }

    const pathname = req.nextUrl.pathname;
    const segments = pathname.split("/").filter(Boolean);

    let roleInUrl: string | null = null;
    let pageSegments: string[] = [];

    const validRoles = Object.keys(routeAccessMatrix);

    // Determine role and page segments from URL
    if (segments.length > 0) {
      if (
        segments[0] === "unpublic" &&
        segments[1] &&
        validRoles.includes(segments[1].toLowerCase())
      ) {
        roleInUrl = segments[1].toLowerCase();
        pageSegments = segments.slice(2).map((s) => s.toLowerCase());
      } else if (validRoles.includes(segments[0].toLowerCase())) {
        roleInUrl = segments[0].toLowerCase();
        pageSegments = segments.slice(1).map((s) => s.toLowerCase());
      } else {
        roleInUrl = null;
        pageSegments = segments.map((s) => s.toLowerCase());
      }
    }

    if (roleInUrl && validRoles.includes(roleInUrl)) {
      if (!userRole) {
        // Not authenticated
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
      }

      // If user tries to access a different role's route
      if (roleInUrl !== userRole) {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, req.nextUrl.origin)
        );
      }

      // Check the full path (joins all segments) to allow subroutes
      const fullPath = pageSegments.join("/"); // e.g., "orders/123"
      if (fullPath && !isRouteAllowed(userRole, fullPath)) {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, req.nextUrl.origin)
        );
      }
    }

    // Allow request to continue
    return NextResponse.next({ request: { headers: newHeaders } });
  } catch (err) {
    // Don't block request if middleware fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
