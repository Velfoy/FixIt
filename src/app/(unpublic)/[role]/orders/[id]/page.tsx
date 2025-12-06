import { OrderDetailView } from "@/components/pages/OrderDetailView";
import { getCachedSession } from "@/lib/session";
import { Order, ServiceOrders } from "@/types/serviceorders";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage(props: OrderPageProps) {
  const session = await getCachedSession();
  const { id: orderId } = await props.params;
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/orders/${orderId}`,
      {
        cache: "no-store",
      }
    );
    // const dataServiceOrder: ServiceOrders = res.ok ? await res.json() : [];
    const dataServiceOrder: Order = {
      id: Number(orderId),
      orderNumber: "ORD-2025-0001",
      carBrand: "Porsche",
      carModel: "911 Carrera",
      carYear: "2023",
      carLicensePlate: "BT5674BU",
      issue: "Engine repair and oil change",
      description:
        "Complete engine diagnostic performed. Timing belt and oil pump replaced. Routine oil change included. Complete engine diagnostic performed. Timing belt and oil pump replaced. Routine oil change included.",
      status: "COMPLETED",

      endDate: "2025-11-15",
      total_cost: 850,
      progress: 60,
      priority: "HIGH",
      mechanicFirstName: "Mike",
      mechanicLastName: "Johnson",
      mechanicEmail: "mike.johnson@fixitgarage.com",
      mechanicPhone: "+1-555-930-1290",
      task: [], // <-- required but can be empty for mock
    };

    return (
      <OrderDetailView dataServiceOrder={dataServiceOrder} session={session} />
    );
  } catch (error) {
    console.error(error);
    return <OrderDetailView session={session} />;
  }
}
