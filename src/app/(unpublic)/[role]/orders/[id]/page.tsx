import { OrderDetailView } from "@/components/pages/OrderDetailView";
import { getCachedSession } from "@/lib/session";
import { Order } from "@/types/serviceorders";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await getCachedSession();
  const { id: orderId } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/orders/${orderId}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to fetch order: ${res.status} ${text}`);
    }

    const dataServiceOrder: Order = await res.json();

    return (
      <OrderDetailView dataServiceOrder={dataServiceOrder} session={session} />
    );
  } catch (error) {
    console.error("Error in OrderPage:", error);
    return <OrderDetailView session={session} />;
  }
}
