import { OrdersView } from "@/components/pages/OrdersView";
import { authorizePage } from "@/lib/authorize";
import { ServiceOrders } from "@/types/serviceorders";

export default async function OrdersPage() {
  const session = await authorizePage(["client", "admin", "mechanic"]);
  if (session?.user?.role === "ADMIN") {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/orders`, {
        cache: "no-store",
      });
      const dataServiceOrders: ServiceOrders[] = res.ok ? await res.json() : [];
      return (
        <OrdersView dataServiceOrders={dataServiceOrders} session={session} />
      );
    } catch (error) {
      console.error(error);
      return <OrdersView dataServiceOrders={[]} session={session} />;
    }
  } else {
    return <OrdersView dataServiceOrders={[]} session={session} />;
  }
}
