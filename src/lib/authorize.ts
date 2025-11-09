import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function authorizePage(allowedRoles: string[]) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  if (!session) redirect("/login");
  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect(`/${userRole?.toLowerCase() || "client"}/dashboard`);
  }

  return session;
}
