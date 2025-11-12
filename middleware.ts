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
    "users",
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
  warehouse: ["dashboard", "orders", "invoices", "info", "settings", "profile"],
  receptionist: [
    "dashboard",
    "orders",
    "invoices",
    "info",
    "settings",
    "profile",
  ],
};

/**
 * Middleware:
 * 1. Sets lightweight user info headers (role, id, name, email) from NextAuth token
 * 2. Protects role-based routes: redirects if URL role param doesn't match user role
 * 3. Protects route access: redirects if user tries to access a page not allowed for their role
 */
export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = (token as any)?.role?.toLowerCase();

    // copy existing request headers and add our lightweight user headers
    const newHeaders = new Headers(req.headers as any);
    if (token) {
      const anyToken = token as any;
      if (anyToken.role) newHeaders.set("x-user-role", String(anyToken.role));
      const uid = anyToken.id ?? anyToken.sub;
      if (uid) newHeaders.set("x-user-id", String(uid));
      if (anyToken.name) newHeaders.set("x-user-name", String(anyToken.name));
      if (anyToken.email)
        newHeaders.set("x-user-email", String(anyToken.email));
    }

    const pathname = req.nextUrl.pathname;

    // Split path into segments and determine role and page correctly.
    // Examples:
    //  /client/dashboard      -> segments = ["client","dashboard"]
    //  /unpublic/client/info  -> segments = ["unpublic","client","info"]
    const segments = pathname.split("/").filter(Boolean);
    let roleInUrl: string | null = null;
    let pageName: string | null = null;

    if (segments.length > 0) {
      if (segments[0] === "unpublic") {
        roleInUrl = segments[1] ? segments[1].toLowerCase() : null;
        pageName = segments[2] ? segments[2].toLowerCase() : null;
      } else {
        roleInUrl = segments[0] ? segments[0].toLowerCase() : null;
        pageName = segments[1] ? segments[1].toLowerCase() : null;
      }
    }

    if (roleInUrl && !userRole) {
      // user not authenticated but trying to access role area -> send to login
      const loginUrl = new URL(`/login`, req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }

    if (roleInUrl && userRole) {
      // if user tries to access a different role's route, redirect to their role
      if (roleInUrl !== userRole && roleInUrl !== "unpublic") {
        const redirectUrl = new URL(
          `/${userRole}/dashboard`,
          req.nextUrl.origin
        );
        return NextResponse.redirect(redirectUrl);
      }

      // if pageName is provided, check per-route access
      if (pageName) {
        if (!isRouteAllowed(userRole, pageName)) {
          const redirectUrl = new URL(
            `/${userRole}/dashboard`,
            req.nextUrl.origin
          );
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    return NextResponse.next({ request: { headers: newHeaders } });
  } catch (err) {
    // don't break request on middleware failure
    return NextResponse.next();
  }
}

export const config = {
  // run middleware for all app routes (exclude _next assets and static)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
