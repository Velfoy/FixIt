import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <ProtectedLayout session={session}>{children}</ProtectedLayout>;
}
