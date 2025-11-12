import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/session";

export default async function RedirectPage() {
  const session = await getCachedSession();
  if (!session?.user) redirect("/login");

  redirect(`/${session.user.role?.toLowerCase()}/dashboard`);
}
