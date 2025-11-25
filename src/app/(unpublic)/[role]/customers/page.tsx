// app/admin/users/page.tsx
import { authorizePage } from "@/lib/authorize";
import CustomersView from "../../../../components/pages/CustomerView";
import { Customer } from "@/types/customer";

export default async function UsersPage() {
  const session = await authorizePage(["admin"]);
  // const data = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/customers`,
  //   {
  //     headers: {
  //       Cookie: `next-auth.session-token=${session?.user?.sessionToken}`,
  //     },
  //   }
  // ).then((res) => res.json());
  const data: Customer[] = [];

  return <CustomersView dataCustomers={data} session={session} />;
}
