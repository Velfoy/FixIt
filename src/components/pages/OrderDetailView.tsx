"use client";

import { useRouter } from "next/navigation";

interface OrderDetailViewProps {
  orderId: string;
  isAdmin?: boolean;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();

  const orderDetails = {
    id: orderId,
    carModel: "Porsche 911 Carrera",
    carYear: "2023",
    carPlate: "ABC 1234",
    issue: "Engine repair and oil change",
    detailedDescription:
      "Complete engine diagnostic performed. Timing belt and oil pump replaced. Routine oil change included.",
    status: "in-progress",
    mechanicName: "Mike Johnson",
    startDate: "2025-11-13",
    estimatedCompletion: "2025-11-15",
    cost: 850,
  };

  const handleBack = () => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const roleSegment = segments[0] || "client"; // fallback to client
    router.push(`/${roleSegment}/orders`);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 20 }}>
      <h1>Order #{orderDetails.id}</h1>
      <p>
        {orderDetails.carModel} ({orderDetails.carYear}) •{" "}
        {orderDetails.carPlate}
      </p>
      <p>{orderDetails.detailedDescription}</p>
      <p>Status: {orderDetails.status}</p>
      <p>Mechanic: {orderDetails.mechanicName}</p>
      <p>Estimated Completion: {orderDetails.estimatedCompletion}</p>
      <p>Cost: ${orderDetails.cost}</p>
      <button onClick={handleBack}>← Back</button>
    </div>
  );
}
