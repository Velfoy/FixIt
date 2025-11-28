// app/admin/users/page.tsx
import { authorizePage } from "@/lib/authorize";
import CustomersView from "../../../../components/pages/CustomerView";
import { Customer } from "@/types/customer";

export default async function CustomersPage() {
  const session = await authorizePage(["admin"]);

  try {
    const response = await fetch(`http://localhost:3000/api/customers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }

    const data: Customer[] = await response.json();

    console.log("Fetched customers:", data.length);

    return <CustomersView dataCustomers={data} session={session} />;
  } catch (error) {
    console.error("Error in CustomersPage:", error);
    return <CustomersView dataCustomers={[]} session={session} />;
  }
}
