import { OrderDetailView } from "@/components/pages/OrderDetailView";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  const orderId = params.id;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <OrderDetailView orderId={orderId} />
    </div>
  );
}
