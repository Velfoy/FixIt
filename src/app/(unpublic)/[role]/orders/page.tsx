import { OrdersView } from "@/components/pages/OrdersView";
import { authorizePage } from "@/lib/authorize";

export default async function OrdersPage() {
  const session = await authorizePage(["client", "admin", "mechanic"]);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <OrdersView isAdmin={true} />
    </div>
  );
}
