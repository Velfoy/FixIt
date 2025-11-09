import { authorizePage } from "@/lib/authorize";

export default async function DashboardPage() {
  const session = await authorizePage(["ADMIN", "CLIENT", "MECHANIC"]);
  const role = session.user.role;

  return <h1>{role} Dashboard</h1>;
}
