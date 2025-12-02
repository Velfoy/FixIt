"use client";

import { useState } from "react";
import { CreateOrderModal } from "./CreateOrderModal";

interface OrdersViewProps {
  isAdmin?: boolean;
}

interface Order {
  id: string;
  carModel: string;
  carYear: string;
  issue: string;
  status: "pending" | "in-progress" | "completed";
  progress: number;
  estimatedCompletion: string;
  mechanicName: string;
  cost: number;
}

export function OrdersView({ isAdmin = false }: OrdersViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "123",
      carModel: "Porsche 911 Carrera",
      carYear: "2023",
      issue: "Engine repair and oil change",
      status: "in-progress",
      progress: 65,
      estimatedCompletion: "2 days",
      mechanicName: "Mike Johnson",
      cost: 850,
    },
    {
      id: "124",
      carModel: "BMW M4 Competition",
      carYear: "2022",
      issue: "Brake system replacement",
      status: "completed",
      progress: 100,
      estimatedCompletion: "Completed",
      mechanicName: "Sarah Williams",
      cost: 1200,
    },
  ]);

  const handleCreateOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);
  };

  const handleSelectOrder = (orderId: string) => {
    // Detect current role from URL
    const segments = window.location.pathname.split("/").filter(Boolean);
    const roleSegment = segments[0] || "client"; // fallback
    window.location.href = `/${roleSegment}/orders/${orderId}`;
  };

  return (
    <div>
      <h2>{isAdmin ? "Order Management" : "Your Orders"}</h2>
      {isAdmin && (
        <button onClick={() => setShowCreateModal(true)}>+ Create Order</button>
      )}

      <div>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              margin: 10,
              padding: 10,
              cursor: "pointer",
            }}
            onClick={() => handleSelectOrder(order.id)}
          >
            <h3>{order.carModel}</h3>
            <p>Order #{order.id}</p>
            <p>{order.issue}</p>
            <p>Status: {order.status}</p>
            <p>Mechanic: {order.mechanicName}</p>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreateOrder={handleCreateOrder}
        />
      )}
    </div>
  );
}
